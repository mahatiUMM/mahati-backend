import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test GET /api/blood_pressure", () => {
  it("should return 200 when getting all blood pressure by user", async () => {
    const response = await supertest(app)
      .get("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: expect.arrayContaining([
        expect.objectContaining({
          user_id: 3,
          image: expect.any(String),
          sistol: expect.any(Number),
          diastole: expect.any(Number),
          heartbeat: expect.any(Number),
          created_at: expect.any(String),
          updated_at: expect.any(String)
        })
      ])
    });
  });

  it("should return 401 when token is not provided", async () => {
    const response = await supertest(app)
      .get("/api/blood_pressure");

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided",
    });
  });

  it("should return 402 when token is invalid or expired", async () => {
    const response = await supertest(app)
      .get("/api/blood_pressure")
      .set("Authorization", `Bearer invalid`);

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt malformed",
    });
  });

  it("should return 404 when endpoint not correct", async () => {
    const response = await supertest(app)
      .get("/api/blood_pressure_incorrect")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({});
  });

  it("should handle errors in the getAllBloodPressure controller", async () => {
    jest.spyOn(prisma.blood_pressures, "findMany").mockRejectedValue(new Error("Error from the test"));

    const response = await supertest(app)
      .get("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
});

describe("test GET /api/blood_pressure/:id", () => {
  it("should return 200 when getting blood pressure by id", async () => {
    const latestPressure = await prisma.blood_pressures.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .get(`/api/blood_pressure/${latestPressure.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: latestPressure.id,
        user_id: 3,
        image: expect.any(String),
        sistol: expect.any(Number),
        diastole: expect.any(Number),
        heartbeat: expect.any(Number),
        created_at: expect.any(String),
        updated_at: null
      }
    });
  });

  it("should return 404 when blood pressure record not found", async () => {
    const response = await supertest(app)
      .get(`/api/blood_pressure/999999`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      status: 404,
      message: "Blood pressure record not found."
    });
  });

  it("should return 401 when token is not provided", async () => {
    const response = await supertest(app)
      .get("/api/blood_pressure/1");

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided"
    });
  });

  it("should handle errors in the getDetailedBloodPressureById controller", async () => {
    jest.spyOn(prisma.blood_pressures, "findUnique").mockRejectedValue(new Error("Error from the test"));

    const response = await supertest(app)
      .get("/api/blood_pressure/1")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });

});
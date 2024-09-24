import supertest from "supertest";
import app from "../../../app";

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
})
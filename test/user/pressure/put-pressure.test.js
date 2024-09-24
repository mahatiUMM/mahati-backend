import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test PUT /api/blood_pressure/:id", () => {
  it("should return 200 when updating blood pressure", async () => {
    const latestPressure = await prisma.blood_pressures.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .put(`/api/blood_pressure/${latestPressure.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .field("sistol", 121)
      .field("diastole", 81)
      .field("heartbeat", 71);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: expect.any(Number),
        user_id: 3,
        image: expect.any(String),
        sistol: 121,
        diastole: 81,
        heartbeat: 71,
        created_at: expect.any(String),
        updated_at: null
      }
    });
  });

  it("should return 404 when blood pressure record not found", async () => {
    const response = await supertest(app)
      .put(`/api/blood_pressure/999999`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .field("sistol", 121)
      .field("diastole", 81)
      .field("heartbeat", 71);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      status: 404,
      message: "Blood pressure record not found."
    });
  });

  it("should return 401 when token is not provided", async () => {
    const latestPressure = await prisma.blood_pressures.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .put(`/api/blood_pressure/${latestPressure.id}`)
      .field("sistol", 121)
      .field("diastole", 81)
      .field("heartbeat", 71);

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided"
    });
  })
})
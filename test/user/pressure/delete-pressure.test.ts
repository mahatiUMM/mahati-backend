import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";
import e from "express";

describe("test DELETE /api/blood_pressure/:id", () => {
  it("should return 200 when deleting a blood pressure", async () => {
    const latestPressure = await prisma.blood_pressures.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .delete(`/api/blood_pressure/${latestPressure?.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: expect.any(Number),
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

  it("should return 500 when blood pressure not found", async () => {
    const response = await supertest(app)
      .delete(`/api/blood_pressure/999999`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({});
  });

  it("should return 401 when token is not provided", async () => {
    const latestPressure = await prisma.blood_pressures.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .delete(`/api/blood_pressure/${latestPressure?.id}`)
      .send();

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      "status": 401,
      "message": "Unauthorized: jwt must be provided",
    });
  })
})
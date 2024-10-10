import supertest from "supertest";
import app from "../../../app";

describe("test POST /api/reminder", () => {
  it("should return 201 when creating reminder", async () => {
    const response = await supertest(app)
      .post("/api/reminder")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "user_id": 3,
        "medicine_name": "Test Panadol",
        "medicine_taken": 2,
        "medicine_total": 2,
        "amount": 4,
        "cause": "Sakit kepala",
        "cap_size": 1,
        "medicine_time": "23:21"
      });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: expect.any(Number),
        user_id: 3,
        medicine_name: "Test Panadol",
        medicine_taken: 2,
        medicine_total: 2,
        amount: 4,
        cause: "Sakit kepala",
        cap_size: 1,
        created_at: expect.any(String),
        updated_at: null,
        medicine_time: "23:21"
      }
    })
  });

  it("should return 400 when missing required fields", async () => {
    const response = await supertest(app)
      .post("/api/reminder")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "user_id": 3,
        "medicine_total": 2,
        "amount": 4,
        "cause": "Sakit kepala",
        "cap_size": 1,
        "medicine_time": "23:21"
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Please provide all required fields",
    })
  });
})
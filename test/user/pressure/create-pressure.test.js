import supertest from "supertest";
import app from "../../../app";

describe("test POST /api/blood_pressure", () => {
  it("should return 201 when creating blood pressure", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .send({
        "user_id": 3,
        "sistol": 120,
        "diastole": 80,
        "heartbeat": 70,
      });

    console.log(response.body);
  })
})
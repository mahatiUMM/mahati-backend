import supertest from "supertest";
import app from "../../../app";

describe("test GET /api/reminder", () => {
  it("should return 200 when getting all reminder by user", async () => {
    const response = await supertest(app)
      .get("/api/reminder")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          user_id: 3,
          medicine_name: expect.any(String),
          medicine_taken: expect.any(Number),
          medicine_total: expect.any(Number),
          amount: expect.any(Number),
          cause: expect.any(String),
          cap_size: expect.any(Number),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          schedules: expect.any(Array)
        })
      ])
    })
  });
})
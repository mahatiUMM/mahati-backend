import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test DELETE /api/reminder/:id", () => {
  it("should return 200 when deleting reminder by id", async () => {
    const latestReminder = await prisma.reminders.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .delete(`/api/reminder/${latestReminder.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        deletedReminder: {
          id: expect.any(Number),
          user_id: 3,
          medicine_name: expect.any(String),
          medicine_taken: expect.any(Number),
          medicine_total: expect.any(Number),
          amount: expect.any(Number),
          cause: expect.any(String),
          cap_size: expect.any(Number),
          created_at: expect.any(String),
          updated_at: null,
          medicine_time: expect.any(String)
        }
      }
    })
  })
})
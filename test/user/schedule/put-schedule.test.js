import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test PUT /api/schedule/:id", () => {
  it("should return success true when updating schedule by id", async () => {
    const latestSchedule = await prisma.schedules.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .put(`/api/schedule/${latestSchedule.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        reminder_id: latestSchedule.reminder_id,
        time: "2024-12-15T10:00:00Z",
        status: 1
      });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: expect.any(Object)
    });
  });
});
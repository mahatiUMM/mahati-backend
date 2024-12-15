import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test POST /api/schedule", () => {
  afterAll(async () => {
    const latestSchedule = await prisma.schedules.findFirst({
      orderBy: {
        created_at: "desc"
      }
    })

    await prisma.schedules.delete({
      where: {
        id: latestSchedule.id
      }
    });
  })

  it("should return 201 when creating schedule", async () => {
    /**
     * Adjust with your user_id
     */
    const latestReminder = await prisma.reminders.findFirst({
      where: {
        user_id: 3
      },
      orderBy: {
        created_at: "desc"
      }
    })

    const response = await supertest(app)
      .post("/api/schedule")
      .send({
        reminder_id: latestReminder.id,
        time: "2024-12-15T10:00:00Z",
        status: 0
      });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      success: true,
      data: expect.any(Object)
    });
  });
});
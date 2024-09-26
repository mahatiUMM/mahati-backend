import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test PUT /api/reminder/:id", () => {
  it("should return 200 when updating a reminder", async () => {
    const latestReminder = await prisma.reminders.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .put(`/api/reminder/${latestReminder?.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        user_id: 3,
        medicine_name: "Test Panadol Update",
        medicine_taken: 1,
        amount: 2,
        cause: "Sakit Kepala Update",
        cap_size: 2,
        medicine_time: "23:30"
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: expect.any(Number),
        user_id: 3,
        medicine_name: "Test Panadol Update",
        medicine_taken: 1,
        medicine_total: 1,
        amount: 2,
        cause: "Sakit Kepala Update",
        cap_size: 2,
        created_at: expect.any(String),
        updated_at: null,
        medicine_time: "23:30",
        schedules: expect.any(Array)
      }
    })
  })
})
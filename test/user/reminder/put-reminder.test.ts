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

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        
      }
    })
  })
})
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

    const randomNumber = Math.floor(Math.random() * 1000);

    const response = await supertest(app)
      .put(`/api/reminder/${latestReminder?.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        user_id: 3,
        medicine_name: `Test Panadol Update ${randomNumber}`,
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
        medicine_name: `Test Panadol Update ${randomNumber}`,
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
  });

  it("should return 401 when token is not provided", async () => {
    const latestReminder = await prisma.reminders.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .put(`/api/reminder/${latestReminder?.id}`)
      .send({
        user_id: latestReminder?.user_id,
        medicine_name: latestReminder?.medicine_name,
        medicine_taken: latestReminder?.medicine_taken,
        amount: latestReminder?.amount,
        cause: latestReminder?.cause,
        cap_size: latestReminder?.cap_size,
        medicine_time: latestReminder?.medicine_time
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided"
    });
  });

  it("should return 400 when amount - medicine_taken is less than 0", async () => {
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
        amount: 0,
        cause: "Sakit Kepala Update",
        cap_size: 2,
        medicine_time: "23:30"
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: `Obat Tidak boleh kosong, mohon isi ulang obat Test Panadol Update`
    });
  });

  it("should handle errors in the updateReminder controller", async () => {
    jest.spyOn(prisma.reminders, 'update').mockRejectedValue(new Error('Something went wrong'));

    const response = await supertest(app)
      .put('/api/reminder/1')
      .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        user_id: 1,
        medicine_name: 'Test Panadol Update',
        medicine_taken: 1,
        amount: 2,
        cause: 'Sakit Kepala Update',
        cap_size: 2,
        medicine_time: '23:30',
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({});
  });
});
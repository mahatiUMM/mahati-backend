import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

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

  it("should return 401 when token is not provided", async () => {
    const response = await supertest(app)
      .get("/api/reminder")

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided"
    })
  });

  it("should handle errors in the getAllReminders controller", async () => {
    jest.spyOn(prisma.reminders, "findMany").mockRejectedValue(new Error("Error from the test"));

    const response = await supertest(app)
      .get("/api/reminder")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
});

describe("test GET /api/reminder/:id", () => {
  it("should return 200 when getting reminder by id", async () => {
    const latestReminder = await prisma.reminders.findFirst({
      orderBy: {
        id: "desc"
      }
    });

    const response = await supertest(app)
      .get(`/api/reminder/${latestReminder.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: latestReminder.id,
        user_id: latestReminder.user_id,
        medicine_name: latestReminder.medicine_name,
        medicine_taken: latestReminder.medicine_taken,
        medicine_time: latestReminder.medicine_time,
        medicine_total: latestReminder.medicine_total,
        amount: latestReminder.amount,
        cause: latestReminder.cause,
        cap_size: latestReminder.cap_size,
        created_at: expect.any(String),
        updated_at: latestReminder.updated_at,
        schedules: expect.any(Array)
      }
    });
  });

  it("should return 404 when reminder id not found", async () => {
    const response = await supertest(app)
      .get("/api/reminder/999")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      status: 404,
      message: "Reminder not found."
    });
  });

  it("should return 401 when token is not provided", async () => {
    const response = await supertest(app)
      .get("/api/reminder/1");

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided"
    });
  });

  it("should handle errors in the getReminderById controller", async () => {
    jest.spyOn(prisma.reminders, "findUnique").mockImplementation(new Error("Error from the test."));

    const response = await supertest(app)
      .get("/api/reminder/1")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  })
});
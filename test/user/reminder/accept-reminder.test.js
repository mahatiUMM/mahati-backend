import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

jest.mock("../../../app/lib/dbConnect", () => ({
  prisma: {
    reminders: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
    schedules: {
      create: jest.fn(),
    },
  },
}));

describe("test POST /api/accept_reminder/:id", () => {
  it("should return 200 when accepting reminder", async () => {
    const mockReminder = {
      id: 1,
      user_id: 1,
      medicine_name: "Test Panadol",
      medicine_taken: 0,
      amount: 5,
      cause: "Headache",
      cap_size: "Large",
      created_at: new Date(),
      updated_at: new Date(),
      medicine_time: "09:00",
      schedules: [],
    };

    const mockSchedule = {
      id: 1,
      reminder_id: mockReminder.id,
      status: 0,
      time: new Date(),
      created_at: new Date(),
      updated_at: null,
    };

    prisma.reminders.findFirst.mockResolvedValue(mockReminder);
    prisma.reminders.findUnique.mockResolvedValue(mockReminder);
    prisma.reminders.update.mockResolvedValue({
      ...mockReminder,
      medicine_taken: 1,
      amount: 4,
      updated_at: new Date(),
    });
    prisma.schedules.create.mockResolvedValue(mockSchedule);

    const response = await supertest(app)
      .post(`/api/accept_reminder/${mockReminder.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        updatedReminder: {
          id: mockReminder.id,
          user_id: mockReminder.user_id,
          medicine_name: mockReminder.medicine_name,
          medicine_taken: 1,
          amount: 4,
          cause: mockReminder.cause,
          cap_size: mockReminder.cap_size,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          medicine_time: mockReminder.medicine_time,
          schedules: expect.any(Array),
        },
        createSchedules: {
          id: expect.any(Number),
          reminder_id: mockReminder.id,
          time: expect.any(String),
          status: 0,
          created_at: expect.any(String),
          updated_at: null,
        },
      },
    });
  });

  it("should return 401 when token is not provided", async () => {
    const response = await supertest(app)
      .post(`/api/accept_reminder/1`)
      .send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided",
    });
  })
});

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
  });

  it("should return 404 when reminder record not found", async () => {
    const response = await supertest(app)
      .delete(`/api/reminder/999999`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send();

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      success: false, message: "Reminder not found."
    });
  });

  it("should return 401 when token is not provided", async () => {
    const latestReminder = await prisma.reminders.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .delete(`/api/reminder/${latestReminder.id}`)
      .send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided",
    });
  });

  it("should handle errors in the deleteReminder controller", async () => {
    jest.spyOn(prisma.reminders, "findUnique").mockResolvedValue({
      id: 1,
      user_id: 3,
      medicine_name: "Test Reminder",
    });

    jest.spyOn(prisma.reminders, "delete").mockRejectedValue(new Error("Something went wrong"));

    const response = await supertest(app)
      .delete(`/api/reminder/1`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send();

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
});
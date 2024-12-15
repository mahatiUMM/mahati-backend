import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

jest.mock("../../../app/lib/dbConnect", () => ({
  prisma: {
    schedules: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("test DELETE /api/schedule/:id", () => {
  it("should return success true when deleting schedule by id", async () => {
    // Mock data
    const mockSchedule = {
      id: 1,
      reminder_id: 2,
      time: "2024-12-15T10:00:00Z",
      status: 0,
      created_at: new Date(),
    };

    prisma.schedules.findFirst.mockResolvedValue(mockSchedule);
    prisma.schedules.findUnique.mockResolvedValue(mockSchedule);
    prisma.schedules.delete.mockResolvedValue({});

    const response = await supertest(app)
      .delete(`/api/schedule/${mockSchedule.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      message: "Schedule deleted successfully.",
    });

    expect(prisma.schedules.delete).toHaveBeenCalledWith({
      where: { id: mockSchedule.id },
    });
  });
});

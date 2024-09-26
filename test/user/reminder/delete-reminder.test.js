import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test DELETE /api/reminder/:id", () => {
  it("should return 200 when deleting reminder by id", async () => {
    // const latestReminder = await  

    const response = await supertest(app)
      .delete("/api/reminder")
  })
})
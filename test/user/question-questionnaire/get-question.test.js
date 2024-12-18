import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test GET /api/questionnaire_question", () => {
  it("should return success true when getting all questionnaire questions", async () => {
    const response = await supertest(app)
      .get("/api/questionnaire_question")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    console.log(response.body);
  });

  it("should return 401 when no token provided", async () => {
    const response = await supertest(app)
      .get("/api/questionnaire_question");

    console.log(response.body);
  });

  it("should return 401 when invalid token provided", async () => {
    const response = await supertest(app)
      .get("/api/questionnaire_question")
      .set("Authorization", `Bearer invalidtoken`);

    console.log(response.body);
  });
});
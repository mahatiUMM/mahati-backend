import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test GET /api/questionnaire", () => {
  it("should return 200 when getting all questionnaire by user", async () => {
    const response = await supertest(app)
      .get("/api/questionnaire")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: expect.any(Array)
    });
  });

  it("should return 401 when token is not provided", async () => {
    const response = await supertest(app)
      .get("/api/questionnaire");

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided",
    });
  });

  it("should return 402 when token is invalid or expired", async () => {
    const response = await supertest(app)
      .get("/api/questionnaire")
      .set("Authorization", `Bearer invalid`);

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt malformed",
    });
  });

  it("should return 500 when error occurs", async () => {
    jest.spyOn(prisma.questionnaires, "findMany").mockRejectedValue(new Error());

    const response = await supertest(app)
      .get("/api/questionnaire")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
});

describe("test GET /api/questionnaire/:id", () => {
  it("should return 200 when getting questionnaire by id", async () => {
    const latestQuestionnaire = await prisma.questionnaires.findFirst({
      orderBy: {
        id: "desc"
      }
    });

    const response = await supertest(app)
      .get(`/api/questionnaire/${latestQuestionnaire.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: expect.any(Object)
    });
  });

  it("should return 401 when token is not provided", async () => {
    const response = await supertest(app)
      .get("/api/questionnaire/1");

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided",
    });
  });

  it("should return 402 when token is invalid or expired", async () => {
    const response = await supertest(app)
      .get("/api/questionnaire/1")
      .set("Authorization", `Bearer invalid`);

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt malformed",
    });
  });

  it("should return 404 when questionnaire is not found", async () => {
    const response = await supertest(app)
      .get("/api/questionnaire/999")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      status: 404,
      message: "Questionnaire not found.",
    });
  });

  it("should return 500 when error occurs", async () => {
    jest.spyOn(prisma.questionnaires, "findUnique").mockRejectedValue(new Error());

    const response = await supertest(app)
      .get("/api/questionnaire/1")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
});
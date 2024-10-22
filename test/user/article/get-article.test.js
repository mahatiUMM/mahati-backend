import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test GET /api/article", () => {
  it("should return 200 when getting all articles", async () => {
    const response = await supertest(app)
      .get("/api/article")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          description: expect.any(String),
          file: expect.any(String),
          created_at: expect.any(String),
          updated_at: null
        })
      ])
    });
  });

  it("should return 401 when token is not provided", async () => {
    const reponse = await supertest(app)
      .get("/api/article");

    expect(reponse.status).toEqual(401);
    expect(reponse.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided"
    });
  });

  it("should return 402 when token is invalid or expired", async () => {
    const response = await supertest(app)
      .get("/api/article")
      .set("Authorization", `Bearer invalid`);

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt malformed"
    })
  });

  it("should return 404 when endpoint not correct", async () => {
    const response = await supertest(app)
      .get("/api/article_incorrect")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({});
  });

  it("should handle errors in the getAllArticle controller", async () => {
    jest.spyOn(prisma.articles, "findMany").mockImplementation(() => {
      throw new Error("Error for testing purpose");
    });

    const response = await supertest(app)
      .get("/api/article")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
});

describe("test GET /api/article/:id", async () => {
  it("should return 200 when getting article by id", async () => {

  });
});
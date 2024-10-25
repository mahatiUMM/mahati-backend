import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test DELETE /api/article/:id", () => {
  it("should return 200 when deleting reminder by id", async () => {
    const latestArticle = await prisma.articles.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .delete(`/api/article/${latestArticle.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      message: "Article deleted."
    });
  });

  it("should return 404 when article record not found", async () => {
    const response = await supertest(app)
      .delete(`/api/article/999999`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send();

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      status: 404,
      message: "Article not found."
    });
  });

  it("should return 401 when token is not provided", async () => {
    const latestArticle = await prisma.articles.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .delete(`/api/article/${latestArticle.id}`)
      .send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided"
    });
  });

  it("should handle errors in the deleteArticle controller", async () => {
    jest.spyOn(prisma.articles, "delete").mockRejectedValue(new Error("Error from the test"));

    const response = await supertest(app)
      .delete("/api/article/1")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send();

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  })
})
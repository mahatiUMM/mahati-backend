import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test PUT /api/article", () => {
  it("should return 200 when updating article", async () => {
    const latestArticle = await prisma.articles.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .put(`/api/article/${latestArticle.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        title: "Title from test updated",
        description: "Description from test updated"
      });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: latestArticle.id,
        title: "Title from test updated",
        description: "Description from test updated",
        file: latestArticle.file,
        created_at: expect.any(String),
        updated_at: null
      }
    });
  });

  it("should return 404 when article id is not found", async () => {
    const response = await supertest(app)
      .put("/api/article/999999")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        title: "Title from test updated",
        description: "Description from test updated"
      });

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      status: 404,
      message: "Article not found."
    });
  });

  it("should return 401 when token is not provided", async () => {
    const response = await supertest(app)
      .put("/api/article/1")
      .send({
        title: "Title from test updated",
        description: "Description from test updated"
      });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided"
    });
  });

  it("should return 401 when token is not valid", async () => {
    const response = await supertest(app)
      .put("/api/article/1")
      .set("Authorization", `Bearer invalid`)
      .send({
        title: "Title from test updated",
        description: "Description from test updated"
      });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt malformed"
    });
  });

  it("should return 400 when title or description is not provided", async () => {
    const latestArticle = await prisma.articles.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .put(`/api/article/${latestArticle.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        description: ""
      })

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: "Please fill all required fields."
    });
  });

  it("should handle errors in the updateArticle controller", async () => {
    jest.spyOn(prisma.articles, "update").mockRejectedValue(new Error("Error from the test"));

    const latestArticle = await prisma.articles.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .put(`/api/article/${latestArticle.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        title: "Title from test updated",
        description: "Description from test updated"
      });

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
});
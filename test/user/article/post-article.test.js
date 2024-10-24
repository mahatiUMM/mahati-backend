import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test POST /api/article", () => {
  afterAll(async () => {
    await prisma.articles.findFirst({
      orderBy: {
        created_at: "desc"
      }
    }).then(async (latestArticle) => {
      await prisma.articles.delete({
        where: {
          id: latestArticle.id
        }
      });
    })
  });

  it("should return 201 when creating article", async () => {
    const filePath = `${__dirname}/assets/cv-rizky-v3.pdf`;
    const response = await supertest(app)
      .post("/api/article")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .set("Content-Type", "multipart/form-data")
      .field("title", "Title from test")
      .field("description", "Description from test")
      .attach("pdf", filePath);

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      success: true,
      data: expect.objectContaining({
        id: expect.any(Number),
        title: "Title from test",
        description: "Description from test",
        file: expect.any(String),
        created_at: expect.any(String),
        updated_at: null
      })
    });
  });

  it("should return 400 when missing required fields", async () => {
    const response = await supertest(app)
      .post("/api/article")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "description": "Description from test"
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: "Please upload a pdf file."
    })
  });

  it("should return 401 when token is not provided", async () => {
    const filePath = `${__dirname}/assets/cv-rizky-v3.pdf`;
    const response = await supertest(app)
      .post("/api/article")
      .set("Content-Type", "multipart/form-data")
      .field("title", "Title from test")
      .field("description", "Description from test")
      .attach("pdf", filePath);

    console.log(response.body);
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided"
    });
  })
})
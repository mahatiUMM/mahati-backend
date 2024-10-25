import supertest from "supertest";
import app from "../../../app";

describe("test POST /api/article", () => {
  it("should return 201 when creating article", async () => {
    const filePath = `${__dirname}/assets/cv-rizky-v3.pdf`;
    const response = await supertest(app)
      .post("/api/article")
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
    const filePath = `${__dirname}/assets/cv-rizky-v3.pdf`;
    const response = await supertest(app)
      .post("/api/article")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .field("description", "Description from test")
      .attach("pdf", filePath);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: "Please fill all required fields."
    })
  });
})
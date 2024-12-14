import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test POST /api/brochure", () => {
  it("should return 201 when creating brochure", async () => {
    const filePath = `${__dirname}/assets/Frame.png`;
    const response = await supertest(app)
      .post("/api/brochure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .set("Content-Type", "multipart/form-data")
      .field("title", "Title")
      .attach("images", filePath);

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: expect.any(Number),
        images: expect.any(Array),
        title: "Title",
        created_at: expect.any(String),
        updated_at: null,
      },
    });
  });

  it("should return 400 when image is not provided", async () => {
    const response = await supertest(app)
      .post("/api/brochure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({ title: "Title" });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: "Please upload an image file.",
    });
  });

  it("should return 400 when token is not provided", async () => {
    const response = await supertest(app)
      .post("/api/brochure")
      .send({ title: "Title" });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: "Please upload an image file.",
    });
  });

  it("should return 400 when token is invalid or expired", async () => {
    const filePath = `${__dirname}/assets/Frame.png`;
    const response = await supertest(app)
      .post("/api/brochure")
      .set("Authorization", "Bearer invalid")
      .send({
        title: "Title",
        images: filePath,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: "Please upload an image file.",
    });
  });

  it("should return 500 when error occurs", async () => {
    jest.spyOn(prisma.brochures, "create").mockRejectedValue(new Error());

    const filePath = `${__dirname}/assets/Frame.png`;
    const response = await supertest(app)
      .post("/api/brochure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .set("Content-Type", "multipart/form-data")
      .field("title", "Title")
      .attach("images", filePath);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
});

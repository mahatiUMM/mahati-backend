import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test GET /api/bookmark", () => {
  it("should return 200 when getting all bookmark by user", async () => {
    const response = await supertest(app)
      .get("/api/bookmark")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          video_id: expect.any(Number),
          user_id: expect.any(Number),
          created_at: expect.any(String),
          updated_at: null
        })
      ])
    })
  });

  it("should return 401 when token is not provided", async () => {
    const response = await supertest(app)
      .get("/api/bookmark");

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided",
    });
  });

  it("should return 402 when token is invalid or expired", async () => {
    const response = await supertest(app)
      .get("/api/bookmark")
      .set("Authorization", `Bearer invalid`);

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt malformed",
    });
  });

  it("should return 404 when endpoint not correct", async () => {
    const response = await supertest(app)
      .get("/api/bookmark_incorrect")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({});
  });

  it("should handle errors in the getAllBookmark controller", async () => {
    jest.spyOn(prisma.bookmarks, "findMany").mockRejectedValue(new Error("Error from the test"));

    const response = await supertest(app)
      .get("/api/bookmark")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  })
});

describe("test GET /api/bookmark/:id", () => {
  jest.spyOn(prisma.bookmarks, "findUnique").mockResolvedValue({
    id: 1,
    video_id: 1,
    user_id: 3,
    created_at: new Date(),
    updated_at: null
  });

  it("should return 200 when getting bookmark by id", async () => {
    const response = await supertest(app)
      .get("/api/bookmark/1")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: expect.any(Number),
        video_id: expect.any(Number),
        user_id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: null
      }
    });
  });

  it("should return 401 when token is not provided", async () => {
    const response = await supertest(app)
      .get("/api/bookmark/1");

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided",
    });
  });

  it("should return 402 when token is invalid or expired", async () => {
    const response = await supertest(app)
      .get("/api/bookmark/1")
      .set("Authorization", `Bearer invalid`);

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt malformed",
    });
  });

  it("should handle errors in the getBookmarkById controller", async () => {
    jest.spyOn(prisma.bookmarks, "findUnique").mockRejectedValue(new Error("Error from the test"));

    const response = await supertest(app)
      .get("/api/bookmark/1")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
})
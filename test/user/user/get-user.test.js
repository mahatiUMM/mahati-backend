import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test GET /api/profile", () => {
  it("should return 200 when getting user profile", async () => {
    const response = await supertest(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      status: 200,
      user: expect.any(Object)
    });
  });

  it("should return 401 when token is not provided", async () => {
    const response = await supertest(app)
      .get("/api/profile");

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided",
    });
  });

  it("should return 402 when token is invalid or expired", async () => {
    const response = await supertest(app)
      .get("/api/profile")
      .set("Authorization", `Bearer invalid`);

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt malformed",
    });
  });

  it("should return 500 when error occurs", async () => {
    jest.spyOn(prisma.users, "findUnique").mockRejectedValue(new Error());

    const response = await supertest(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
});
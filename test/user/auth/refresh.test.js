import supertest from "supertest";
import app from "../../../app";

describe("test POST /api/refresh_token", () => {
  it("should return 401 when token is not provided", async () => {
    const response = await supertest(app)
      .post("/api/refresh_token");

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided",
    });
  });

  it("should return 402 when token is invalid or expired", async () => {
    const response = await supertest(app)
      .post("/api/refresh_token")
      .set("Authorization", `Bearer invalid`);

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided",
    });
  });

  it("should return 404 when endpoint not correct", async () => {
    const response = await supertest(app)
      .post("/api/refresh_token_incorrect")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({});
  });
});
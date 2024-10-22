import supertest from "supertest";
import app from "../../../app.js";
import { prisma } from "../../../app/lib/dbConnect.js";

describe("test POST /auth/login", () => {
  it("should return 200 when logging in", async () => {
    const response = await supertest(app)
      .post("/api/signin")
      .send({
        "email": process.env.USER_EMAIL,
        "password": process.env.USER_PASSWORD
      })

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      status: 200,
      user_id: 3,
      access_token: expect.any(String),
      refresh_token: expect.any(String),
      refresh_token_md5: expect.any(String)
    });
  });

  it("should return 404 when email is empty", async () => {
    const response = await supertest(app)
      .post("/api/signin")
      .send({
        "email": "",
        "password": ""
      })

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      status: 404,
      message: "Pengguna tidak ditemukan"
    });
  });

  it("should return 422 when password is wrong", async () => {
    const response = await supertest(app)
      .post("/api/signin")
      .send({
        "email": process.env.USER_EMAIL,
        "password": "wrongpassword"
      })

    expect(response.status).toEqual(422);
    expect(response.body).toEqual({
      status: 422,
      message: "Password salah!"
    });
  });

  it("should return 404 when email is not registered", async () => {
    const response = await supertest(app)
      .post("/api/signin")
      .send({
        "email": "notregistered@gmail.com",
        "password": "password"
      })

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      status: 404,
      message: "Pengguna tidak ditemukan"
    });
  });

  it("should return 404 when email is number", async () => {
    const response = await supertest(app)
      .post("/api/signin")
      .send({
        "email": "081234567890",
        "password": "password"
      })

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      status: 404,
      message: "Pengguna tidak ditemukan"
    });
  });

  it("should handle error in signIn controller", async () => {
    jest.spyOn(prisma.users, "findFirst").mockRejectedValue(new Error("Error from the test"));

    const response = await supertest(app)
      .post("/api/signin")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
});
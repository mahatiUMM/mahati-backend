import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("admin test POST /auth/login", () => {
  it("should return 200 when logging in with admin account", async () => {
    const response = await supertest(app)
      .post("/api/admin/signin")
      .send({
        "email": process.env.ADMIN_EMAIL,
        "password": process.env.ADMIN_PASSWORD
      });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      status: 200,
      user_id: expect.any(Number),
      access_token: expect.any(String),
      refresh_token: expect.any(String),
      refresh_token_md5: expect.any(String)
    });
  });

  it("should return 404 when email is empty", async () => {
    const response = await supertest(app)
      .post("/api/admin/signin")
      .send({
        "email": "",
        "password": ""
      });

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      status: 404,
      message: "User not found"
    });
  });

  it("should return 422 when password is wrong", async () => {
    const response = await supertest(app)
      .post("/api/admin/signin")
      .send({
        "email": process.env.ADMIN_EMAIL,
        "password": "wrongpassword"
      });

    expect(response.status).toEqual(422);
    expect(response.body).toEqual({
      status: 422,
      message: "Password salah!"
    })
  })

  it("should return 404 when email is not registered", async () => {
    const response = await supertest(app)
      .post("/api/admin/signin")
      .send({
        "email": "notregistered@gmail.com",
        "password": "password"
      })

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      status: 404,
      message: "User not found"
    });
  });

  it("should return 404 when email is number", async () => {
    const response = await supertest(app)
      .post("/api/admin/signin")
      .send({
        "email": "081234567890",
        "password": "password"
      })

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      status: 404,
      message: "User not found"
    });
  });

  it("should handle error in signIn with admin account", async () => {
    jest.spyOn(prisma.users, "findFirst").mockImplementation(new Error("Error occurred"));

    const response = await supertest(app)
      .post("/api/admin/signin")
      .send({
        "email": "adminmahati@gmail.com",
        "password": "rOIF0FcQa4JXExJ"
      });

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
});

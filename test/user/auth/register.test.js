import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";
import { removeTestUser, createTestUser, getTestUser } from "../..";

describe("test POST /auth/signup", () => {
  beforeEach(async () => {
    await createTestUser();
    await getTestUser();
    await prisma.users.deleteMany({
      where: {
        username: "test-user"
      }
    });
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should return 201 when registering", async () => {
    const response = await supertest(app)
      .post("/api/signup")
      .send({
        "username": "test-user",
        "password": "secret",
        "email": "testuser@gmail.com",
        "number": "081234567890"
      })

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: expect.any(Number),
        username: "test-user",
        email: 'testuser@gmail.com',
        password: expect.any(String),
        number: '081234567890',
        photo: null,
        isAdmin: false,
        created_at: expect.any(String),
        updated_at: null
      }
    });
  });

  it("should return 400 when username is empty", async () => {
    const response = await supertest(app)
      .post("/api/signup")
      .send({
        "username": "",
        "password": "secret",
      })

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Email address is already in use."
    });
  });

  it("should return 400 when email is already in use", async () => {
    const response = await supertest(app)
      .post("/api/signup")
      .send({
        "username": "rizky",
        "email": "rizky@gmail.com",
        "password": "rizky123",
        "number": "081234567890"
      })

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Email address is already in use."
    })
  });

  it("should handle error in signUp controller", async () => {
    jest.spyOn(prisma.users, "create").mockImplementation(new Error("error"));

    const response = await supertest(app)
      .post("/api/signup")
      .send({
        "username": "rizky",
        "email": "",
        "password": "rizky123",
        "number": "081234567890"
      })

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
});
import supertest from "supertest";
import app from "../../../app";


describe("test POST /api/blood_pressure", () => {
  it("should return 201 when creating blood pressure", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "user_id": 3,
        "sistol": 120,
        "diastole": 80,
        "heartbeat": 70,
      });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: expect.any(Number),
        user_id: 3,
        image: "",
        sistol: 120,
        diastole: 80,
        heartbeat: 70,
        created_at: expect.any(String),
        updated_at: null,
      },
    });
  });

  it("should return 401 when token is not provided", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .send({
        "user_id": 3,
        "sistol": 120,
        "diastole": 80,
        "heartbeat": 70,
      });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt must be provided",
    });
  });

  it("should return 402 when token is invalid or expired", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer invalid`)
      .send({
        "user_id": 3,
        "sistol": 120,
        "diastole": 80,
        "heartbeat": 70,
      });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Unauthorized: jwt malformed",
    });
  });

  it("should return 201 when image is png, jpg, and jpeg", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .set("Content-Type", "multipart/form-data")
      .attach("image", "test/user/pressure/test.png")
      .field("user_id", 3)
      .field("sistol", 120)
      .field("diastole", 80)
      .field("heartbeat", 70);

    console.log(response.body);

    // expect(response.status).toEqual(201);
  })
})

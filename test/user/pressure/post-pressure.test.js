import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test POST /api/blood_pressure", () => {
  afterAll(async () => {
    await prisma.blood_pressures.findFirst({
      orderBy: {
        created_at: "desc"
      }
    }).then(async (latestBloodPressure) => {
      await prisma.blood_pressures.delete({
        where: {
          id: latestBloodPressure.id
        }
      });
    })
  });


  it("should return 201 when creating blood pressure", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .field("sistol", 120)
      .field("diastole", 80)
      .field("heartbeat", 70);

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
    const filePath = `${__dirname}/assets/Frame.png`;
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .set("Content-Type", "multipart/form-data")
      .attach("image", filePath)
      .field("sistol", 120)
      .field("diastole", 80)
      .field("heartbeat", 70);

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: expect.any(Number),
        user_id: 3,
        image: expect.any(String),
        sistol: 120,
        diastole: 80,
        heartbeat: 70,
        created_at: expect.any(String),
        updated_at: null,
      },
    });
  });

  it("should return 500 when image is not png, jpg, and jpeg", async () => {
    const filePath = `${__dirname}/assets/Manual Book - MAHATI.pdf`;
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .set("Content-Type", "multipart/form-data")
      .attach("image", filePath)
      .field("sistol", 120)
      .field("diastole", 80)
      .field("heartbeat", 70);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });

  it("should return 400 when sistol value is less than 20", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "sistol": 10,
        "diastole": 80,
        "heartbeat": 70,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Sistol value should be between 20 and 200.",
    });
  })

  it("should return 400 when sistol value is greater than or equal to 200", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "sistol": 201,
        "diastole": 80,
        "heartbeat": 70,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Sistol value should be between 20 and 200.",
    });
  })

  it("should return 400 when diastole value is less than 20", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "sistol": 120,
        "diastole": 10,
        "heartbeat": 70,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Diastole value should be between 20 and 200.",
    });
  });

  it("should return 400 when diastole value is greater than or equal to 200", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "sistol": 120,
        "diastole": 201,
        "heartbeat": 70,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Diastole value should be between 20 and 200.",
    });
  });

  it("should return 400 when heartbeat value is less than 20", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "sistol": 120,
        "diastole": 80,
        "heartbeat": 10,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Heartbeat value should be between 20 and 200.",
    });
  });

  it("should return 400 when heartbeat value is greater than or equal to 200", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "sistol": 120,
        "diastole": 80,
        "heartbeat": 201,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      status: 400,
      message: 'Heartbeat value should be between 20 and 200.'
    })
  });

  it("should return 400 when blood pressure values are less than 0", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "sistol": -1,
        "diastole": 80,
        "heartbeat": 70,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Sistol value should be between 20 and 200.",
    });
  });

  it("should return 400 when blood pressure values are more than three digits", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "sistol": 1200,
        "diastole": 80,
        "heartbeat": 70,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Sistol value should be between 20 and 200.",
    });
  });

  it("should return 200 when blood pressure values are decimal numbers", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "sistol": "120,5",
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

  it("should return 200 when blood pressure values are dot numbers", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "sistol": "120.5",
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

  it("should return 400 when blood pressure values are less than 0", async () => {
    const response = await supertest(app)
      .post("/api/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        "sistol": -1,
        "diastole": -1,
        "heartbeat": -1,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Sistol value should be between 20 and 200.",
    });
  })
});

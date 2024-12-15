import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test POST /api/video", () => {
  afterAll(async () => {
    const latestVideo = await prisma.videos.findFirst({
      where: {
        user_id: 3
      },
      orderBy: {
        created_at: "desc"
      }
    })

    await prisma.videos.delete({
      where: {
        id: latestVideo.id
      }
    })
  });

  it("should return 201 when creating video", async () => {
    const response = await supertest(app)
      .post("/api/video")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        user_id: 3,
        link: "https://youtu.be/dh5hzLD-mtA"
      });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      success: true,
      data: expect.any(Object)
    });
  });

  it("should return 500 when error occurs", async () => {
    jest.spyOn(prisma.videos, "create").mockRejectedValue(new Error());

    const response = await supertest(app)
      .post("/api/video")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        user_id: 3,
        link: "https://youtu.be/dh5hzLD-mtA"
      });

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({});
  });
});
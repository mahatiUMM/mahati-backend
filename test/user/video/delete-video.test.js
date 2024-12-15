import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test DELETE /api/video/:id", () => {
  afterAll(async () => {
    await supertest(app)
      .post("/api/video")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        user_id: 3,
        link: "https://youtu.be/dh5hzLD-mtA"
      });
  })

  it("should return success true when deleting video by id", async () => {
    const latestVideo = await prisma.videos.findFirst({
      where: {
        user_id: 3
      },
      orderBy: {
        id: "desc"
      }
    })

    const response = await supertest(app)
      .delete(`/api/video/${latestVideo.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toEqual(200);

  })
})
import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test PUT /api/video/:id", () => {
  it("should return success true when updating video by id", async () => {
    /**
     * Change this with your own user_id
     * Manual because of checked on bearer token
     */
    const latestVideo = await prisma.videos.findFirst({
      where: {
        user_id: 3
      },
      orderBy: {
        id: "desc"
      }
    });

    const response = await supertest(app)
      .put(`/api/video/${latestVideo.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        link: "https://youtu.be/dh5hzLD-mtA"
      });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: expect.any(Object)
    });
  });
})
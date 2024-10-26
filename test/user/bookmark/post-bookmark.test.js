import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test POST /api/bookmark", () => {
  beforeEach(async () => {
    const latestBookmark = await prisma.bookmarks.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    await prisma.bookmarks.delete({
      where: {
        id: latestBookmark.id
      }
    });
  });

  it("should return 201 when creating bookmark", async () => {
    const latestVideo = await prisma.videos.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .post("/api/bookmark")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        video_id: latestVideo.id
      });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: expect.any(Number),
        video_id: latestVideo.id,
        user_id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: null
      }
    })
  })
});
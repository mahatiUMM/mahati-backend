import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test PUT /api/bookmark/:id", () => {
  it("should return 200 when updating a bookmark", async () => {
    const latestBookmark = await prisma.bookmarks.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .put(`/api/bookmark/${latestBookmark.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        video_id: 11,
      });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: expect.any(Number),
        video_id: 11,
        user_id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: null
      },
    });
  });
});
import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";
import exp from "constants";

describe("test DELETE /api/bookmark/:id", () => {
  it("should return 200 when deleting bookmark by id", async () => {
    const latestBookmark = await prisma.bookmarks.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .delete(`/api/bookmark/${latestBookmark.id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      message: "Bookmark deleted"
    });
  });

  it("should return 404 when endpoint is not correct", async () => {
    const response = await supertest(app)
      .delete("/api/bookmark-not-correct")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send();

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({});
  });

  it("should handle errors in the deleteBookmark controller", async () => {
    jest.spyOn(prisma.bookmarks, "deleteMany").mockRejectedValue(new Error("Something went wrong"));

    const response = await supertest(app)
      .delete("/api/bookmark/1")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Something went wrong" });
  });
});
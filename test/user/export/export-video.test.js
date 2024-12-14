import supertest from "supertest";
import app from "../../../app";

describe("test GET /api/export/video", () => {
  it("should return 200 when exporting video", async () => {
    const response = await supertest(app)
      .get("/api/export/video")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .set("Content-Disposition", "attachment; filename=video.csv")
      .set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
  });
});
import supertest from "supertest";
import app from "../../../app";

describe("test GET /api/export/reminder", () => {
  it("should return 200 when exporting reminder", async () => {
    const response = await supertest(app)
      .get("/api/export/reminder")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .set("Content-Disposition", "attachment; filename=reminder.csv")
      .set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
  });
});
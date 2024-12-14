import supertest from "supertest";
import app from "../../../app";

describe("test GET /api/export/blood_pressure", () => {
  it("should return 200 when exporting blood pressure", async () => {
    const response = await supertest(app)
      .get("/api/export/blood_pressure")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .set("Content-Disposition", "attachment; filename=blood-pressure.csv")
      .set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
  });
})
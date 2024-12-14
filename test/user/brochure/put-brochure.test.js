import supertest from "supertest";
import app from "../../../app";
import { prisma } from "../../../app/lib/dbConnect";

describe("test PUT /api/brochure/:id", () => {
  it("should return 200 when updating brochure", async () => {
    const latestBrochure = await prisma.brochures.findFirst({
      orderBy: {
        created_at: "desc"
      }
    });

    const response = await supertest(app)
      .put(`/api/brochure/60`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        title: "Title Updated"
      });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: expect.any(Number),
        images: expect.any(Array),
        title: "Title Updated",
        created_at: expect.any(String),
        updated_at: null,
      }
    });
  });
})
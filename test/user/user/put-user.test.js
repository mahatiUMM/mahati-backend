import supertest from "supertest";
import app from "../../../app";

describe("test PUT /api/profile", () => {
  it("should return 200 when updating user profile", async () => {
    const filePath = `${__dirname}/assets/peerlist-github-recap.png`;

    /**
     * This only works if the tester has own account and token
     * The token checked on data.status is valid or not
     */
    const response = await supertest(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .set("Content-Type", "multipart/form-data")
      .field("name", "rizkyhaksono")
      .field("email", "rizky@gmail.com")
      .field("phone", "0812345678910")
      .attach("image", filePath);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      status: 200,
      user: {
        id: expect.any(Number),
        username: `rizkyhaksono`,
        email: "rizky@gmail.com",
        password: expect.any(String),
        number: `0812345678910`,
        photo: expect.any(String),
        isAdmin: expect.any(Boolean),
        created_at: expect.any(String),
        updated_at: null,
      },
    });
  });
});

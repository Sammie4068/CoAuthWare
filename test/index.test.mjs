import { expect } from "chai";
import request from "supertest";
import app from "../src/index.mjs"; // Ensure this matches the actual export

describe("Main Application", () => {
  it("should return a valid response on /oauth/authorize with valid CSRF token, state, and PKCE", async () => {
    const res = await request(app).get("/auth").expect(200);
    const csrfToken = res.headers["set-cookie"][0].split(";")[0].split("=")[1];
    const state = res.body.state;

    await request(app)
      .post("/oauth/authorize")
      .set("Cookie", [`XSRF-TOKEN=${csrfToken}`])
      .send({ _csrf: csrfToken, state })
      .expect(200);
  });
});

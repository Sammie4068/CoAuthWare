import { expect } from "chai";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import {
  generateCsrfToken,
  verifyCsrfToken,
} from "../src/coauthMiddleware.mjs";

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get("/", generateCsrfToken, (req, res) => {
  res.status(200).json({ state: res.locals.state });
});

app.post("/oauth/authorize", verifyCsrfToken, (req, res) => {
  res.send("CSRF token is valid, state is verified, and PKCE is secure");
});

describe("CSRF Middleware", () => {
  it("should generate and verify CSRF token, state, and PKCE", async () => {
    const res = await request(app).get("/").expect(200);
    const csrfToken = res.headers["set-cookie"][0].split(";")[0].split("=")[1];
    const state = res.body.state;

    await request(app)
      .post("/oauth/authorize")
      .set("Cookie", [`XSRF-TOKEN=${csrfToken}`])
      .send({ _csrf: csrfToken, state })
      .expect(200);
  });

  it("should fail if CSRF token is missing", async () => {
    await request(app).post("/oauth/authorize").expect(403);
  });

  it("should fail if CSRF token is invalid", async () => {
    await request(app)
      .post("/oauth/authorize")
      .set("Cookie", ["XSRF-TOKEN=invalidtoken"])
      .send({ _csrf: "invalidtoken", state: "invalidstate" })
      .expect(403);
  });
});

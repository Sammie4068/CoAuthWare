import express from "express";
import cookieParser from "cookie-parser";
import { generateCsrfToken, verifyCsrfToken } from "./coauthMiddleware.mjs";
import { port } from "./config.mjs";

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Apply CSRF protection and generate CSRF tokens, state, and PKCE challenge
app.get("/", generateCsrfToken, (req, res) => {
  res.status(200).json({ state: res.locals.state });
});

// OAuth 2.0 authorization endpoint with CSRF, state, and PKCE verification
app.post("/oauth/authorize", verifyCsrfToken, (req, res) => {
  res.send("CSRF token is valid, state is verified, and PKCE is secure");
});

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403).send("Form tampered with");
  } else {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;

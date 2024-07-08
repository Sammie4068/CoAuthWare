import csrf from "csrf";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { csrfSecret, tokenSecret } from "./config.mjs";

// Initialize CSRF protection
const tokens = new csrf();

// Generate CSRF token, state parameter, and PKCE code challenge
export const generateCsrfToken = (req, res, next) => {
  const state = crypto.randomBytes(16).toString("hex");
  const codeVerifier = crypto.randomBytes(32).toString("hex");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  const tokenPayload = {
    csrfToken: tokens.create(csrfSecret),
    state,
    codeVerifier,
  };
  const token = jwt.sign(tokenPayload, tokenSecret, { expiresIn: "1h" });
  res.cookie("XSRF-TOKEN", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
 
  res.locals.state = state;
  res.locals.codeChallenge = codeChallenge;
  next();
};

// Verify the CSRF token, state parameter, and PKCE code verifier
export const verifyCsrfToken = (req, res, next) => {
  const token = req.cookies["XSRF-TOKEN"];
  if (!token) return res.status(403).send("CSRF token missing");

  jwt.verify(token, tokenSecret, (err, decoded) => {
    if (err) return res.status(403).send("Expired CSRF token");
    if (req.body.state !== decoded.state)
      return res.status(403).send("Invalid state parameter");
    if (!tokens.verify(csrfSecret, decoded.csrfToken))
      return res.status(403).send("Invalid CSRF token");
    req.csrfToken = decoded.csrfToken;
    req.codeVerifier = decoded.codeVerifier;
    next();
  });
};

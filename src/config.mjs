import dotenv from "dotenv";
dotenv.config();

export const csrfSecret = process.env.CSRF_SECRET || "default_secret";
export const tokenSecret = process.env.TOKEN_SECRET || "another_secret";
export const port = process.env.PORT || 3000;

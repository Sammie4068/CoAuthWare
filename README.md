# CoAuthware

## Description

CoAuthware provides comprehensive CSRF protection for OAuth 2.0 implementations in Node.js applications. It includes features for generating and verifying CSRF tokens, state parameters, and PKCE (Proof Key for Code Exchange) challenges to enhance the security of your authentication flow.

## Installation

To install coauthware, use npm:

```bash
npm install coauthware
```

## Usage

### Basic Setup

Here is a basic example of how to use coauthware in an Express application:

```javascript
import express from "express";
import { generateCsrfToken, verifyCsrfToken } from "coauthware";
import cookieParser from "cookie-parser";

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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

## Configuration

Create a `.env` file in your project root with the following variables:

```
CSRF_SECRET=your_csrf_secret
TOKEN_SECRET=your_token_secret
PORT=3000
```

## Testing

To run tests, use:

```bash
npm test
```

## License

MIT

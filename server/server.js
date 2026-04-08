const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.js");
const booksRoutes = require("./routes/books.js");
const userRoutes = require("./routes/user.js");
const connectDB = require("./config/db.js");
const { parseCookies } = require("./utils/security.js");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";


// Allow the React app to send cookies with auth requests.
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin === CLIENT_URL) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

// content type - application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  req.cookies = parseCookies(req.headers.cookie);
  next();
});

// app.use((req, res, next) => {
//   console.log(`${req.body}`);
//   next();
// });

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/user", userRoutes);

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, HOST, () => {
      console.log(`server is ready on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();

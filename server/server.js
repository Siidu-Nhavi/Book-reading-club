const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.js");
const booksRoutes = require("./routes/books.js");
const listingsRoutes = require("./routes/listings.js");
const profileRoutes = require("./routes/profile.js");
const rentalsRoutes = require("./routes/rentals.js");
const reviewsRoutes = require("./routes/reviews.js");
const stripeRoutes = require("./routes/stripe.js");
const paymentsRoutes = require("./routes/payments.js");
const adminRoutes = require("./routes/admin.js");
const cronRoutes = require("./routes/cron.js");
const connectDB = require("./config/db.js");
const { parseCookies } = require("./utils/security.js");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const uploadsDirectory = path.join(__dirname, "uploads");


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
app.use("/webhook", bodyParser.raw({ type: "application/json" }));
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/webhook")) {
    return next();
  }

  return express.json()(req, res, next);
});
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/webhook")) {
    return next();
  }

  return express.urlencoded({ extended: true })(req, res, next);
});
app.use((req, _res, next) => {
  req.cookies = parseCookies(req.headers.cookie);
  next();
});
app.use("/uploads", express.static(uploadsDirectory));

// app.use((req, res, next) => {
//   console.log(`${req.body}`);
//   next();
// });

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/rentals", rentalsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/webhook", stripeRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cron", cronRoutes);

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

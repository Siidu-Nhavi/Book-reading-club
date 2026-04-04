const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
const connectDB = require("./config/db.js");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT ?? 3000;
const HOST = process.env.HOST;

//content type - application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   console.log(`${req.body}`);
//   next();
// });

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`server is ready on http://${HOST}:${PORT}/`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();

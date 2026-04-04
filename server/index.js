import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import connectDB from "../config/db.js";

dotenv.config();

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

await connectDB();

app.listen(PORT, () => {
  console.log(`server is ready on http://${HOST}:${PORT}/`);
});

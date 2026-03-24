import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;
const HOST = process.env.HOST;

//content type - application/json
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

await connectDB();

app.listen(PORT, () => {
  console.log(`server is ready on http://${HOST}:${PORT}/`);
});
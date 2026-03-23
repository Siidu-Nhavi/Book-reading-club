import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;
const HOST = process.env.HOST;

//content type - application/json
app.use(express.json());

app.listen(PORT, ()=> {
    console.log(`server is ready on http://${HOST}:${PORT}/`);
});
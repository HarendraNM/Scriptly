import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/index.js";

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


connectDB();

app.use('/api',userRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

export default app;
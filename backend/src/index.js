import express from 'express';
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRouter from "./routers/auth.router.js"
import {connectDB} from "./lib/db.js"
import groupRouter from "./routers/group.router.js";


dotenv.config();
const app = express();

// Configure CORS before other middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Mount auth router with proper route prefix
app.use("/api/auth", authRouter)
app.use("/api/groups", groupRouter);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
    connectDB();
});
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { router as apiRoutes } from "./routes/index.js";
import { limiter } from "./middlewares/rateLimiter.js";

export const app = express();

app.set("trust proxy", 1)
// global middleware
app.use(helmet());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://frontend-fullstack-taupe.vercel.app",
  ],
  credentials: true,
};// 🟩 allow cookie to be sent

app.use(cors(corsOptions));

app.use(limiter);

app.use(express.json());
// Middleware to parse cookie (required for cookie-base auth)

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", apiRoutes);
// Catch-all for 404 Not Found
app.use((req, res, next) => {
  const error = new Error(`Not found: ${req.method} ${req.originalUrl}`);
  error.name = "NotFoundError";
  error.status = 404;
  next(error);
});

// Centralized Error Handling Middelware
app.use((err, req, res, next ) => {
 console.error(err.stack);
 res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack: err.stack,
 });
});


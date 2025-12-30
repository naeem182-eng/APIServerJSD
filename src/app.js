import express from "express";
import cors from "cors";
import { router as apiRoutes } from "./routes/index.js";

export const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://jsd-react-assessment-solution.vercel.app",
  ],
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", apiRoutes);

// Catch-all for 404 Not Found
app.use((req, res, next) => {
 new Error(`Not Found: ${req.method} ${req.originalUrl}`);
error.name = error.name || "NotFoundError";
error.status = error.status || 404;
next(error);
});

// Centralize Error Handling Middleware
app.use ((err, req, res, next) => {
  console.error(err.stack);
  res.status(error.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    path: req.originalUral,
    method:req.method,
    timestamp: new Date().toISOString(),
    stack: err.stack,
  });
});

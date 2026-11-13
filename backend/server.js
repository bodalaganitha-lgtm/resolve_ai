import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

app.get("/", (req, res) => {
  res.send("ResolveAI Backend is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ResolveAI API is working!",
  });
});

// Always answer with JSON, including for malformed request bodies, so the
// frontend can show a real message instead of failing to parse an HTML page.
app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
    });
  }

  console.error("Unhandled error:", err);

  res.status(err?.status || 500).json({
    success: false,
    message: "Something went wrong. Please try again.",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const missing = ["MONGO_URI", "JWT_SECRET"].filter(
    (name) => !process.env[name]
  );

  if (missing.length > 0) {
    console.error(
      `Missing required environment variable(s): ${missing.join(", ")}.\n` +
        "Create backend/.env (see backend/.env.example) and restart."
    );
    process.exit(1);
  }

  try {
    await connectDB();
  } catch {
    // connectDB has already logged the reason and what to check.
    console.error(
      "Could not connect to MongoDB, so the server was not started. " +
        "Accounts cannot be created until this is fixed."
    );
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`ResolveAI server running on port ${PORT}`);
  });
};

startServer();
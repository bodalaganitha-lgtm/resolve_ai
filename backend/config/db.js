import mongoose from "mongoose";

// Explain the most common MongoDB connection failures in plain words.
const connectionHint = (error) => {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("bad auth") || message.includes("authentication failed")) {
    return "Check the username and password in MONGO_URI (special characters in the password must be URL-encoded).";
  }

  if (
    message.includes("whitelist") ||
    message.includes("ip that isn't whitelisted") ||
    message.includes("server selection timed out")
  ) {
    return "If you use MongoDB Atlas, add your current IP address under Network Access (or allow 0.0.0.0/0 while testing).";
  }

  if (
    message.includes("querysrv") ||
    message.includes("enotfound") ||
    message.includes("econnrefused")
  ) {
    return "The database host could not be reached. Check MONGO_URI, your internet connection, and that a local MongoDB is running if you use localhost.";
  }

  return "Check MONGO_URI in backend/.env.";
};

const connectDB = async () => {
  const maxRetries = 5;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set. Add it to backend/.env.");
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `Connecting to MongoDB... Attempt ${attempt}/${maxRetries}`
      );

      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });

      console.log("MongoDB connected successfully!");
      return;
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);
      console.error("Error code:", error.code || "Not provided");

      if (attempt === maxRetries) {
        console.error(`Hint: ${connectionHint(error)}`);
        throw error;
      }

      console.log("Retrying in 5 seconds...");

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

export default connectDB;
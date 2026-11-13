import mongoose from "mongoose";

const connectDB = async () => {
  const maxRetries = 5;

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
        throw error;
      }

      console.log("Retrying in 5 seconds...");

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

export default connectDB;

import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Delivery",
        "Product",
        "Payment",
        "Account",
        "Service",
        "Other",
      ],
      required: true,
    },

    referenceId: {
      type: String,
      default: "",
    },

    sentiment: {
      type: String,
      enum: ["Positive", "Neutral", "Negative"],
      default: "Neutral",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },

    // Gemini AI analysis results
    analysis: {
      confidence: {
        type: Number,
        min: 0,
        max: 100,
      },

      keyIssue: {
        type: String,
        default: "",
      },

      sentimentReason: {
        type: String,
        default: "",
      },

      recommendedResolution: {
        type: String,
        default: "",
      },

      actionItems: {
        type: [String],
        default: [],
      },

      analyzedAt: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

// Generate complaint ID automatically
complaintSchema.pre("validate", async function () {
  if (!this.complaintId) {
    this.complaintId =
      "CMP-" + Date.now().toString().slice(-8);
  }
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;

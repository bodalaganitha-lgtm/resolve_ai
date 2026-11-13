
import express from "express";
import mongoose from "mongoose";
import Complaint from "../models/Complaint.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { analyzeComplaint } from "../services/aiService.js";

const router = express.Router();


// ==========================================
// 1. SUBMIT A NEW COMPLAINT
// ==========================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      referenceId,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    const complaint = await Complaint.create({
      user: req.user.id,
      title,
      description,
      category: category || "Other",
      referenceId: referenceId || "",
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully.",
      complaint,
    });

  } catch (error) {
    console.error("Complaint submission error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to submit complaint.",
    });
  }
});


// ==========================================
// 2. GET LOGGED-IN CUSTOMER COMPLAINTS
// ==========================================

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints,
    });

  } catch (error) {
    console.error("Customer complaint history error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch complaint history.",
    });
  }
});


// ==========================================
// 3. GET ALL COMPLAINTS (MANAGER ONLY)
// ==========================================

router.get("/all", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Manager only.",
      });
    }

    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints,
    });

  } catch (error) {
    console.error("Fetch all complaints error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch complaints.",
    });
  }
});


// ==========================================
// 4. ANALYZE COMPLAINT USING GEMINI AI
// ==========================================

router.post("/:id/analyze", authMiddleware, async (req, res) => {
  try {

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    // Find complaint
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    // Allow only complaint owner or manager
    const isOwner =
      complaint.user.toString() === req.user.id;

    const isManager =
      req.user.role === "manager";

    if (!isOwner && !isManager) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to analyze this complaint.",
      });
    }

    // Call Gemini AI
    let aiResult;

    try {
      aiResult = await analyzeComplaint(complaint);

    } catch (aiError) {

      // MODIFIED: Display actual Gemini error
      console.error("GEMINI ANALYSIS ERROR:", aiError);

      return res.status(502).json({
        success: false,
        message:
          aiError.message ||
          "Gemini AI analysis failed.",
      });
    }

    // Save AI results to MongoDB
    complaint.sentiment = aiResult.sentiment;
    complaint.category = aiResult.category;
    complaint.priority = aiResult.priority;

    complaint.analysis = {
      confidence: aiResult.confidence,
      keyIssue: aiResult.keyIssue,
      sentimentReason: aiResult.sentimentReason,
      recommendedResolution: aiResult.recommendedResolution,
      actionItems: aiResult.actionItems,
      analyzedAt: new Date(),
    };

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint analyzed successfully.",
      complaint,
      analysis: aiResult,
    });

  } catch (error) {

    console.error("Complaint analysis error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to analyze complaint.",
    });
  }
});


// ==========================================
// 5. UPDATE COMPLAINT STATUS (MANAGER ONLY)
// ==========================================

router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "manager") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Manager only.",
      });
    }

    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully.",
      complaint,
    });

  } catch (error) {
    console.error("Complaint status update error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update complaint status.",
    });
  }
});


export default router;

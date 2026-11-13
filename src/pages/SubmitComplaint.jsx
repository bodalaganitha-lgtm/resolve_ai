
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Sparkles,
  FileText,
  Tag,
  Package,
  AlertCircle,
} from "lucide-react";

function SubmitComplaint() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Submit complaint to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      // Save complaint in MongoDB
      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            category,
            referenceId: referenceId.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit complaint."
        );
      }

      // Check whether MongoDB returned the complaint ID
      if (!data.complaint?._id) {
        throw new Error("Complaint was saved, but its ID was not returned.");
      }

      // Navigate to AI Analysis with the MongoDB ID
      navigate("/ai-analysis", {
        state: {
          mongoId: data.complaint._id,
          complaintId: data.complaint.complaintId,
          title: data.complaint.title,
          description: data.complaint.description,
          category: data.complaint.category,
          referenceId: data.complaint.referenceId,
        },
      });

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0A1726]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link to="/customer-dashboard" className="text-xl font-bold">
            Resolve<span className="text-blue-400">AI</span>
          </Link>

          <Link
            to="/customer-dashboard"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-4xl px-6 py-10 lg:px-8">

        {/* Heading */}
        <div className="mb-8">

          <p className="text-sm font-medium text-blue-400">
            Complaint Center
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Submit a Complaint
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Tell us what happened. ResolveAI will analyze your
            complaint and identify the issue, sentiment, and priority.
          </p>

        </div>

        {/* AI banner */}
        <div className="mb-6 flex items-start gap-4 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-5">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Sparkles size={19} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              AI-powered complaint analysis
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Your complaint will be securely saved and analyzed
              using Gemini AI to generate intelligent insights
              and a recommended resolution.
            </p>
          </div>

        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-6 sm:p-8"
        >

          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FileText size={16} />
              Complaint title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Briefly describe your issue"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400"
              required
            />
          </div>

          {/* Category */}
          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Tag size={16} />
              Complaint category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
              required
            >
              <option value="" className="bg-[#07111F]">
                Select a category
              </option>

              <option value="Delivery" className="bg-[#07111F]">
                Delivery
              </option>

              <option value="Product" className="bg-[#07111F]">
                Product
              </option>

              <option value="Payment" className="bg-[#07111F]">
                Payment
              </option>

              <option value="Account" className="bg-[#07111F]">
                Account
              </option>

              <option value="Service" className="bg-[#07111F]">
                Customer Service
              </option>

              <option value="Other" className="bg-[#07111F]">
                Other
              </option>
            </select>
          </div>

          {/* Reference ID */}
          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Package size={16} />
              Order / Reference ID

              <span className="text-xs font-normal text-slate-600">
                Optional
              </span>
            </label>

            <input
              type="text"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              placeholder="e.g. ORD-10245"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400"
            />
          </div>

          {/* Description */}
          <div className="mt-6">
            <div className="flex items-center justify-between">

              <label className="text-sm font-medium text-slate-300">
                Describe your complaint
              </label>

              <span className="text-xs text-slate-600">
                {description.length} characters
              </span>

            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what happened, when it happened, and how it affected you..."
              rows={8}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-blue-400"
              required
            />
          </div>

          {/* Submit */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              to="/customer-dashboard"
              className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles size={17} />

              {loading ? "Submitting..." : "Analyze Complaint"}

              <Send size={16} />
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default SubmitComplaint;


import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Brain,
  MessageSquare,
  Tag,
  Gauge,
  Lightbulb,
  RefreshCw,
  LoaderCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/complaints";

function AIAnalysis() {
  const location = useLocation();

  const complaint = location.state || {};
  const mongoId = complaint.mongoId;

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Prevent duplicate API requests during React StrictMode.
  const requestPromiseRef = useRef(null);

  useEffect(() => {
    let active = true;

    const fetchAnalysis = async () => {
      setLoading(true);
      setError("");

      if (!mongoId) {
        setError(
          "Complaint ID is missing. Please submit a complaint again from the Customer Dashboard."
        );
        setLoading(false);
        return;
      }

      try {
        // Reuse the same request if React StrictMode
        // executes the effect more than once.
        if (!requestPromiseRef.current) {
          requestPromiseRef.current = (async () => {
            const token = sessionStorage.getItem("token");

            if (!token) {
              throw new Error(
                "Please log in again to analyze your complaint."
              );
            }

            const response = await fetch(
              `${API_URL}/${mongoId}/analyze`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
              throw new Error(
                data.message || "Gemini AI analysis failed."
              );
            }

            // Support both response formats.
            const result =
              data.analysis ||
              data.complaint?.analysis;

            if (!result || !result.keyIssue) {
              throw new Error(
                "AI analysis results are missing."
              );
            }

            return result;
          })();
        }

        const result = await requestPromiseRef.current;

        if (active) {
          setAnalysis(result);
        }

      } catch (err) {
        if (active) {
          setError(
            err.message || "Something went wrong."
          );
        }

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAnalysis();

    return () => {
      active = false;
    };

  }, [mongoId, retryCount]);


  // Retry AI analysis
  const handleRetry = () => {
    requestPromiseRef.current = null;
    setAnalysis(null);
    setError("");
    setRetryCount((previous) => previous + 1);
  };


  return (
    <div className="min-h-screen bg-[#07111F] text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0A1726]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/customer-dashboard"
            className="text-xl font-bold"
          >
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
      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">

        {/* Heading */}
        <div className="mb-8">

          <div className="flex items-center gap-2 text-sm font-medium text-violet-400">
            <Sparkles size={17} />
            AI Complaint Analysis
          </div>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            {loading
              ? "Analyzing Complaint..."
              : error
                ? "Analysis Failed"
                : "Analysis Complete"}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            ResolveAI uses Gemini AI to understand your complaint
            and generate intelligent insights and recommendations.
          </p>

        </div>


        {/* Complaint Summary */}
        <section className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
              <MessageSquare size={20} />
            </div>

            <div className="min-w-0 flex-1">

              <p className="text-xs text-slate-500">
                Complaint
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                {complaint.title || "Complaint"}
              </h2>

              {complaint.referenceId && (
                <span className="mt-2 inline-block rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                  {complaint.referenceId}
                </span>
              )}

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {complaint.description ||
                  "No complaint description available."}
              </p>

            </div>

          </div>

        </section>


        {/* Loading */}
        {loading && (
          <div className="mt-8 rounded-2xl border border-blue-400/20 bg-[#0D1B2A] p-10 text-center">

            <LoaderCircle
              size={40}
              className="mx-auto animate-spin text-blue-400"
            />

            <h2 className="mt-5 text-lg font-semibold">
              Gemini is analyzing your complaint
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Please wait while ResolveAI identifies the issue,
              sentiment, priority, and recommended resolution.
            </p>

          </div>
        )}


        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 p-6">

            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={22} />

              <h2 className="font-semibold">
                Unable to analyze complaint
              </h2>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {error}
            </p>

            <button
              onClick={handleRetry}
              className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 text-sm font-semibold transition hover:opacity-90"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

          </div>
        )}


        {/* Actual Gemini Results */}
        {!loading && !error && analysis && (
          <>

            {/* Result Cards */}
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              <AnalysisCard
                icon={<Tag size={20} />}
                label="Category"
                value={analysis.category}
                description="AI detected complaint category"
                iconStyle="bg-blue-400/10 text-blue-400"
              />

              <AnalysisCard
                icon={<MessageSquare size={20} />}
                label="Sentiment"
                value={analysis.sentiment}
                description="Customer sentiment detected"
                iconStyle="bg-red-400/10 text-red-400"
              />

              <AnalysisCard
                icon={<Gauge size={20} />}
                label="Priority"
                value={analysis.priority}
                description="AI assessed complaint priority"
                iconStyle="bg-amber-400/10 text-amber-400"
              />

              <AnalysisCard
                icon={<Brain size={20} />}
                label="AI Confidence"
                value={
                  Number.isFinite(analysis.confidence)
                    ? `${analysis.confidence}%`
                    : "N/A"
                }
                description="AI confidence score"
                iconStyle="bg-violet-400/10 text-violet-400"
              />

            </div>


            {/* Analysis Details */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">

              {/* Key Issue */}
              <section className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                    <AlertTriangle size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Key Issue Detected
                    </h2>

                    <p className="text-xs text-slate-500">
                      What Gemini identified
                    </p>
                  </div>

                </div>

                <div className="mt-6 rounded-xl border border-white/5 bg-[#07111F] p-5">

                  <p className="text-sm leading-6 text-slate-200">
                    {analysis.keyIssue || "No key issue available."}
                  </p>

                </div>

              </section>


              {/* Sentiment Analysis */}
              <section className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
                    <MessageSquare size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Sentiment Analysis
                    </h2>

                    <p className="text-xs text-slate-500">
                      Gemini's explanation
                    </p>
                  </div>

                </div>

                <div className="mt-6">

                  <span className="text-sm font-semibold text-white">
                    {analysis.sentiment}
                  </span>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {analysis.sentimentReason ||
                      "No sentiment explanation available."}
                  </p>

                </div>

              </section>

            </div>


            {/* Recommended Resolution */}
            <section className="mt-6 rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-6 sm:p-8">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Lightbulb size={21} />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                    AI Recommendation
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Recommended Resolution
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {analysis.recommendedResolution ||
                      "No recommendation available."}
                  </p>

                </div>

              </div>


              {/* AI Action Items */}
              <div className="mt-7">

                <h3 className="mb-4 text-sm font-semibold text-white">
                  Recommended Action Items
                </h3>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {analysis.actionItems?.length > 0 ? (
                    analysis.actionItems.map((item, index) => (
                      <Recommendation
                        key={index}
                        text={item}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      No action items available.
                    </p>
                  )}

                </div>

              </div>

            </section>


            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">

              <Link
                to="/customer-dashboard"
                className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                Back to Dashboard
              </Link>

              <Link
                to="/complaint-history"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
              >
                <CheckCircle2 size={17} />
                View Complaint History
              </Link>

            </div>

          </>
        )}

      </main>

    </div>
  );
}


/* Analysis Card */

function AnalysisCard({
  icon,
  label,
  value,
  description,
  iconStyle,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-5">

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-white">
        {value || "Not available"}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {description}
      </p>

    </div>
  );
}


/* Recommendation */

function Recommendation({ text }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#07111F]/60 p-4">

      <CheckCircle2
        size={17}
        className="shrink-0 text-emerald-400"
      />

      <span className="text-xs leading-5 text-slate-300">
        {text}
      </span>

    </div>
  );
}

export default AIAnalysis;

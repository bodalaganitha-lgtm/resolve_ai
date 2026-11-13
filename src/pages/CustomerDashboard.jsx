
import {
  MessageSquare,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function CustomerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in customer's information
  const storedUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const customerName = storedUser.name || "Customer";
  const initial = customerName.charAt(0).toUpperCase();

  // Fetch logged-in customer's complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view your dashboard.");
        }

        const response = await fetch(
          "http://localhost:5000/api/complaints/my",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to retrieve your complaints."
          );
        }

        const formattedComplaints = data.complaints.map((item) => ({
          id: item.complaintId || item._id,
          title: item.title || "Untitled complaint",
          category: item.category || "Other",
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Date unavailable",
          status: item.status || "Pending",
          priority: item.priority || "Medium",
          sentiment: item.sentiment || "Neutral",
        }));

        setComplaints(formattedComplaints);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Dynamic statistics
  const totalComplaints = complaints.length;

  const inReview = complaints.filter(
    (item) => item.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const needsAttention = complaints.filter(
    (item) =>
      item.priority === "High" && item.status !== "Resolved"
  ).length;

  // Latest three complaints
  const recentComplaints = complaints.slice(0, 3);

  // Calculate most common complaint category
  const categoryCounts = complaints.reduce((counts, item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
    return counts;
  }, {});

  const commonCategory = Object.entries(categoryCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  // Calculate most common sentiment
  const sentimentCounts = complaints.reduce((counts, item) => {
    counts[item.sentiment] = (counts[item.sentiment] || 0) + 1;
    return counts;
  }, {});

  const commonSentiment = Object.entries(sentimentCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  // Display status styles
  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-blue-400/10 text-blue-400",
      "In Progress": "bg-amber-400/10 text-amber-400",
      Resolved: "bg-emerald-400/10 text-emerald-400",
    };

    return styles[status] || "bg-slate-400/10 text-slate-400";
  };

  const getStatusLabel = (status) => {
    return status === "In Progress" ? "In Review" : status;
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-white">

      {/* Navbar */}
      <header className="border-b border-white/10 bg-[#0A1726]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link to="/" className="text-xl font-bold">
            Resolve<span className="text-blue-400">AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">
                {customerName}
              </p>

              <p className="text-xs text-slate-500">
                Customer
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 font-semibold">
              {initial}
            </div>
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* Welcome */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <p className="text-sm font-medium text-blue-400">
              Customer Portal
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {customerName} 👋
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Track your complaints, view insights, and get updates
              on your resolutions.
            </p>
          </div>

          <Link
            to="/submit-complaint"
            className="flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
          >
            <Plus size={18} />
            Submit Complaint
          </Link>

        </div>

        {/* Statistics */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<MessageSquare size={20} />}
            title="Total Complaints"
            value={loading ? "..." : totalComplaints}
            description="All submitted complaints"
            iconStyle="bg-blue-400/10 text-blue-400"
          />

          <StatCard
            icon={<Clock3 size={20} />}
            title="In Review"
            value={loading ? "..." : inReview}
            description="Currently being reviewed"
            iconStyle="bg-amber-400/10 text-amber-400"
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            title="Resolved"
            value={loading ? "..." : resolved}
            description="Successfully resolved"
            iconStyle="bg-emerald-400/10 text-emerald-400"
          />

          <StatCard
            icon={<AlertCircle size={20} />}
            title="Needs Attention"
            value={loading ? "..." : needsAttention}
            description="High-priority unresolved complaints"
            iconStyle="bg-red-400/10 text-red-400"
          />

        </div>

        {/* Main grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

          {/* Recent Complaints */}
          <section className="rounded-2xl border border-white/10 bg-[#0D1B2A]">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>
                <h2 className="font-semibold text-white">
                  Recent Complaints
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Your latest complaint activity
                </p>
              </div>

              <Link
                to="/complaint-history"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                View all
              </Link>

            </div>

            <div className="divide-y divide-white/5">

              {loading ? (
                <p className="px-6 py-10 text-center text-sm text-slate-400">
                  Loading your complaints...
                </p>
              ) : error ? (
                <p className="px-6 py-10 text-center text-sm text-red-400">
                  {error}
                </p>
              ) : recentComplaints.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <MessageSquare
                    size={30}
                    className="mx-auto text-slate-600"
                  />

                  <p className="mt-3 text-sm text-slate-400">
                    You haven't submitted any complaints yet.
                  </p>

                  <Link
                    to="/submit-complaint"
                    className="mt-3 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Submit your first complaint
                  </Link>
                </div>
              ) : (
                recentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="min-w-0">

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-500">
                          {complaint.id}
                        </span>

                        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-slate-400">
                          {complaint.category}
                        </span>
                      </div>

                      <h3 className="mt-2 truncate text-sm font-medium text-slate-200">
                        {complaint.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-600">
                        Submitted {complaint.date}
                      </p>

                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${getStatusStyle(complaint.status)}`}
                    >
                      {getStatusLabel(complaint.status)}
                    </span>

                  </div>
                ))
              )}

            </div>

          </section>

          {/* Complaint Insights */}
          <section className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Sparkles size={21} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Complaint Insights
                </h2>

                <p className="text-xs text-slate-500">
                  Based on your database records
                </p>
              </div>

            </div>

            <div className="mt-6 space-y-4">

              <div className="rounded-xl border border-white/5 bg-black/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                  Most Common Sentiment
                </p>

                <p className="mt-2 text-sm font-medium text-slate-200">
                  {loading
                    ? "Loading..."
                    : commonSentiment || "No data yet"}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Calculated from the sentiment values stored
                  in your complaints.
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Most Common Issue
                </p>

                <p className="mt-2 text-sm font-medium text-slate-200">
                  {loading
                    ? "Loading..."
                    : commonCategory || "No data yet"}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your most frequently reported complaint category.
                </p>
              </div>

            </div>

          </section>

        </div>

        {/* Bottom information */}
        <section className="mt-6 rounded-2xl border border-blue-400/10 bg-blue-500/5 p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
                <Sparkles size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Need help with a problem?
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Submit a complaint and let ResolveAI analyze
                  it and recommend the next steps.
                </p>
              </div>

            </div>

            <Link
              to="/submit-complaint"
              className="flex w-fit items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"
            >
              Submit complaint
              <ArrowRight size={16} />
            </Link>

          </div>

        </section>

      </main>
    </div>
  );
}


/* Statistic Card */
function StatCard({
  icon,
  title,
  value,
  description,
  iconStyle,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-5">

      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {description}
      </p>

    </div>
  );
}

export default CustomerDashboard;

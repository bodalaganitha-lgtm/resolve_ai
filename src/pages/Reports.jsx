
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  FileText,
  Download,
  CalendarDays,
  MessageSquare,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  BarChart3,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API_URL = "http://localhost:5000/api/complaints/all";

const PRIORITY_COLORS = {
  High: "#F87171",
  Medium: "#FBBF24",
  Low: "#34D399",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function Reports() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch actual complaints from MongoDB
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in again to access reports.");
        }

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load reports.");
        }

        const records = Array.isArray(data)
          ? data
          : data.complaints || data.data || [];

        setComplaints(records);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Calculate report statistics
  const stats = useMemo(() => {
    const total = complaints.length;

    const resolved = complaints.filter(
      (item) => item.status === "Resolved"
    ).length;

    const pending = complaints.filter(
      (item) => item.status === "Pending"
    ).length;

    const highPriority = complaints.filter(
      (item) => item.priority === "High"
    ).length;

    const resolutionRate = total
      ? ((resolved / total) * 100).toFixed(1)
      : "0.0";

    return {
      total,
      resolved,
      pending,
      highPriority,
      resolutionRate,
    };
  }, [complaints]);

  // Priority distribution
  const priorityData = useMemo(() => {
    return ["High", "Medium", "Low"].map((priority) => ({
      name: priority,
      value: complaints.filter(
        (item) => item.priority === priority
      ).length,
    }));
  }, [complaints]);

  // Complaint category distribution
  const categoryData = useMemo(() => {
    const counts = {};

    complaints.forEach((item) => {
      const category = item.category || "Other";
      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value);
  }, [complaints]);

  // Last six months' complaint overview
  const monthlyData = useMemo(() => {
    const now = new Date();

    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - index),
        1
      );

      return {
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
        month: MONTHS[date.getMonth()],
        complaints: 0,
        resolved: 0,
      };
    });

    complaints.forEach((item) => {
      if (!item.createdAt) return;

      const createdDate = new Date(item.createdAt);

      if (Number.isNaN(createdDate.getTime())) return;

      const monthRecord = months.find(
        (month) =>
          month.year === createdDate.getFullYear() &&
          month.monthIndex === createdDate.getMonth()
      );

      if (monthRecord) {
        monthRecord.complaints += 1;

        if (item.status === "Resolved") {
          monthRecord.resolved += 1;
        }
      }
    });

    return months;
  }, [complaints]);

  // Data-driven business recommendations
  const recommendations = useMemo(() => {
    const topCategory = categoryData[0];

    const negativeCount = complaints.filter(
      (item) => item.sentiment === "Negative"
    ).length;

    const highCount = stats.highPriority;

    return [
      {
        number: "01",
        title: topCategory
          ? `Review ${topCategory.category} Issues`
          : "Monitor Complaint Categories",
        text: topCategory
          ? `${topCategory.category} is currently the most common category, with ${topCategory.value} complaint(s). Review the causes and identify possible improvements.`
          : "No complaint data is available yet. New complaints will help identify areas that need improvement.",
      },
      {
        number: "02",
        title: "Prioritize High-Risk Cases",
        text: highCount > 0
          ? `${highCount} high-priority complaint(s) are recorded. Review these cases and ensure they receive appropriate attention.`
          : "There are currently no high-priority complaints. Continue monitoring incoming cases.",
      },
      {
        number: "03",
        title: "Monitor Negative Sentiment",
        text: negativeCount > 0
          ? `${negativeCount} complaint(s) have negative sentiment. Review these cases to identify recurring customer concerns.`
          : "No negative-sentiment complaints are currently recorded. Continue monitoring customer feedback.",
      },
    ];
  }, [complaints, categoryData, stats.highPriority]);

  // Download report as CSV
  const handleGenerateReport = () => {
    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = [
      ["ResolveAI Business Report"],
      ["Generated On", new Date().toLocaleString()],
      [],
      ["Summary"],
      ["Total Complaints", stats.total],
      ["Resolved", stats.resolved],
      ["Resolution Rate", `${stats.resolutionRate}%`],
      ["Pending", stats.pending],
      ["High Priority", stats.highPriority],
      [],
      ["Category Distribution"],
      ["Category", "Complaints"],
      ...categoryData.map((item) => [
        item.category,
        item.value,
      ]),
      [],
      ["Priority Distribution"],
      ["Priority", "Complaints"],
      ...priorityData.map((item) => [
        item.name,
        item.value,
      ]),
      [],
      ["Monthly Overview"],
      ["Month", "Complaints", "Resolved"],
      ...monthlyData.map((item) => [
        `${item.month} ${item.year}`,
        item.complaints,
        item.resolved,
      ]),
      [],
      ["Complaint Details"],
      [
        "Complaint ID",
        "Title",
        "Category",
        "Priority",
        "Sentiment",
        "Status",
        "Created At",
      ],
      ...complaints.map((item) => [
        item.complaintId,
        item.title,
        item.category,
        item.priority,
        item.sentiment,
        item.status,
        item.createdAt
          ? new Date(item.createdAt).toLocaleString()
          : "",
      ]),
    ];

    const csvContent = rows
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `ResolveAI_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const currentMonth = new Date().toLocaleString("en-IN", {
    month: "short",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07111F] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-400/20 border-t-blue-400" />
          <p className="mt-4 text-sm text-slate-400">
            Loading reports from MongoDB...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07111F] px-6 text-white">
        <div className="max-w-md rounded-2xl border border-red-400/20 bg-[#0D1B2A] p-8 text-center">
          <AlertTriangle className="mx-auto text-red-400" size={32} />

          <h2 className="mt-4 text-xl font-semibold">
            Unable to Load Reports
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold hover:bg-blue-600"
          >
            Try Again
          </button>

          <Link
            to="/manager-dashboard"
            className="mt-4 block text-sm text-slate-400 hover:text-white"
          >
            Back to Manager Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111F] text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0A1726]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <FileText size={20} />
            </div>

            <div>
              <p className="text-lg font-bold">
                Resolve<span className="text-blue-400">AI</span>
              </p>

              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Reports & Insights
              </p>
            </div>
          </div>

          <Link
            to="/manager-dashboard"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Manager Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium text-blue-400">
              Business Reports
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Reports & Insights
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Generate reports and understand the performance of
              your customer complaint resolution process.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0D1B2A] px-4 py-3 text-sm text-slate-300">
              <CalendarDays size={17} />
              {currentMonth}
            </div>

            <button
              type="button"
              onClick={handleGenerateReport}
              className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              <Download size={17} />
              Generate Report
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReportStat
            icon={<MessageSquare size={20} />}
            label="Total Complaints"
            value={stats.total}
            description="All recorded complaints"
            iconClass="bg-blue-400/10 text-blue-400"
          />

          <ReportStat
            icon={<CheckCircle2 size={20} />}
            label="Resolved"
            value={stats.resolved}
            description={`${stats.resolutionRate}% resolution rate`}
            iconClass="bg-emerald-400/10 text-emerald-400"
          />

          <ReportStat
            icon={<Clock3 size={20} />}
            label="Pending"
            value={stats.pending}
            description="Need attention"
            iconClass="bg-amber-400/10 text-amber-400"
          />

          <ReportStat
            icon={<AlertTriangle size={20} />}
            label="High Priority"
            value={stats.highPriority}
            description="Require urgent attention"
            iconClass="bg-red-400/10 text-red-400"
          />
        </div>

        {/* Monthly Overview */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-[#0D1B2A] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
              <TrendingUp size={18} />
            </div>

            <div>
              <h2 className="text-base font-semibold">
                Monthly Complaint Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Complaints received versus resolved, grouped by submission month
              </p>
            </div>
          </div>

          <div className="mt-6">
            <ResponsiveContainer width="100%" height={330}>
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />

                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  stroke="#64748B"
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D1B2A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Legend />

                <Bar
                  dataKey="complaints"
                  name="Complaints"
                  fill="#60A5FA"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="resolved"
                  name="Resolved"
                  fill="#34D399"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Distribution Charts */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Priority */}
          <section className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-400/10 text-red-400">
                <AlertTriangle size={18} />
              </div>

              <div>
                <h2 className="text-base font-semibold">
                  Priority Distribution
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Complaint priority levels
                </p>
              </div>
            </div>

            {complaints.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={55}
                    paddingAngle={4}
                    label
                  >
                    {priorityData.map((item) => (
                      <Cell
                        key={item.name}
                        fill={PRIORITY_COLORS[item.name] || "#818CF8"}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </section>

          {/* Categories */}
          <section className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-400/10 text-violet-400">
                <BarChart3 size={18} />
              </div>

              <div>
                <h2 className="text-base font-semibold">
                  Complaint Categories
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Most common complaint areas
                </p>
              </div>
            </div>

            {complaints.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ left: 5, right: 15 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />

                  <XAxis
                    type="number"
                    stroke="#64748B"
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="category"
                    stroke="#64748B"
                    tick={{ fontSize: 11 }}
                    width={75}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0D1B2A",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                  <Bar
                    dataKey="value"
                    name="Complaints"
                    fill="#818CF8"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </section>
        </div>

        {/* Business Recommendations */}
        <section className="mt-6 rounded-2xl border border-violet-400/20 bg-gradient-to-r from-violet-500/10 to-blue-500/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Sparkles size={21} />
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                Business Recommendations
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Recommended actions based on complaint patterns
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {recommendations.map((item) => (
                  <Recommendation
                    key={item.number}
                    number={item.number}
                    title={item.title}
                    text={item.text}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

/* Report Statistic */
function ReportStat({
  icon,
  label,
  value,
  description,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value.toLocaleString()}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {description}
      </p>
    </div>
  );
}

/* Recommendation */
function Recommendation({ number, title, text }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#07111F]/50 p-5">
      <span className="text-xs font-bold text-violet-400">
        {number}
      </span>

      <h3 className="mt-3 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}

/* Empty chart message */
function EmptyChart() {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-slate-500">
      No complaint data available yet.
    </div>
  );
}

export default Reports;

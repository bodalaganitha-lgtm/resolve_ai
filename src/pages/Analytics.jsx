
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Clock3,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  AlertTriangle,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Pie,
  Cell,
  Legend,
  PieChart,
} from "recharts";

const SENTIMENT_COLORS = {
  Negative: "#F87171",
  Neutral: "#FBBF24",
  Positive: "#34D399",
};

function Analytics() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all complaints for the manager
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in as a manager.");
        }

        const response = await fetch(
          "http://localhost:5000/api/complaints/all",
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
            data.message || "Unable to retrieve complaint analytics."
          );
        }

        setComplaints(data.complaints || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Calculate statistics
  const totalComplaints = complaints.length;

  const resolvedCount = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const pendingCount = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const highPriorityCount = complaints.filter(
    (item) => item.priority === "High"
  ).length;

  const resolutionRate =
    totalComplaints > 0
      ? ((resolvedCount / totalComplaints) * 100).toFixed(1)
      : "0.0";

  // Complaint counts by category
  const categoryCounts = complaints.reduce((counts, item) => {
    const category = item.category || "Other";
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});

  const categoryData = Object.entries(categoryCounts).map(
    ([category, count]) => ({
      category,
      complaints: count,
    })
  );

  categoryData.sort((a, b) => b.complaints - a.complaints);

  // Complaint counts by sentiment
  const sentimentCounts = complaints.reduce((counts, item) => {
    const sentiment = item.sentiment || "Neutral";
    counts[sentiment] = (counts[sentiment] || 0) + 1;
    return counts;
  }, {});

  const sentimentData = ["Negative", "Neutral", "Positive"]
    .map((name) => ({
      name,
      value: sentimentCounts[name] || 0,
    }))
    .filter((item) => item.value > 0);

  // Create the last six calendar months
  const lastSixMonths = [];

  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    lastSixMonths.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: date.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      }),
      complaints: 0,
      resolved: 0,
    });
  }

  // Group complaints by submission month
  complaints.forEach((item) => {
    if (!item.createdAt) return;

    const date = new Date(item.createdAt);

    if (Number.isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    const monthEntry = lastSixMonths.find(
      (month) => month.key === key
    );

    if (monthEntry) {
      monthEntry.complaints += 1;

      if (item.status === "Resolved") {
        monthEntry.resolved += 1;
      }
    }
  });

  const complaintTrend = lastSixMonths.map(
    ({ month, complaints }) => ({
      month,
      complaints,
    })
  );

  const resolutionData = lastSixMonths.map(
    ({ month, resolved }) => ({
      month,
      resolved,
    })
  );

  // Dynamic insights based on stored complaint data
  const mostCommonCategory = categoryData[0];

  const mostCommonSentiment = [...sentimentData].sort(
    (a, b) => b.value - a.value
  )[0];

  const negativeCount = sentimentCounts.Negative || 0;

  const negativePercentage =
    totalComplaints > 0
      ? ((negativeCount / totalComplaints) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-[#07111F] text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0A1726]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <BarChart3 size={20} />
            </div>

            <div>
              <p className="text-lg font-bold">
                Resolve<span className="text-blue-400">AI</span>
              </p>

              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Business Intelligence
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
        <div>

          <p className="text-sm font-medium text-blue-400">
            Business Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Analytics Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Understand complaint patterns, customer sentiment,
            resolution performance, and business trends using
            actual complaint records.
          </p>

        </div>

        {/* Loading and error messages */}
        {loading && (
          <div className="mt-8 rounded-xl border border-white/10 bg-[#0D1B2A] p-5 text-sm text-slate-400">
            Loading analytics from MongoDB...
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-xl border border-red-400/20 bg-red-400/5 p-5 text-sm text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Statistics */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <AnalyticsStat
                icon={<MessageSquare size={20} />}
                label="Total Complaints"
                value={totalComplaints}
                description="All customer complaints"
                iconClass="bg-blue-400/10 text-blue-400"
              />

              <AnalyticsStat
                icon={<TrendingUp size={20} />}
                label="Resolution Rate"
                value={`${resolutionRate}%`}
                description="Percentage of resolved complaints"
                iconClass="bg-emerald-400/10 text-emerald-400"
              />

              <AnalyticsStat
                icon={<Clock3 size={20} />}
                label="Pending Complaints"
                value={pendingCount}
                description="Awaiting resolution"
                iconClass="bg-amber-400/10 text-amber-400"
              />

              <AnalyticsStat
                icon={<AlertTriangle size={20} />}
                label="High Priority"
                value={highPriorityCount}
                description="High-priority complaints"
                iconClass="bg-red-400/10 text-red-400"
              />

            </div>

            {/* Charts */}
            <div className="mt-8 grid gap-6 lg:grid-cols-2">

              {/* Complaint Trend */}
              <ChartCard
                icon={<TrendingUp size={18} />}
                title="Complaint Volume"
                description="Complaints submitted during the last six months"
              >

                {totalComplaints === 0 ? (
                  <EmptyChart />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={complaintTrend}>

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

                      <Tooltip contentStyle={tooltipStyle} />

                      <Line
                        type="monotone"
                        dataKey="complaints"
                        name="Complaints"
                        stroke="#60A5FA"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />

                    </LineChart>
                  </ResponsiveContainer>
                )}

              </ChartCard>

              {/* Category Chart */}
              <ChartCard
                icon={<BarChart3 size={18} />}
                title="Complaints by Category"
                description="Actual distribution across complaint categories"
              >

                {categoryData.length === 0 ? (
                  <EmptyChart />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                      />

                      <XAxis
                        dataKey="category"
                        stroke="#64748B"
                        tick={{ fontSize: 11 }}
                      />

                      <YAxis
                        stroke="#64748B"
                        tick={{ fontSize: 12 }}
                        allowDecimals={false}
                      />

                      <Tooltip contentStyle={tooltipStyle} />

                      <Bar
                        dataKey="complaints"
                        name="Complaints"
                        fill="#818CF8"
                        radius={[6, 6, 0, 0]}
                      />

                    </BarChart>
                  </ResponsiveContainer>
                )}

              </ChartCard>

              {/* Sentiment */}
              <ChartCard
                icon={<PieChartIcon size={18} />}
                title="Customer Sentiment"
                description="Sentiment values stored with complaints"
              >

                {sentimentData.length === 0 ? (
                  <EmptyChart />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>

                      <Pie
                        data={sentimentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        innerRadius={55}
                        paddingAngle={4}
                        label
                      >

                        {sentimentData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={SENTIMENT_COLORS[entry.name] || "#818CF8"}
                          />
                        ))}

                      </Pie>

                      <Tooltip contentStyle={tooltipStyle} />

                      <Legend
                        verticalAlign="bottom"
                        height={36}
                      />

                    </PieChart>
                  </ResponsiveContainer>
                )}

              </ChartCard>

              {/* Resolution Trend */}
              <ChartCard
                icon={<CheckCircle2 size={18} />}
                title="Resolved Complaints"
                description="Resolved complaints grouped by submission month"
              >

                {totalComplaints === 0 ? (
                  <EmptyChart />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={resolutionData}>

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

                      <Tooltip contentStyle={tooltipStyle} />

                      <Line
                        type="monotone"
                        dataKey="resolved"
                        name="Resolved"
                        stroke="#34D399"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />

                    </LineChart>
                  </ResponsiveContainer>
                )}

              </ChartCard>

            </div>

            {/* Insights */}
            <section className="mt-8 rounded-2xl border border-violet-400/20 bg-gradient-to-r from-violet-500/10 to-blue-500/5 p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Sparkles size={21} />
                </div>

                <div className="w-full">

                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                    Complaint Insights
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    What is happening with customer complaints?
                  </h2>

                  {totalComplaints === 0 ? (
                    <p className="mt-4 text-sm text-slate-400">
                      Insights will appear when customer complaints
                      are available in the database.
                    </p>
                  ) : (
                    <div className="mt-4 grid gap-4 md:grid-cols-3">

                      <Insight
                        title="Most Common Category"
                        text={
                          `${mostCommonCategory?.category || "No data"} accounts for ` +
                          `${mostCommonCategory?.complaints || 0} complaint(s).`
                        }
                      />

                      <Insight
                        title="Customer Sentiment"
                        text={
                          `${mostCommonSentiment?.name || "No data"} is the most frequently recorded sentiment. ` +
                          `${negativePercentage}% of complaints are marked Negative.`
                        }
                      />

                      <Insight
                        title="Resolution Status"
                        text={
                          `${resolvedCount} of ${totalComplaints} complaints have been resolved. ` +
                          `${pendingCount} are currently pending.`
                        }
                      />

                    </div>
                  )}

                </div>

              </div>

            </section>
          </>
        )}

      </main>

    </div>
  );
}


/* Tooltip Styling */
const tooltipStyle = {
  backgroundColor: "#0D1B2A",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#fff",
};


/* Statistics Card */
function AnalyticsStat({
  icon,
  label,
  value,
  description,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-5">

      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-5 text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {description}
      </p>

    </div>
  );
}


/* Chart Card */
function ChartCard({
  icon,
  title,
  description,
  children,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-6">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
          {icon}
        </div>

        <div>
          <h2 className="text-base font-semibold">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

      </div>

      <div className="mt-5">
        {children}
      </div>

    </div>
  );
}


/* Empty Chart */
function EmptyChart() {
  return (
    <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
      No complaint data available yet.
    </div>
  );
}


/* Insight Card */
function Insight({ title, text }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#07111F]/50 p-4">

      <p className="text-sm font-medium text-white">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {text}
      </p>

    </div>
  );
}


export default Analytics;

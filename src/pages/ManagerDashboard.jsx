
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Search,
  Bell,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  TrendingUp,
  Sparkles,
  Eye,
  RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function ManagerDashboard() {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");

  // Fetch all complaints from MongoDB
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
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
        throw new Error(data.message || "Unable to fetch complaints.");
      }

      const formattedComplaints = (data.complaints || []).map((item) => ({
        mongoId: item._id,
        id: item.complaintId || item._id,
        title: item.title || "Untitled complaint",
        customer: item.user?.name || "Unknown customer",
        email: item.user?.email || "",
        category: item.category || "Other",
        sentiment: item.sentiment || "Neutral",
        priority: item.priority || "Medium",
        status: item.status || "Pending",
        date: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "N/A",
      }));

      setComplaints(formattedComplaints);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Update complaint status in MongoDB
  const handleStatusChange = async (mongoId, newStatus) => {
    try {
      setUpdatingId(mongoId);
      setUpdateMessage("");
      setError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(
        `http://localhost:5000/api/complaints/${mongoId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Status update failed.");
      }

      setComplaints((previousComplaints) =>
        previousComplaints.map((item) =>
          item.mongoId === mongoId
            ? {
                ...item,
                status: data.complaint.status,
              }
            : item
        )
      );

      setUpdateMessage("Complaint status updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update complaint status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Dynamic dashboard statistics
  const totalComplaints = complaints.length;

  const highPriority = complaints.filter(
    (item) => item.priority === "High"
  ).length;

  const pendingComplaints = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const resolvedComplaints = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const negativeComplaints = complaints.filter(
    (item) => item.sentiment === "Negative"
  ).length;

  const resolutionRate =
    totalComplaints > 0
      ? Math.round((resolvedComplaints / totalComplaints) * 100)
      : 0;

  // Search and priority filtering
  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      complaint.title.toLowerCase().includes(searchText) ||
      complaint.id.toLowerCase().includes(searchText) ||
      complaint.customer.toLowerCase().includes(searchText) ||
      complaint.category.toLowerCase().includes(searchText);

    const matchesPriority =
      priorityFilter === "All" ||
      complaint.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-[#07111F] text-white">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 border-r border-white/10 bg-[#0A1726] lg:flex lg:flex-col">

        <div className="border-b border-white/10 px-7 py-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Resolve<span className="text-blue-400">AI</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Complaint Intelligence
          </p>
        </div>

        <div className="px-5 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Workspace
          </p>

          <nav className="space-y-2">

            <Link
              to="/manager-dashboard"
              className="flex items-center gap-3 rounded-xl bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-400"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/complaint-history"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <MessageSquare size={18} />
              Complaints
            </Link>

            <Link
              to="/analytics"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <BarChart3 size={18} />
              Analytics
            </Link>

            <Link
              to="/reports"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <FileText size={18} />
              Reports
            </Link>

            <Link
              to="/settings"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Settings size={18} />
              Settings
            </Link>

          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-5">
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.href = "/login";
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">

        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0A1726]/95 px-5 py-5 backdrop-blur-xl md:px-8">

          <div>
            <p className="text-sm text-slate-500">
              Workspace / Manager
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              Manager Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchComplaints}
              disabled={loading}
              title="Refresh complaints"
              className="rounded-xl border border-white/10 p-2.5 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
            </button>

            <button className="relative rounded-xl border border-white/10 p-2.5 text-slate-400">
              <Bell size={18} />
            </button>

            <div className="hidden items-center gap-3 border-l border-white/10 pl-4 sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold">
                M
              </div>
              <div>
                <p className="text-sm font-medium">Manager</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-8 p-5 md:p-8">

          {/* Welcome Section */}
          <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Welcome Back, Manager!
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Monitor customer complaints and manage resolutions.
              </p>
            </div>

            <div className="rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-3">
              <p className="text-xs text-blue-300">
                Live Database Status
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-blue-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Connected to MongoDB
              </p>
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success Message */}
          {updateMessage && (
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-400">
              {updateMessage}
            </div>
          )}

          {/* Statistics */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Complaint Overview
              </h3>
              <span className="text-xs text-slate-500">
                Real-time database values
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <ManagerStat
                title="Total Complaints"
                value={totalComplaints}
                icon={<MessageSquare size={20} />}
                color="blue"
                description="Total submitted complaints"
              />

              <ManagerStat
                title="High Priority"
                value={highPriority}
                icon={<AlertTriangle size={20} />}
                color="red"
                description="Require attention"
              />

              <ManagerStat
                title="Pending Complaints"
                value={pendingComplaints}
                icon={<Clock3 size={20} />}
                color="amber"
                description="Awaiting resolution"
              />

              <ManagerStat
                title="Resolved Complaints"
                value={resolvedComplaints}
                icon={<CheckCircle2 size={20} />}
                color="green"
                description={`${resolutionRate}% resolution rate`}
              />

            </div>
          </section>

          {/* AI Overview */}
          <section className="rounded-2xl border border-blue-400/20 bg-gradient-to-r from-[#10243A] to-[#171B36] p-6">

            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-blue-400/10 p-3 text-blue-400">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="font-semibold">Complaint Intelligence Overview</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Insights calculated from current complaint data
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

              <AIStat
                title="Negative Sentiment"
                value={negativeComplaints}
                description="Complaints with negative sentiment"
              />

              <AIStat
                title="Resolution Rate"
                value={`${resolutionRate}%`}
                description="Percentage of resolved complaints"
              />

              <AIStat
                title="High Priority"
                value={highPriority}
                description="Complaints requiring attention"
              />

            </div>
          </section>

          {/* Complaints Table */}
          <section className="mt-8">

            <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>
                <h3 className="text-lg font-semibold">
                  Customer Complaints
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Review complaints and update their status.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* Search */}
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0D1B2A] px-3 py-2.5">
                  <Search size={17} className="text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 sm:w-48"
                  />
                </div>

                {/* Priority Filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0D1B2A] px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-blue-400"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>

              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0D1B2A]">

              <table className="w-full min-w-[1050px] text-left">

                <thead className="border-b border-white/10 bg-white/[0.02]">
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-medium">Complaint</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Sentiment</th>
                    <th className="px-6 py-4 font-medium">Priority</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">

                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-400">
                        Loading complaints...
                      </td>
                    </tr>
                  ) : filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-400">
                        No complaints found.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <ComplaintRow
                        key={complaint.mongoId}
                        complaint={complaint}
                        onStatusChange={handleStatusChange}
                        updating={updatingId === complaint.mongoId}
                      />
                    ))
                  )}

                </tbody>
              </table>
            </div>

            {!loading && (
              <p className="mt-4 text-xs text-slate-500">
                Showing {filteredComplaints.length} of {totalComplaints} complaints
              </p>
            )}

          </section>

          {/* Bottom Information */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-400/10 p-3 text-blue-400">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Customer Feedback</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Negative sentiment complaints
                  </p>
                </div>
              </div>

              <p className="mt-5 text-3xl font-bold">
                {negativeComplaints}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Complaints that may need additional attention
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-400">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Resolution Progress</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Current complaint resolution rate
                  </p>
                </div>
              </div>

              <p className="mt-5 text-3xl font-bold">
                {resolutionRate}%
              </p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
                  style={{ width: `${resolutionRate}%` }}
                />
              </div>
            </div>

          </section>

          <footer className="border-t border-white/10 py-5 text-center text-xs text-slate-600">
            © 2026 ResolveAI. Complaint Intelligence Platform.
          </footer>

        </div>
      </main>
    </div>
  );
}


// Manager Dashboard Statistic Card
function ManagerStat({ title, value, icon, color, description }) {
  const colorClasses = {
    blue: "bg-blue-400/10 text-blue-400",
    red: "bg-red-400/10 text-red-400",
    amber: "bg-amber-400/10 text-amber-400",
    green: "bg-emerald-400/10 text-emerald-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-5 transition hover:border-white/20">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div className={`rounded-xl p-3 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>

      <h3 className="mt-5 text-3xl font-bold">{value}</h3>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}


// AI Overview Statistic Card
function AIStat({ title, value, description }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/10 p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-3 text-2xl font-bold text-white">{value}</h3>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}


// Complaint Table Row
function ComplaintRow({ complaint, onStatusChange, updating }) {
  return (
    <tr className="transition hover:bg-white/[0.02]">

      <td className="px-6 py-5">
        <p className="text-sm font-medium text-white">
          {complaint.title}
        </p>
        <p className="mt-1 text-xs text-slate-600">
          {complaint.id} • {complaint.date}
        </p>
      </td>

      <td className="px-6 py-5 text-sm text-slate-300">
        <p>{complaint.customer}</p>
        {complaint.email && (
          <p className="mt-1 text-xs text-slate-500">
            {complaint.email}
          </p>
        )}
      </td>

      <td className="px-6 py-5">
        <span className="rounded-lg bg-blue-400/10 px-3 py-1.5 text-xs text-blue-400">
          {complaint.category}
        </span>
      </td>

      <td className="px-6 py-5">
        <span
          className={`rounded-lg px-3 py-1.5 text-xs ${
            complaint.sentiment === "Negative"
              ? "bg-red-400/10 text-red-400"
              : complaint.sentiment === "Positive"
              ? "bg-emerald-400/10 text-emerald-400"
              : "bg-slate-400/10 text-slate-400"
          }`}
        >
          {complaint.sentiment}
        </span>
      </td>

      <td className="px-6 py-5">
        <PriorityBadge priority={complaint.priority} />
      </td>

      {/* Editable Status Dropdown */}
      <td className="px-6 py-5">
        <select
          value={complaint.status}
          disabled={updating}
          onChange={(e) =>
            onStatusChange(complaint.mongoId, e.target.value)
          }
          className="rounded-lg border border-white/10 bg-[#07111F] px-3 py-2 text-xs text-white outline-none focus:border-blue-400 disabled:cursor-wait disabled:opacity-50"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        {updating && (
          <p className="mt-1 text-xs text-blue-400">
            Updating...
          </p>
        )}
      </td>

      <td className="px-6 py-5">
        <span className="flex items-center gap-2 text-xs text-slate-400">
          <Eye size={15} />
          Manage
        </span>
      </td>

    </tr>
  );
}


// Priority Badge
function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-red-400/10 text-red-400",
    Medium: "bg-amber-400/10 text-amber-400",
    Low: "bg-emerald-400/10 text-emerald-400",
  };

  return (
    <span
      className={`rounded-lg px-3 py-1.5 text-xs ${
        styles[priority] || styles.Medium
      }`}
    >
      {priority}
    </span>
  );
}

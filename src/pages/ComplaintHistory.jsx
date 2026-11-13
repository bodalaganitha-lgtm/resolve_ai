
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Clock3,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";

function ComplaintHistory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch complaints from MongoDB through the backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your complaints.");
          setLoading(false);
          return;
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

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load complaints."
          );
        }

        const formattedComplaints = (data.complaints || []).map(
          (item) => ({
            id: item.complaintId || item._id,
            title: item.title,
            category: item.category,
            sentiment: item.sentiment,
            priority: item.priority,
            status: item.status,
            date: item.createdAt
              ? new Date(item.createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )
              : "Date unavailable",
          })
        );

        setComplaints(formattedComplaints);
      } catch (err) {
        console.error("Complaint history error:", err);
        setError(
          err.message || "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Calculate summary cards dynamically
  const totalComplaints = complaints.length;

  const pendingCount = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgressCount = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  // Search and filter
  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
  (complaint.title || "").toLowerCase().includes(searchText) ||
  (complaint.id || "").toLowerCase().includes(searchText) ||
  (complaint.category || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* Heading */}
        <div className="mb-8">

          <p className="text-sm font-medium text-blue-400">
            Customer Support
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Complaint History
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            View and track all complaints submitted through ResolveAI.
          </p>

        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            icon={<MessageSquare size={19} />}
            label="Total Complaints"
            value={loading ? "..." : totalComplaints}
            iconClass="bg-blue-400/10 text-blue-400"
          />

          <SummaryCard
            icon={<Clock3 size={19} />}
            label="Pending"
            value={loading ? "..." : pendingCount}
            iconClass="bg-amber-400/10 text-amber-400"
          />

          <SummaryCard
            icon={<AlertCircle size={19} />}
            label="In Progress"
            value={loading ? "..." : inProgressCount}
            iconClass="bg-violet-400/10 text-violet-400"
          />

          <SummaryCard
            icon={<CheckCircle2 size={19} />}
            label="Resolved"
            value={loading ? "..." : resolvedCount}
            iconClass="bg-emerald-400/10 text-emerald-400"
          />

        </div>

        {/* Search and filter */}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0D1B2A] p-4 md:flex-row">

          {/* Search */}
          <div className="relative flex-1">

            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#07111F] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400"
            />

          </div>

          {/* Filter */}
          <div className="relative">

            <Filter
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-[#07111F] py-3 pl-10 pr-8 text-sm text-white outline-none focus:border-blue-400 md:w-48"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

          </div>

        </div>

        {/* Complaint table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0D1B2A]">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="border-b border-white/10 bg-white/[0.02]">

                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

                  <th className="px-6 py-4 font-medium">
                    Complaint
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Category
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Priority
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Date
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-white/5">

                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center text-sm text-slate-400"
                    >
                      Loading your complaints...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center text-sm text-red-400"
                    >
                      {error}
                    </td>
                  </tr>
                ) : filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint) => (
                    <ComplaintRow
                      key={complaint.id}
                      complaint={complaint}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center"
                    >
                      <Search
                        size={30}
                        className="mx-auto text-slate-600"
                      />

                      <p className="mt-3 text-sm text-slate-400">
                        No complaints found
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Try changing your search or filter.
                      </p>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

/* Summary Card */

function SummaryCard({
  icon,
  label,
  value,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1B2A] p-5">

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}

/* Complaint Row */

function ComplaintRow({ complaint }) {
  return (
    <tr className="transition hover:bg-white/[0.02]">

      <td className="px-6 py-5">

        <div>
          <p className="text-sm font-medium text-white">
            {complaint.title}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {complaint.id}
          </p>
        </div>

      </td>

      <td className="px-6 py-5">

        <span className="rounded-lg bg-blue-400/10 px-3 py-1.5 text-xs text-blue-400">
          {complaint.category}
        </span>

      </td>

      <td className="px-6 py-5">
        <PriorityBadge priority={complaint.priority} />
      </td>

      <td className="px-6 py-5">
        <StatusBadge status={complaint.status} />
      </td>

      <td className="px-6 py-5 text-sm text-slate-400">
        {complaint.date}
      </td>

      <td className="px-6 py-5">

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <Eye size={15} />
          View
        </button>

      </td>

    </tr>
  );
}

/* Priority Badge */

function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-red-400/10 text-red-400",
    Medium: "bg-amber-400/10 text-amber-400",
    Low: "bg-emerald-400/10 text-emerald-400",
  };

  return (
    <span
      className={`rounded-lg px-3 py-1.5 text-xs ${styles[priority] || ""}`}
    >
      {priority}
    </span>
  );
}

/* Status Badge */

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-400/10 text-amber-400",
    "In Progress": "bg-violet-400/10 text-violet-400",
    Resolved: "bg-emerald-400/10 text-emerald-400",
  };

  return (
    <span
      className={`rounded-lg px-3 py-1.5 text-xs ${styles[status] || ""}`}
    >
      {status}
    </span>
  );
}

export default ComplaintHistory;

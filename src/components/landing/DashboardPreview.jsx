import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Brain,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    label: "Total Complaints",
    value: "1,284",
    change: "+12.5%",
    icon: MessageSquare,
    iconStyle: "bg-blue-500/10 text-blue-400",
  },
  {
    label: "High Priority",
    value: "18",
    change: "-8.2%",
    icon: AlertTriangle,
    iconStyle: "bg-amber-500/10 text-amber-400",
  },
  {
    label: "Resolved",
    value: "1,102",
    change: "+18.4%",
    icon: CheckCircle2,
    iconStyle: "bg-emerald-500/10 text-emerald-400",
  },
  {
    label: "AI Confidence",
    value: "94%",
    change: "+3.1%",
    icon: Brain,
    iconStyle: "bg-violet-500/10 text-violet-400",
  },
];

const complaints = [
  {
    title: "Order arrived damaged",
    category: "Product",
    sentiment: "Negative",
    priority: "High",
  },
  {
    title: "Delivery took longer than expected",
    category: "Delivery",
    sentiment: "Negative",
    priority: "Medium",
  },
  {
    title: "Great customer support experience",
    category: "Support",
    sentiment: "Positive",
    priority: "Low",
  },
];

function DashboardPreview() {
  return (
    <section className="relative overflow-hidden bg-[#0D1B2A] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300">
            Intelligent dashboard
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            See your customer feedback
            <span className="block text-violet-400">
              from a smarter perspective.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            ResolveAI transforms thousands of customer complaints into
            simple, actionable insights for your team.
          </p>
        </motion.div>

        {/* Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mt-16 max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#07111F] shadow-2xl shadow-black/30"
        >

          {/* Dashboard top bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">

            <div>
              <p className="text-lg font-bold text-white">
                ResolveAI
              </p>
              <p className="text-xs text-slate-500">
                Manager Dashboard
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              AI System Active
            </div>

          </div>

          <div className="p-6 sm:p-8">

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-[#12233A] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconStyle}`}
                      >
                        <Icon size={20} />
                      </div>

                      <ArrowUpRight
                        size={16}
                        className="text-slate-600"
                      />
                    </div>

                    <p className="mt-5 text-sm text-slate-400">
                      {stat.label}
                    </p>

                    <div className="mt-1 flex items-end justify-between">
                      <p className="text-2xl font-bold text-white">
                        {stat.value}
                      </p>

                      <span className="text-xs font-semibold text-emerald-400">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* Lower dashboard */}
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">

              {/* Chart */}
              <div className="rounded-2xl border border-white/10 bg-[#12233A] p-6">

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">
                      Complaint Trends
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Last 7 days
                    </p>
                  </div>

                  <TrendingUp
                    size={20}
                    className="text-blue-400"
                  />
                </div>

                {/* Fake chart */}
                <div className="mt-8 flex h-44 items-end gap-3">

                  {[45, 70, 55, 82, 60, 92, 76, 100, 72, 88, 65, 95].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600/40 to-blue-400"
                        style={{ height: `${height}%` }}
                      />
                    )
                  )}

                </div>

                <div className="mt-3 flex justify-between text-[10px] text-slate-600">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>

              </div>

              {/* AI Insights */}
              <div className="rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-6">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Brain size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      AI Insights
                    </h3>
                    <p className="text-xs text-slate-500">
                      Generated automatically
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">

                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                    <p className="text-sm font-medium text-slate-200">
                      Delivery complaints increased
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      AI detected a 23% increase compared with last week.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                    <p className="text-sm font-medium text-slate-200">
                      Negative sentiment detected
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Most negative feedback is related to delivery delays.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Recent complaints */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-[#12233A] p-6">

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">
                  Recent Complaints
                </h3>

                <span className="text-xs font-medium text-blue-400">
                  View all →
                </span>
              </div>

              <div className="mt-5 space-y-3">

                {complaints.map((complaint) => (
                  <div
                    key={complaint.title}
                    className="flex flex-col gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {complaint.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {complaint.category}
                      </p>
                    </div>

                    <div className="flex gap-2 text-xs">

                      <span className="rounded-full bg-red-400/10 px-3 py-1 text-red-400">
                        {complaint.sentiment}
                      </span>

                      <span className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-400">
                        {complaint.priority}
                      </span>

                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default DashboardPreview;
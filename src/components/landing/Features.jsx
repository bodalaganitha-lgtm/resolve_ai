import {
  Brain,
  MessageCircle,
  Target,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "AI Complaint Analysis",
    description:
      "Automatically understand and categorize complaints using intelligent language analysis.",
    iconStyle: "bg-blue-50 text-blue-600",
  },
  {
    icon: MessageCircle,
    title: "Sentiment Detection",
    description:
      "Identify customer emotions and understand whether feedback is positive, neutral, or negative.",
    iconStyle: "bg-violet-50 text-violet-600",
  },
  {
    icon: Target,
    title: "Root Cause Detection",
    description:
      "Go beyond the complaint and identify the underlying issues causing repeated customer problems.",
    iconStyle: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description:
      "Turn complaint data into actionable insights with trends, patterns, and performance metrics.",
    iconStyle: "bg-cyan-50 text-cyan-600",
  },
];

function Features() {
  return (
    <section
  id="features"
  className="relative overflow-hidden bg-[#0D1B2A] py-24 lg:py-32"
>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-300">
            Powerful AI capabilities
          </div>
text-white
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Everything you need to
            <span className="block text-blue-600">
              resolve complaints smarter.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            ResolveAI combines artificial intelligence and business analytics
            to transform customer complaints into meaningful actions.
          </p>

        </div>

        {/* Feature cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#12233A] p-8 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/30"
              >

                {/* Decorative background */}
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-100/40 blur-2xl transition group-hover:bg-blue-200/50" />

                <div className="relative">

                  {/* Icon */}
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconStyle}`}
                  >
                    <Icon size={26} />
                  </div>

                  {/* Content */}
                  <div className="mt-7 flex items-start justify-between gap-5">

                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {feature.title}
                      </h3>

                      <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                        {feature.description}
                      </p>
                    </div>

                    <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition group-hover:border-blue-200 group-hover:text-blue-600 sm:flex">
                      <ArrowUpRight size={18} />
                    </div>

                  </div>

                </div>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default Features;
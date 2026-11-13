import {
  MessageSquareText,
  Brain,
  ScanSearch,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: MessageSquareText,
    title: "Submit Complaint",
    description:
      "The customer describes their problem through the ResolveAI complaint form.",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Understands",
    description:
      "AI analyzes the complaint and identifies its category, intent, and important details.",
  },
  {
    number: "03",
    icon: ScanSearch,
    title: "Detect Issues",
    description:
      "The system detects sentiment, priority, and possible root causes behind the complaint.",
  },
  {
    number: "04",
    icon: Lightbulb,
    title: "Get Resolution",
    description:
      "ResolveAI generates an intelligent resolution recommendation for the manager.",
  },
  {
    number: "05",
    icon: CheckCircle2,
    title: "Resolve & Learn",
    description:
      "The complaint is resolved and the resulting data contributes to business insights.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#07111F] py-24 lg:py-32"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
            Simple. Intelligent. Automated.
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            How
            <span className="text-blue-400"> ResolveAI </span>
            works
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            From the moment a complaint is submitted, AI helps transform
            unstructured customer feedback into actionable information.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-20">

          {/* Connecting line - desktop */}
          <div className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-gradient-to-r from-blue-500/10 via-blue-500/50 to-violet-500/10 lg:block" />

          <div className="grid gap-10 lg:grid-cols-5 lg:gap-6">

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="relative text-center"
                >

                  {/* Icon */}
                  <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-[#12233A] text-blue-400 shadow-xl shadow-blue-950/20 transition duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:text-cyan-300">
                    <Icon size={27} />
                  </div>

                  {/* Step number */}
                  <div className="mt-5 text-xs font-bold tracking-[0.2em] text-blue-400">
                    STEP {step.number}
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-lg font-bold text-white">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {step.description}
                  </p>

                </motion.div>
              );
            })}

          </div>
        </div>

        {/* AI pipeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-20 max-w-5xl rounded-3xl border border-white/10 bg-[#0D1B2A] p-6 shadow-2xl shadow-blue-950/20 sm:p-8"
        >
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              AI processing pipeline
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm">

              {[
                "Complaint",
                "Category",
                "Sentiment",
                "Priority",
                "Root Cause",
                "Resolution",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="rounded-xl border border-white/10 bg-[#12233A] px-4 py-2.5 font-medium text-slate-200">
                    {item}
                  </span>

                  {index < 5 && (
                    <span className="hidden text-blue-400 sm:block">
                      →
                    </span>
                  )}
                </div>
              ))}

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default HowItWorks;
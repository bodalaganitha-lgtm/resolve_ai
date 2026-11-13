import { ArrowRight, Play, Sparkles, ShieldCheck, Brain, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.png";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#07111F]">
      
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-fullbg-violet-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 shadow-sm">
              <Sparkles size={16} />
              AI-Powered Complaint Resolution
            </div>

            {/* Heading */}
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Turn customer complaints into
              <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                intelligent resolutions.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              ResolveAI uses artificial intelligence to understand customer
              complaints, detect sentiment, identify root causes, and recommend
              effective resolutions.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">

              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700"
              >
                Get Started

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-4 font-semibold text-slate-200 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:text-blue-600"
              >
                <Play size={17} />
                See How It Works
              </a>

            </div>

            {/* Trust indicators */}
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-5 border-t border-slate-200 pt-7">

              <div>
                <div className="flex items-center gap-2 text-slate-900">
                  <Brain size={18} className="text-blue-600" />
                  <span className="font-bold">AI Analysis</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Intelligent insights
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-900">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <span className="font-bold">Smart</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Data-driven decisions
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-900">
                  <Clock3 size={18} className="text-cyan-600" />
                  <span className="font-bold">24/7</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Always available
                </p>
              </div>

            </div>

          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative flex items-center justify-center"
          >

            {/* Glow */}
            <div className="absolute h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />

            {/* Image container */}
            <div className="relative w-full max-w-xl">
              <img
                src={heroImage}
                alt="ResolveAI AI complaint analysis"
                className="relative z-10 w-full drop-shadow-2xl"
              />
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
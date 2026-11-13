import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#07111F] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-blue-400/20 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-6 py-16 text-center shadow-2xl shadow-blue-950/30 sm:px-12 lg:px-20 lg:py-20"
        >

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />

          {/* Content */}
          <div className="relative mx-auto max-w-3xl">

            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-50 backdrop-blur-sm">
              <Sparkles size={16} />
              AI-powered complaint resolution
            </div>

            <h2 className="mt-7 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Ready to resolve complaints smarter?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg sm:leading-8">
              Turn customer complaints into meaningful insights,
              intelligent recommendations, and better customer experiences.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">

              <button className="group flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-700 shadow-xl shadow-blue-950/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-50">
                Get Started

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button className="rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:bg-white/15">
                Explore Dashboard
              </button>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default CTA;
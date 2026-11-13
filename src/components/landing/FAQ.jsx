import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is ResolveAI?",
    answer:
      "ResolveAI is an AI-powered complaint resolution platform that analyzes customer complaints, identifies important patterns, detects sentiment and root causes, and provides intelligent resolution recommendations.",
  },
  {
    question: "How does AI analyze a complaint?",
    answer:
      "When a complaint is submitted, the AI processes the text using natural language processing. It identifies the complaint category, customer sentiment, priority, key issues, and possible root causes.",
  },
  {
    question: "Does AI automatically resolve the complaint?",
    answer:
      "ResolveAI assists the support team by analyzing the complaint and generating a recommended response or resolution. The manager or support agent can review and approve the recommendation before sending it to the customer.",
  },
  {
    question: "Can managers modify AI recommendations?",
    answer:
      "Yes. Managers can review the AI-generated analysis and modify the recommended resolution before it is sent to the customer. This keeps humans in control of the final decision.",
  },
  {
    question: "What insights can businesses get?",
    answer:
      "The platform can identify complaint trends, frequently occurring problems, sentiment patterns, high-priority issues, root causes, and other useful business insights.",
  },
  {
    question: "Is customer data stored securely?",
    answer:
      "The production version of ResolveAI would use authentication, authorization, encrypted communication, secure database practices, and appropriate access controls to protect customer information.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#07111F] py-24 lg:py-32"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300">
            FAQ
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Questions?
            <span className="text-violet-400"> We've got answers.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Everything you need to know about how ResolveAI works.
          </p>
        </motion.div>

        {/* FAQ list */}
        <div className="mt-14 space-y-4">

          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-violet-400/30 bg-[#12233A]"
                    : "border-white/10 bg-[#0D1B2A] hover:border-white/20"
                }`}
              >

                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left sm:px-8"
                >
                  <span className="text-base font-semibold text-white sm:text-lg">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                      isOpen
                        ? "bg-violet-500/10 text-violet-400"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {isOpen ? (
                      <Minus size={18} />
                    ) : (
                      <Plus size={18} />
                    )}
                  </span>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="border-t border-white/10 px-6 pb-6 pt-5 sm:px-8">
                        <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default FAQ;
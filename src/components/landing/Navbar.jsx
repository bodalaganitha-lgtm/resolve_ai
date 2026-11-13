import { ArrowRight, Bot } from "lucide-react";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111F]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-600/20">
            <Bot size={23} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Resolve<span className="text-blue-600">AI</span>
            </h1>

            <p className="hidden text-[10px] font-medium uppercase tracking-widest text-slate-400 sm:block">
              Intelligent Resolution
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            How It Works
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            About
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden px-4 py-2 text-sm font-semibold text-slate-300 transition hover:text-blue-600 sm:block">
            Log in
          </button>

          <button className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-violet-500">
            Get Started

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
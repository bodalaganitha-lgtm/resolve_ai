function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050D18] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold">
              Resolve<span className="text-blue-400">AI</span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              AI-powered complaint resolution that transforms customer
              feedback into intelligent actions and useful business insights.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white">
              Product
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>Features</p>
              <p>How It Works</p>
              <p>Dashboard</p>
              <p>FAQ</p>
            </div>
          </div>

          {/* Project */}
          <div>
            <h3 className="font-semibold text-white">
              Project
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>About ResolveAI</p>
              <p>Documentation</p>
              <p>GitHub Repository</p>
              <p>Contact</p>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-sm text-slate-500">
            © 2026 ResolveAI. Built with AI for better customer experiences.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
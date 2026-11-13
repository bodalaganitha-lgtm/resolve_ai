import { ArrowRight, Brain, BarChart3, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">ResolveAI</div>
          <div className="space-x-4">
            <button className="text-gray-600 hover:text-blue-600">Login</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          AI Complaint Resolution
          <br />
          & Decision Support Platform
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Automatically analyse customer complaints, detect sentiment, identify
          root causes, prioritise issues, and provide intelligent recommendations
          for retail businesses.
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700">
            Get Started
            <ArrowRight size={18} />
          </button>

          <button className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          AI-Powered Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow">
            <Brain className="text-blue-600 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-3">
              Smart Complaint Analysis
            </h3>
            <p className="text-gray-600">
              Automatically categorises complaints and detects customer sentiment
              using AI.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <BarChart3 className="text-green-600 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-3">
              Business Analytics
            </h3>
            <p className="text-gray-600">
              Visual dashboards help managers identify trends and recurring
              customer issues.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <ShieldCheck className="text-purple-600 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-3">
              Decision Support
            </h3>
            <p className="text-gray-600">
              AI recommends departments, priorities, and resolution actions for
              faster complaint handling.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
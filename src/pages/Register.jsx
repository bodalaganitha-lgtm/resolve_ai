
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../config";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      let response;

      try {
        response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            password,
          }),
        });
      } catch {
        // fetch only throws when the server cannot be reached at all.
        throw new Error(
          "Cannot reach the server. Please check that the backend is running and try again."
        );
      }

      // The body may not be JSON (e.g. an error page from a proxy).
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Registration failed (error ${response.status}). Please try again.`
        );
      }

      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });

    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-white">

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-2xl font-bold">
            Resolve<span className="text-blue-400">AI</span>
          </Link>

          <Link to="/" className="text-sm text-slate-400 hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-bold">
              R
            </div>

            <h1 className="mt-6 text-3xl font-bold">
              Create your account
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Start managing customer complaints smarter
            </p>
          </div>

          <form
            onSubmit={handleRegister}
            className="mt-8 rounded-3xl border border-white/10 bg-[#0D1B2A] p-6 shadow-2xl sm:p-8"
          >

            {error && (
              <p className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <div>
              <label className="text-sm font-medium text-slate-300">
                Full name
              </label>

              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400"
                required
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-slate-300">
                Email address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400"
                required
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400"
                required
              />

              <p className="mt-2 text-xs text-slate-500">
                Password must contain at least 8 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>

          </form>
        </div>
      </main>
    </div>
  );
}

export default Register;

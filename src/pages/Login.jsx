import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email dan Password wajib diisi.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (
        email === "GRCAYUU@gmail.com" &&
        password === "GRCAYUU02"
      ) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else {
        setError("Email atau Password salah.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    // Background gradient penuh layar sebagai dasar efek kaca
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-900 via-purple-900 to-slate-900 p-4 font-sans">
      
      {/* Kartu Login dengan gaya Glassmorphism */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Selamat Datang kembali 👋
        </h1>
        
        <p className="text-gray-300 text-sm mb-8 text-center">
          Masuk untuk melanjutkan ke FocusFlow.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all backdrop-blur-sm"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all backdrop-blur-sm"
          />

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-xl p-3 text-center backdrop-blur-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;
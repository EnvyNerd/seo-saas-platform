import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Globe, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
            <Globe className="text-white h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SEO AI Platform</h1>
          <p className="text-slate-400 mt-1">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl shadow-xl">
          {error && (
            <div className="mb-6 flex items-center gap-2 p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-xs text-rose-300">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 px-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <Link to="/forgot-password" size="sm" className="text-xs font-semibold text-purple-400 hover:text-purple-300">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-white hover:text-purple-400 transition-colors">
                Create one for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

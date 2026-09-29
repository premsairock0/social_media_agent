import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Lightbulb, 
  TrendingUp, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { SoundwaveIcon, GoogleIcon, MicrosoftIcon } from '../components/common/BrandLogo';
import ThemeToggle from '../components/common/ThemeToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const rawFrom = location.state?.from?.pathname;
  const from = (rawFrom && rawFrom !== '/' && rawFrom !== '/login') ? rawFrom : '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email.trim(), password, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialClick = (provider) => {
    setEmail(`${provider.toLowerCase()}@kazam.ai`);
    setPassword('PulsePass2026!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans relative overflow-hidden transition-colors duration-200">
      {/* Top Right Theme Toggle */}
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle />
      </div>

      {/* Subtle ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-100/60 dark:bg-purple-900/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-100/60 dark:bg-indigo-900/20 blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] bg-white dark:bg-[#121A2A] border border-slate-200 dark:border-indigo-500/25 shadow-xl dark:shadow-2xl overflow-hidden p-3 sm:p-4 gap-4 z-10 transition-colors">
        
        {/* Left Visual Column */}
        <div className="relative rounded-[1.75rem] bg-slate-50 dark:bg-[#0D1322] p-6 sm:p-8 flex flex-col justify-between overflow-hidden border border-slate-200/80 dark:border-indigo-500/20 transition-colors">
          
          {/* Header branding */}
          <div className="space-y-4 z-10">
            <div className="flex items-center gap-2.5">
              <SoundwaveIcon />
              <span className="font-extrabold text-2xl tracking-wider text-slate-900 dark:text-white">
                KAZAM
              </span>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium pl-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>Understand your audience.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>Create what matters.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>Grow everywhere.</span>
              </li>
            </ul>
          </div>

          {/* Floating UI Elements & Character Illustration */}
          <div className="relative my-4 flex items-center justify-center min-h-[300px] sm:min-h-[360px]">
            
            {/* Floating 3D LinkedIn Tile */}
            <div className="absolute top-2 left-2 z-20 w-11 h-11 rounded-2xl bg-[#0A66C2] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/25 rotate-[-8deg] hover:rotate-0 transition-transform duration-300">
              in
            </div>

            {/* Floating 3D Instagram Tile */}
            <div className="absolute top-4 left-20 z-20 w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 rotate-[6deg] hover:rotate-0 transition-transform duration-300">
              <div className="w-6 h-6 border-2 border-white rounded-lg flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-white" />
              </div>
            </div>

            {/* Floating Badge: Better Content */}
            <div className="absolute top-1 right-2 z-20 bg-white dark:bg-[#172033] px-3.5 py-2 rounded-2xl shadow-md border border-slate-200 dark:border-indigo-500/30 flex items-center gap-2 max-w-[190px] transition-colors">
              <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4 fill-amber-400 text-amber-500" />
              </div>
              <p className="text-[10px] leading-tight font-medium text-slate-700 dark:text-slate-300">
                <strong className="block text-slate-900 dark:text-white font-semibold">Better content.</strong>
                Higher engagement. Smarter growth.
              </p>
            </div>

            {/* Floating Badge: Engagement Chart */}
            <div className="absolute bottom-6 right-2 z-20 bg-white dark:bg-[#172033] px-4 py-2.5 rounded-2xl shadow-md border border-slate-200 dark:border-indigo-500/30 transition-colors">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="text-[11px] font-bold text-slate-800 dark:text-white">Engagement</span>
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex items-end gap-1.5 h-8">
                <span className="w-2 bg-indigo-200 dark:bg-indigo-900/60 rounded-t h-3" />
                <span className="w-2 bg-indigo-300 dark:bg-indigo-800/70 rounded-t h-4" />
                <span className="w-2 bg-indigo-400 dark:bg-indigo-700/80 rounded-t h-5" />
                <span className="w-2 bg-indigo-500 dark:bg-indigo-600 rounded-t h-7" />
                <span className="w-2 bg-indigo-600 dark:bg-indigo-500 rounded-t h-8" />
              </div>
            </div>

            {/* Character Illustration */}
            <div className="relative w-64 sm:w-72 aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-indigo-500/20 group">
              <img
                src="/assets/login_character.jpg"
                alt="Kazam Creator"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            AI-driven episodic intelligence for LinkedIn & Instagram
          </div>
        </div>

        {/* Right Form Card */}
        <div className="rounded-[1.75rem] bg-white dark:bg-[#121A2A] p-6 sm:p-10 flex flex-col justify-between transition-colors">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Log in to your Kazam account and continue growing.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-indigo-500/30 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-indigo-500/30 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password row */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-indigo-500/20" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white dark:bg-[#121A2A] px-3 text-slate-400 dark:text-slate-500 font-semibold tracking-wider">
                  OR
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleSocialClick('Google')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-indigo-500/25 bg-white dark:bg-[#172033] hover:bg-slate-50 dark:hover:bg-[#1b253b] text-slate-700 dark:text-[#F5F7FF] font-medium text-xs flex items-center justify-center gap-2.5 shadow-sm transition"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialClick('Microsoft')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-indigo-500/25 bg-white dark:bg-[#172033] hover:bg-slate-50 dark:hover:bg-[#1b253b] text-slate-700 dark:text-[#F5F7FF] font-medium text-xs flex items-center justify-center gap-2.5 shadow-sm transition"
              >
                <MicrosoftIcon />
                <span>Continue with Microsoft</span>
              </button>
            </div>
          </div>

          {/* Footer toggle link */}
          <div className="text-center pt-6 text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign up
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

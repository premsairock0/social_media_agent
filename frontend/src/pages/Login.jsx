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

  const from = location.state?.from?.pathname || '/';

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
    // Quick demo login helper
    setEmail(`${provider.toLowerCase()}@socialpulse.ai`);
    setPassword('PulsePass2026!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] via-[#DDD6FE]/60 to-[#F5E8FF] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-300/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-300/30 blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/80 shadow-2xl overflow-hidden p-3 sm:p-4 gap-4 z-10">
        
        {/* Left Visual Column */}
        <div className="relative rounded-[2rem] bg-gradient-to-b from-indigo-50/70 via-purple-50/50 to-purple-100/60 p-6 sm:p-8 flex flex-col justify-between overflow-hidden border border-white/60">
          
          {/* Header branding */}
          <div className="space-y-4 z-10">
            <div className="flex items-center gap-2.5">
              <SoundwaveIcon />
              <span className="font-bold text-2xl tracking-tight text-slate-900">
                Social<span className="text-indigo-600">Pulse</span>
              </span>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600 font-medium pl-1">
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
            <div className="absolute top-1 right-2 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-purple-100 flex items-center gap-2 max-w-[190px]">
              <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4 fill-amber-400 text-amber-500" />
              </div>
              <p className="text-[10px] leading-tight font-medium text-slate-700">
                <strong className="block text-slate-900 font-semibold">Better content.</strong>
                Higher engagement. Smarter growth.
              </p>
            </div>

            {/* Floating Badge: Engagement Chart */}
            <div className="absolute bottom-6 right-2 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-purple-100">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="text-[11px] font-bold text-slate-800">Engagement</span>
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="flex items-end gap-1.5 h-8">
                <span className="w-2 bg-indigo-200 rounded-t h-3" />
                <span className="w-2 bg-indigo-300 rounded-t h-4" />
                <span className="w-2 bg-indigo-400 rounded-t h-5" />
                <span className="w-2 bg-indigo-500 rounded-t h-7" />
                <span className="w-2 bg-indigo-600 rounded-t h-8" />
              </div>
            </div>

            {/* Character Illustration */}
            <div className="relative w-64 sm:w-72 aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-white/80 group">
              <img
                src="/assets/login_character.jpg"
                alt="SocialPulse Creator"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400 font-medium">
            AI-driven episodic intelligence for LinkedIn & Instagram
          </div>
        </div>

        {/* Right Form Card */}
        <div className="rounded-[2rem] bg-white p-6 sm:p-10 shadow-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Log in to your SocialPulse account and continue growing.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
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
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50/50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password row */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
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
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
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
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                  OR
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleSocialClick('Google')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-2.5 shadow-sm transition"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialClick('Microsoft')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-2.5 shadow-sm transition"
              >
                <MicrosoftIcon />
                <span>Continue with Microsoft</span>
              </button>
            </div>
          </div>

          {/* Footer toggle link */}
          <div className="text-center pt-6 text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-indigo-600 hover:underline">
              Sign up
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

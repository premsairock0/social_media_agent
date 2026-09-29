import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Zap, 
  BarChart3, 
  Target, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { SoundwaveIcon, GoogleIcon, MicrosoftIcon } from '../components/common/BrandLogo';
import ThemeToggle from '../components/common/ThemeToggle';
import PasswordValidator, { checkPasswordCriteria } from '../components/common/PasswordValidator';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const { isValid, errors } = checkPasswordCriteria(password, confirmPassword);
    if (!isValid) {
      setError(errors?.[0] || 'Password does not meet the security criteria.');
      return;
    }

    try {
      setSubmitting(true);
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialClick = (provider) => {
    setName(`${provider} Creator`);
    setEmail(`${provider.toLowerCase()}@kazam.ai`);
    setPassword('PulsePass2026!');
    setConfirmPassword('PulsePass2026!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans relative overflow-hidden transition-colors duration-200">
      {/* Top Right Theme Toggle */}
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle />
      </div>

      {/* Subtle ambient lighting */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-100/60 dark:bg-purple-900/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100/60 dark:bg-indigo-900/20 blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] bg-white dark:bg-[#121A2A] border border-slate-200 dark:border-indigo-500/25 shadow-xl dark:shadow-2xl overflow-hidden p-3 sm:p-4 gap-4 z-10 transition-colors">
        
        {/* Left Visual Column */}
        <div className="relative rounded-[1.75rem] bg-slate-50 dark:bg-[#0D1322] p-6 sm:p-8 flex flex-col justify-between overflow-hidden border border-slate-200/80 dark:border-indigo-500/20 transition-colors">
          
          {/* Header branding */}
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2.5">
              <SoundwaveIcon />
              <span className="font-extrabold text-2xl tracking-wider text-slate-900 dark:text-white">
                KAZAM
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium pl-1">
              Turn ideas into impact on LinkedIn and Instagram.
            </p>
          </div>

          {/* Floating UI Elements & Character Illustration */}
          <div className="relative my-3 flex items-center justify-center min-h-[290px] sm:min-h-[340px]">
            
            {/* Floating Badge: Post Ideas */}
            <div className="absolute top-1 left-2 z-20 bg-white dark:bg-[#172033] px-3.5 py-2.5 rounded-2xl shadow-md border border-slate-200 dark:border-indigo-500/30 min-w-[150px] transition-colors">
              <span className="text-[11px] font-bold text-slate-800 dark:text-white block mb-1.5">Post Ideas</span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="w-20 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>

            {/* Floating 3D LinkedIn Tile */}
            <div className="absolute top-2 right-24 z-20 w-10 h-10 rounded-2xl bg-[#0A66C2] text-white flex items-center justify-center font-bold text-base shadow-lg shadow-blue-500/25 rotate-[8deg] hover:rotate-0 transition-transform duration-300">
              in
            </div>

            {/* Floating 3D Instagram Tile */}
            <div className="absolute top-4 right-10 z-20 w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 rotate-[-6deg] hover:rotate-0 transition-transform duration-300">
              <div className="w-5 h-5 border-2 border-white rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 rounded-full border-2 border-white" />
              </div>
            </div>

            {/* Floating Badge: Audience Insights */}
            <div className="absolute bottom-5 right-2 z-20 bg-white dark:bg-[#172033] px-3.5 py-2.5 rounded-2xl shadow-md border border-slate-200 dark:border-indigo-500/30 transition-colors">
              <span className="text-[11px] font-bold text-slate-800 dark:text-white block mb-1">Audience Insights</span>
              <svg className="w-28 h-6 overflow-visible" viewBox="0 0 100 24">
                <path
                  d="M0 18 Q 20 2, 40 16 T 80 8 T 100 12"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Character Illustration */}
            <div className="relative w-64 sm:w-72 aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-indigo-500/20 group">
              <img
                src="/assets/signup_character.jpg"
                alt="Kazam Creator"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Bottom Pill Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 z-10">
            <div className="bg-white dark:bg-[#172033] rounded-xl py-2 px-1 text-center border border-slate-200 dark:border-indigo-500/20 shadow-sm flex flex-col items-center transition-colors">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">AI-Powered Content</span>
            </div>

            <div className="bg-white dark:bg-[#172033] rounded-xl py-2 px-1 text-center border border-slate-200 dark:border-indigo-500/20 shadow-sm flex flex-col items-center transition-colors">
              <div className="w-6 h-6 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-1">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">Audience Intelligence</span>
            </div>

            <div className="bg-white dark:bg-[#172033] rounded-xl py-2 px-1 text-center border border-slate-200 dark:border-indigo-500/20 shadow-sm flex flex-col items-center transition-colors">
              <div className="w-6 h-6 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1">
                <Target className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">Higher Engagement</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="rounded-[1.75rem] bg-white dark:bg-[#121A2A] p-6 sm:p-10 flex flex-col justify-between transition-colors">
          <div>
            <div className="mb-5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Create Your Account
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Start your journey with Kazam. It's free to get started.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-indigo-500/30 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-indigo-500/30 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              {/* Create Password */}
              <div className="space-y-1">
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-indigo-500/30 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
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

              {/* Confirm Password */}
              <div className="space-y-1">
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-indigo-500/30 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password strength & validation indicator */}
              <PasswordValidator password={password} confirmPassword={confirmPassword} />

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative my-4">
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
            <div className="space-y-2">
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
          <div className="text-center pt-4 text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Log in
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

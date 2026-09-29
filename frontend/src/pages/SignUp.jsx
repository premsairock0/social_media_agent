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
  Loader2,
  Sparkles
} from 'lucide-react';
import { SoundwaveIcon, GoogleIcon, MicrosoftIcon } from '../components/common/BrandLogo';
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
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialClick = (provider) => {
    setName(`${provider} Creator`);
    setEmail(`${provider.toLowerCase()}@socialpulse.ai`);
    setPassword('PulsePass2026!');
    setConfirmPassword('PulsePass2026!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] via-[#DDD6FE]/60 to-[#F5E8FF] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-300/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-300/30 blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/80 shadow-2xl overflow-hidden p-3 sm:p-4 gap-4 z-10">
        
        {/* Left Visual Column */}
        <div className="relative rounded-[2rem] bg-gradient-to-b from-indigo-50/70 via-purple-50/50 to-purple-100/60 p-6 sm:p-8 flex flex-col justify-between overflow-hidden border border-white/60">
          
          {/* Header branding */}
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2.5">
              <SoundwaveIcon />
              <span className="font-bold text-2xl tracking-tight text-slate-900">
                Social<span className="text-indigo-600">Pulse</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium pl-1">
              Turn ideas into impact on LinkedIn and Instagram.
            </p>
          </div>

          {/* Floating UI Elements & Character Illustration */}
          <div className="relative my-3 flex items-center justify-center min-h-[290px] sm:min-h-[340px]">
            
            {/* Floating Badge: Post Ideas */}
            <div className="absolute top-1 left-2 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-purple-100 min-w-[150px]">
              <span className="text-[11px] font-bold text-slate-800 block mb-1.5">Post Ideas</span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="w-20 h-1.5 rounded-full bg-slate-200" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="w-16 h-1.5 rounded-full bg-slate-200" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="w-24 h-1.5 rounded-full bg-slate-200" />
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
            <div className="absolute bottom-5 right-2 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-purple-100">
              <span className="text-[11px] font-bold text-slate-800 block mb-1">Audience Insights</span>
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
            <div className="relative w-64 sm:w-72 aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-white/80 group">
              <img
                src="/assets/signup_character.jpg"
                alt="SocialPulse Creator"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Bottom Pill Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 z-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl py-2 px-1 text-center border border-white/90 shadow-sm flex flex-col items-center">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">AI-Powered Content</span>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl py-2 px-1 text-center border border-white/90 shadow-sm flex flex-col items-center">
              <div className="w-6 h-6 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center mb-1">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">Audience Intelligence</span>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl py-2 px-1 text-center border border-white/90 shadow-sm flex flex-col items-center">
              <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
                <Target className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">Higher Engagement</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="rounded-[2rem] bg-white p-6 sm:p-10 shadow-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="mb-5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Create Your Account
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Start your journey with SocialPulse. It's free to get started.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
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
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
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
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
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
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                  OR
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="space-y-2">
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
          <div className="text-center pt-4 text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:underline">
              Log in
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

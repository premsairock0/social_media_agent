import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ShieldCheck 
} from 'lucide-react';
import { SoundwaveIcon } from '../components/common/BrandLogo';
import ThemeToggle from '../components/common/ThemeToggle';
import PasswordValidator, { checkPasswordCriteria } from '../components/common/PasswordValidator';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Verify Code & Reset, 3 = Success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { sendForgotPassword, submitResetPassword } = useAuth();
  const navigate = useNavigate();

  // Step 1: Send reset code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await sendForgotPassword(email.trim());
      setMessage(res.message || 'Verification code sent to your email.');
      if (res.resetCode) {
        setCode(res.resetCode); // Pre-fill in demo mode for instant testing convenience
      }
      setStep(2);
    } catch (err) {
      setError(err.message || 'Could not find an account with that email.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim() || !newPassword || !confirmPassword) {
      setError('Please fill in the verification code and new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const { isValid, errors } = checkPasswordCriteria(newPassword, confirmPassword);
    if (!isValid) {
      setError(errors?.[0] || 'Password does not meet security requirements.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitResetPassword({
        email: email.trim(),
        code: code.trim(),
        newPassword,
        confirmPassword,
      });
      setMessage(res.message || 'Password successfully updated.');
      setStep(3);
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code.');
    } finally {
      setSubmitting(false);
    }
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

      <div className="max-w-md w-full rounded-[2rem] bg-white dark:bg-[#121A2A] border border-slate-200 dark:border-indigo-500/25 shadow-xl dark:shadow-2xl p-6 sm:p-10 z-10 transition-colors">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <SoundwaveIcon />
            <span className="font-extrabold text-2xl tracking-wider text-slate-900 dark:text-white">
              KAZAM
            </span>
          </div>

          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Forgot Password?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enter your email address and we'll generate a verification code to reset your password.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Reset Password
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enter the verification code and choose a new password.
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Password Reset Complete
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Your password has been successfully updated. You can now log in.
              </p>
            </>
          )}
        </div>

        {/* Status Messages */}
        {message && step !== 3 && (
          <div className="mb-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Request Code Form */}
        {step === 1 && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-indigo-500/30 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending code...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: Verification Code & New Password Form */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Verification Code
              </label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-indigo-500/30 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition font-mono tracking-widest"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create new password"
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

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
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

            <PasswordValidator password={newPassword} confirmPassword={confirmPassword} />

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Email Step</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success Screen */}
        {step === 3 && (
          <div className="space-y-4 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

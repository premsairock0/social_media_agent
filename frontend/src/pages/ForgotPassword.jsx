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
    <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] via-[#DDD6FE]/60 to-[#F5E8FF] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-300/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-300/30 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-white/80 shadow-2xl p-6 sm:p-10 z-10">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <SoundwaveIcon />
            <span className="font-bold text-2xl tracking-tight text-slate-900">
              Social<span className="text-indigo-600">Pulse</span>
            </span>
          </div>

          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Forgot Password?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your email address and we'll generate a verification code to reset your password.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Set New Password
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter the verification code sent to <strong className="text-slate-800">{email}</strong>.
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Password Reset!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your password has been successfully updated. You can now log in with your new credentials.
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && step !== 3 && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Step 1: Request Code Form */}
        {step === 1 && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending code...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: Verification Code & New Password Form */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            {/* Verification code */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                6-Digit Verification Code
              </label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  required
                  className="w-full pl-10 pr-4 py-2.5 font-mono text-center tracking-widest text-base rounded-xl bg-slate-50/50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
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

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
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

            {/* Password strength validator */}
            <PasswordValidator password={newPassword} confirmPassword={confirmPassword} />

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
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
          </form>
        )}

        {/* Step 3: Success Screen */}
        {step === 3 && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2"
            >
              <span>Back to Log In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Back to Login link */}
        <div className="text-center pt-6 text-xs text-slate-500 border-t border-slate-100 mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Log In</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

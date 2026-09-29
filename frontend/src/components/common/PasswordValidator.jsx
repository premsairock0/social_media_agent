import React from 'react';
import { Check, X } from 'lucide-react';

export const checkPasswordCriteria = (password = '', confirmPassword = null) => {
  const minLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const matches = confirmPassword !== null ? password.length > 0 && password === confirmPassword : true;

  let score = 0;
  if (minLength) score++;
  if (hasUppercase) score++;
  if (hasLowercase) score++;
  if (hasNumberOrSymbol) score++;

  let strengthLabel = 'Too weak';
  let strengthColor = 'bg-rose-500';
  let strengthTextColor = 'text-rose-600';

  if (score === 2) {
    strengthLabel = 'Fair';
    strengthColor = 'bg-amber-500';
    strengthTextColor = 'text-amber-600';
  } else if (score === 3) {
    strengthLabel = 'Good';
    strengthColor = 'bg-blue-500';
    strengthTextColor = 'text-blue-600';
  } else if (score >= 4) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-500';
    strengthTextColor = 'text-emerald-600';
  }

  const isValid = minLength && hasUppercase && hasLowercase && hasNumberOrSymbol && matches;

  return {
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumberOrSymbol,
    matches,
    score,
    strengthLabel,
    strengthColor,
    strengthTextColor,
    isValid,
  };
};

export default function PasswordValidator({ password, confirmPassword = null, showDetails = true }) {
  if (!password && !confirmPassword) return null;

  const {
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumberOrSymbol,
    matches,
    score,
    strengthLabel,
    strengthColor,
    strengthTextColor,
  } = checkPasswordCriteria(password, confirmPassword);

  return (
    <div className="mt-2 space-y-2 text-xs">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Password strength:</span>
          <span className={`font-semibold ${strengthTextColor}`}>{strengthLabel}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[1px]">
          <div className={`h-full rounded-full transition-all duration-300 ${score >= 1 ? strengthColor : 'bg-slate-200'}`} />
          <div className={`h-full rounded-full transition-all duration-300 ${score >= 2 ? strengthColor : 'bg-slate-200'}`} />
          <div className={`h-full rounded-full transition-all duration-300 ${score >= 3 ? strengthColor : 'bg-slate-200'}`} />
          <div className={`h-full rounded-full transition-all duration-300 ${score >= 4 ? strengthColor : 'bg-slate-200'}`} />
        </div>
      </div>

      {/* Criteria check items */}
      {showDetails && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            {minLength ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
            )}
            <span className={minLength ? 'text-slate-700 font-medium' : ''}>At least 6 characters</span>
          </div>

          <div className="flex items-center gap-1.5">
            {hasUppercase ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
            )}
            <span className={hasUppercase ? 'text-slate-700 font-medium' : ''}>One uppercase (A-Z)</span>
          </div>

          <div className="flex items-center gap-1.5">
            {hasNumberOrSymbol ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
            )}
            <span className={hasNumberOrSymbol ? 'text-slate-700 font-medium' : ''}>Number or symbol</span>
          </div>

          {confirmPassword !== null && (
            <div className="flex items-center gap-1.5">
              {matches ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              )}
              <span className={matches ? 'text-slate-700 font-medium' : 'text-rose-500'}>
                Passwords match
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

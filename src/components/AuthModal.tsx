import React, { useState } from 'react';
import { safeSignIn, safeSignUp, safeUpdateProfile } from '../firebase';
import { Disc, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        const userCredential = await safeSignUp(email, password);
        if (name && userCredential.user) {
          await safeUpdateProfile(name);
        }
        onSuccess(userCredential.user);
      } else {
        const userCredential = await safeSignIn(email, password);
        onSuccess(userCredential.user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="auth-modal-overlay">
      <div className="relative w-full max-w-md overflow-hidden bg-[#181818] rounded-2xl border border-[#282828] shadow-2xl flex flex-col" id="auth-modal-container">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#E8B54D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="p-6 flex flex-col gap-6" id="auth-modal-content">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Disc className="w-8 h-8 text-[#E8B54D] animate-spin-slow" />
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">Symphony</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#242424] text-gray-400 hover:text-white transition-colors"
              id="close-auth-modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight" id="auth-modal-title">
              {mode === 'login' ? 'Welcome Back' : 'Join Symphony'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {mode === 'login' ? 'Access your personalized playlists and settings' : 'Get started with a free account'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center font-medium" id="auth-error-box">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-[#282828]" id="auth-modal-tabs">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${
                mode === 'login' 
                  ? 'border-[#E8B54D] text-[#E8B54D]' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              id="tab-login"
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${
                mode === 'signup' 
                  ? 'border-[#E8B54D] text-[#E8B54D]' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              id="tab-signup"
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" id="auth-form">
            {mode === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#242424] border border-[#282828] text-white text-sm rounded-lg focus:outline-none focus:border-[#E8B54D] transition-colors"
                  id="input-name"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#242424] border border-[#282828] text-white text-sm rounded-lg focus:outline-none focus:border-[#E8B54D] transition-colors"
                id="input-email"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#242424] border border-[#282828] text-white text-sm rounded-lg focus:outline-none focus:border-[#E8B54D] transition-colors"
                id="input-password"
                required
              />
            </div>

            {mode === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#242424] border border-[#282828] text-white text-sm rounded-lg focus:outline-none focus:border-[#E8B54D] transition-colors"
                  id="input-confirm-password"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#E8B54D] hover:bg-[#f0c568] disabled:bg-gray-600 text-[#121212] font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
              id="submit-auth-btn"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle link */}
          <div className="text-center text-xs text-gray-400">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-[#E8B54D] hover:underline font-semibold">
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-[#E8B54D] hover:underline font-semibold">
                  Log In
                </button>
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

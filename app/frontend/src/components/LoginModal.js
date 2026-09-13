import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Heart, X, KeyRound, UserPlus, LogOut, Sparkles } from 'lucide-react';
import { loginUser, registerUser, clearAuthToken } from '../services/api';

export default function LoginModal({ open, onClose, user, onLoginSuccess, onLogout }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('love');
  const [password, setPassword] = useState('');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setPassword('');
    setError(null);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        const loggedUser = await loginUser(username, password);
        onLoginSuccess(loggedUser);
        resetForm();
        onClose();
      } else {
        if (!senderName.trim() || !recipientName.trim()) {
          throw new Error("Please enter both your name and your partner's name.");
        }
        const newUser = await registerUser({
          username,
          password,
          senderName: senderName.trim(),
          recipientName: recipientName.trim(),
        });
        onLoginSuccess(newUser);
        resetForm();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    onLogout();
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        data-testid="login-modal-overlay"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-plum/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-md w-full bg-[#fffcf9] rounded-[2rem] p-7 sm:p-8 border border-deeprose/20 shadow-[0_25px_60px_-15px_rgba(92,42,59,0.35)] text-left my-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-plum/50 hover:text-deeprose transition-colors p-1"
          >
            <X size={20} />
          </button>

          {user ? (
            /* Logged In View */
            <div className="text-center py-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-deeprose text-cream flex items-center justify-center shadow-[0_8px_20px_rgba(214,51,108,0.4)] mb-4">
                <Heart size={24} fill="currentColor" strokeWidth={0} />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold block mb-1">
                Active Love Portal
              </span>
              <h3 className="font-serif font-bold text-2xl text-plum mb-2">
                Welcome back, {user.senderName || user.username}!
              </h3>
              <p className="text-xs text-plum/70 mb-6">
                You are logged in. You can upload photos to your personal Cloudinary cloud, delete old photos, and generate your custom QR code for{' '}
                <strong className="text-deeprose">{user.recipientName || 'your partner'}</strong>.
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 rounded-full border border-deeprose/30 bg-white py-3 text-xs font-mono tracking-widest text-deeprose hover:bg-blush transition-colors"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            /* Login / Register Forms */
            <div>
              {/* Tab Switcher */}
              <div className="flex gap-2 p-1 bg-blush/40 rounded-full mb-6 border border-rose/15">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setError(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                    tab === 'login'
                      ? 'bg-deeprose text-cream shadow-sm font-semibold'
                      : 'text-plum/70 hover:text-deeprose'
                  }`}
                >
                  <KeyRound size={13} />
                  <span>Log In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setError(null);
                    if (username === 'love') setUsername('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                    tab === 'register'
                      ? 'bg-deeprose text-cream shadow-sm font-semibold'
                      : 'text-plum/70 hover:text-deeprose'
                  }`}
                >
                  <UserPlus size={13} />
                  <span>Create Account</span>
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-plum">
                  {tab === 'login' ? "Lover's Secret Key" : "Create Your Love Site"}
                </h3>
                <p className="text-xs sm:text-sm text-plum/70 mt-1">
                  {tab === 'login'
                    ? "Log in to view and manage your uploaded memories."
                    : "Create your personal account to upload photos & build your couple QR code."}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {tab === 'register' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-mono text-plum/70 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Aman"
                        className="w-full rounded-xl border border-deeprose/25 bg-white px-3 py-2 text-xs font-mono text-plum placeholder:text-plum/40 focus:border-deeprose focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-mono text-plum/70 mb-1">
                        Her Name (Partner)
                      </label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="e.g. Juliet"
                        className="w-full rounded-xl border border-deeprose/25 bg-white px-3 py-2 text-xs font-mono text-plum placeholder:text-plum/40 focus:border-deeprose focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-mono text-plum/70 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. aman"
                    className="w-full rounded-xl border border-deeprose/25 bg-white px-3.5 py-2 text-xs font-mono text-plum placeholder:text-plum/40 focus:border-deeprose focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-mono text-plum/70 mb-1">
                    Passcode / Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-deeprose/25 bg-white px-3.5 py-2 text-xs font-mono text-plum placeholder:text-plum/40 focus:border-deeprose focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-full bg-deeprose py-3 text-xs font-mono uppercase tracking-widest text-cream shadow-[0_8px_20px_-4px_rgba(214,51,108,0.4)] hover:bg-[#b82357] transition-all disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  <span>
                    {loading
                      ? 'Processing...'
                      : tab === 'login'
                      ? 'Unlock Portal'
                      : 'Create My Site'}
                  </span>
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import React, { useEffect, useState } from 'react';
import { Rocket, History, LogIn, User, Shield } from 'lucide-react';

export default function Navbar() {
  const [openAuth, setOpenAuth] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('mvai_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mvai_user');
    setUser(null);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-fuchsia-500/20 border border-white/10">
              <Rocket className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Marine Vision AI</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#analyze" className="hover:text-white transition">Analyze</a>
            <a href="#history" className="hover:text-white transition flex items-center gap-2">
              <History className="w-4 h-4" /> History
            </a>
            <a href="#security" className="hover:text-white transition flex items-center gap-2">
              <Shield className="w-4 h-4" /> Security
            </a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <User className="w-4 h-4 text-cyan-300" />
                  <span className="text-sm text-white/80">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setOpenAuth(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:opacity-90 transition text-sm font-medium"
              >
                <LogIn className="w-4 h-4" /> Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      {openAuth && (
        <AuthModal onClose={() => setOpenAuth(false)} onSignedIn={setUser} />)
      }
    </>
  );
}

function AuthModal({ onClose, onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    const user = { email };
    localStorage.setItem('mvai_user', JSON.stringify(user));
    onSignedIn(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl">
        <h3 className="text-lg font-semibold mb-1">Welcome back</h3>
        <p className="text-sm text-white/60 mb-5">Sign in to sync your analysis history across devices.</p>
        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/60 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:opacity-90 font-medium"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

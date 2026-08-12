import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Terminal, AlertTriangle, Key, Mail } from 'lucide-react';

export const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Error: All credentials are required to authenticate.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error.message || 'Authentication failed. Please check your credentials.');
        setIsSubmitting(false);
      } else {
        navigate('/welcome');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred during terminal access.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070c] flex items-center justify-center p-4 relative overflow-hidden font-tech">
      {/* Background Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-[#00ff88]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-[#0d0d14] border-2 border-[#00ff88]/60 p-6 sm:p-8 rounded-xl shadow-[0_0_30px_rgba(0,255,136,0.15)] relative z-10 space-y-6">
        {/* Terminal Header */}
        <div className="border-b border-[#2a2a3a] pb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#00ff88]/10 border border-[#00ff88] flex items-center justify-center rounded clip-chamfer">
              <Terminal className="w-5 h-5 text-[#00ff88]" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-black tracking-widest text-white">ARENA</h1>
              <p className="text-[11px] text-[#00d4ff] font-mono tracking-wider">SECURE ACCESS TERMINAL v4.2</p>
            </div>
          </div>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff88]"></span>
          </span>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 p-3 rounded text-xs text-red-400 flex items-start gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#00ff88] block uppercase tracking-wider">
              &gt; USER ID (EMAIL)
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@arena.com"
                required
                className="w-full bg-[#12121e] border border-[#2a2a3a] focus:border-[#00ff88] text-white px-4 py-2.5 pl-10 text-xs rounded transition-all outline-none font-mono placeholder:text-[#4b5563]"
              />
              <Mail className="w-4 h-4 text-[#8e8ea0] absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#00ff88] block uppercase tracking-wider">
              &gt; PASSWORD
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#12121e] border border-[#2a2a3a] focus:border-[#00ff88] text-white px-4 py-2.5 pl-10 text-xs rounded transition-all outline-none font-mono placeholder:text-[#4b5563]"
              />
              <Key className="w-4 h-4 text-[#8e8ea0] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#00ff88] hover:bg-[#00cc6d] text-black font-heading font-black tracking-widest text-xs uppercase rounded transition-all shadow-lg shadow-[#00ff88]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            {isSubmitting ? 'AUTHENTICATING...' : '[ AUTHENTICATE ]'}
          </button>
        </form>

        <div className="pt-4 border-t border-[#1e1e2d] flex items-center justify-between text-xs font-mono">
          <Link to="/signup" className="text-[#00d4ff] hover:text-white transition-colors underline">
            CREATE ACCOUNT
          </Link>
          <Link to="/forgot-password" className="text-[#8e8ea0] hover:text-white transition-colors">
            FORGOT PASSWORD
          </Link>
        </div>
      </div>
    </div>
  );
};

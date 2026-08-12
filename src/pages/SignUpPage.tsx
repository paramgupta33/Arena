import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Key, AlertTriangle, ShieldCheck, Coins } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg('Error: All registration fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Error: Invalid email address format.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Error: Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Error: Password and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setErrorMsg(error.message || 'Registration failed. Please try again.');
        setIsSubmitting(false);
      } else {
        navigate('/welcome');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An error occurred during account creation.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070c] flex items-center justify-center p-4 relative overflow-hidden font-tech">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-[#00d4ff]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-[#0d0d14] border-2 border-[#00d4ff]/60 p-6 sm:p-8 rounded-xl shadow-[0_0_30px_rgba(0,212,255,0.15)] relative z-10 space-y-5">
        <div className="border-b border-[#2a2a3a] pb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#00d4ff]/10 border border-[#00d4ff] flex items-center justify-center rounded clip-chamfer">
              <UserPlus className="w-5 h-5 text-[#00d4ff]" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-black tracking-widest text-white">ARENA</h1>
              <p className="text-[11px] text-[#00d4ff] font-mono tracking-wider">MEMBER REGISTRATION TERMINAL</p>
            </div>
          </div>
        </div>

        {/* Bonus SCRAP Banner */}
        <div className="bg-[#00ff88]/10 border border-[#00ff88]/40 p-2.5 rounded text-xs text-[#00ff88] flex items-center gap-2 font-mono">
          <Coins className="w-4 h-4 shrink-0 text-[#00ff88]" />
          <span>New Members receive <strong>1,000 SCRAP</strong> welcome balance!</span>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 p-3 rounded text-xs text-red-400 flex items-start gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-mono text-[#00d4ff] block uppercase tracking-wider">
              &gt; FULL NAME
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Mercer"
                required
                className="w-full bg-[#12121e] border border-[#2a2a3a] focus:border-[#00d4ff] text-white px-4 py-2.5 pl-10 text-xs rounded transition-all outline-none font-mono placeholder:text-[#4b5563]"
              />
              <User className="w-4 h-4 text-[#8e8ea0] absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[#00d4ff] block uppercase tracking-wider">
              &gt; EMAIL ADDRESS
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@arena.com"
                required
                className="w-full bg-[#12121e] border border-[#2a2a3a] focus:border-[#00d4ff] text-white px-4 py-2.5 pl-10 text-xs rounded transition-all outline-none font-mono placeholder:text-[#4b5563]"
              />
              <Mail className="w-4 h-4 text-[#8e8ea0] absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[#00d4ff] block uppercase tracking-wider">
              &gt; PASSWORD (MIN 8 CHARS)
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full bg-[#12121e] border border-[#2a2a3a] focus:border-[#00d4ff] text-white px-4 py-2.5 pl-10 text-xs rounded transition-all outline-none font-mono placeholder:text-[#4b5563]"
              />
              <Key className="w-4 h-4 text-[#8e8ea0] absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[#00d4ff] block uppercase tracking-wider">
              &gt; CONFIRM PASSWORD
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#12121e] border border-[#2a2a3a] focus:border-[#00d4ff] text-white px-4 py-2.5 pl-10 text-xs rounded transition-all outline-none font-mono placeholder:text-[#4b5563]"
              />
              <Key className="w-4 h-4 text-[#8e8ea0] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#00d4ff] hover:bg-[#00b0d4] text-black font-heading font-black tracking-widest text-xs uppercase rounded transition-all shadow-lg shadow-[#00d4ff]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {isSubmitting ? 'CREATING PROFILE...' : '[ REGISTER ACCOUNT ]'}
          </button>
        </form>

        <div className="pt-3 border-t border-[#1e1e2d] text-center text-xs font-mono">
          <span className="text-[#8e8ea0]">Already registered? </span>
          <Link to="/signin" className="text-[#00ff88] hover:underline font-bold">
            SIGN IN TO TERMINAL
          </Link>
        </div>
      </div>
    </div>
  );
};

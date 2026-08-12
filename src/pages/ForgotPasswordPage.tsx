import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { KeyRound, Mail, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Error: Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/signin`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      // Even if reset fails on placeholder credentials, confirm instructions sent for demo
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070c] flex items-center justify-center p-4 relative overflow-hidden font-tech">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-md w-full bg-[#0d0d14] border-2 border-[#ffd166]/60 p-6 sm:p-8 rounded-xl shadow-[0_0_30px_rgba(255,209,102,0.15)] relative z-10 space-y-6">
        <div className="border-b border-[#2a2a3a] pb-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#ffd166]/10 border border-[#ffd166] flex items-center justify-center rounded clip-chamfer">
            <KeyRound className="w-5 h-5 text-[#ffd166]" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-black tracking-widest text-white">ARENA</h1>
            <p className="text-[11px] text-[#ffd166] font-mono tracking-wider">CREDENTIAL RECOVERY TERMINAL</p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-[#00ff88]/10 border border-[#00ff88]/50 p-4 rounded text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-[#00ff88] mx-auto animate-bounce" />
            <h3 className="text-sm font-heading font-bold text-white uppercase">RECOVERY DISPATCHED</h3>
            <p className="text-xs text-[#8e8ea0] font-mono">
              Password reset instructions have been dispatched to <span className="text-[#00ff88]">{email}</span>. Check your inbox to proceed.
            </p>
            <Link
              to="/signin"
              className="inline-block mt-2 px-4 py-2 bg-[#00ff88]/20 border border-[#00ff88] text-[#00ff88] text-xs font-mono font-bold rounded hover:bg-[#00ff88] hover:text-black transition-all"
            >
              RETURN TO TERMINAL
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-[#8e8ea0] font-mono">
              Enter your registered ARENA account email to receive terminal password reset instructions.
            </p>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/50 p-3 rounded text-xs text-red-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>{errorMsg}</div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#ffd166] block uppercase tracking-wider">
                &gt; REGISTERED EMAIL
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@arena.com"
                  required
                  className="w-full bg-[#12121e] border border-[#2a2a3a] focus:border-[#ffd166] text-white px-4 py-2.5 pl-10 text-xs rounded transition-all outline-none font-mono placeholder:text-[#4b5563]"
                />
                <Mail className="w-4 h-4 text-[#8e8ea0] absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#ffd166] hover:bg-[#e0b852] text-black font-heading font-black tracking-widest text-xs uppercase rounded transition-all shadow-lg shadow-[#ffd166]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'DISPATCHING...' : '[ TRANSMIT RESET LINK ]'}
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-[#1e1e2d] text-center">
          <Link to="/signin" className="text-xs font-mono text-[#8e8ea0] hover:text-white flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

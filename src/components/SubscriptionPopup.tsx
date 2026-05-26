import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SubscriptionPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [systemEmail, setSystemEmail] = useState('techhub905@gmail.com');

  useEffect(() => {
    api.get('/public/settings').then(res => {
      if (res.data?.systemEmail) {
        setSystemEmail(res.data.systemEmail);
      }
    }).catch(console.error);

    const hasSubscribed = localStorage.getItem('hasSubscribed');
    if (!hasSubscribed) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-subscription-popup', handleOpen);
    return () => window.removeEventListener('open-subscription-popup', handleOpen);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/public/subscribe', { email });
      setStatus('success');
      localStorage.setItem('hasSubscribed', 'true');
      setTimeout(() => setIsOpen(false), 2000);
    } catch (err) {
      setStatus('error');
    }
  };

  const close = () => {
    setIsOpen(false);
    localStorage.setItem('hasSubscribed', 'true'); // don't bug them again
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 max-w-md w-full relative overflow-hidden shadow-2xl border border-white/60 box-border"
          >
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <button onClick={close} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors bg-white/50 hover:bg-white/80 p-2.5 rounded-full z-10 backdrop-blur-sm shadow-sm">
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-500/30 transform -rotate-6 relative z-10">
              <Mail className="w-10 h-10 text-white transform rotate-6" />
            </div>
            
            <h3 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-600 mb-3 relative z-10 tracking-tight">Stay Updated</h3>
            <p className="text-slate-500 text-center mb-8 text-[15px] leading-relaxed max-w-[260px] mx-auto relative z-10">
              Subscribe to receive the latest fully funded scholarships directly to your inbox.
            </p>
            
            {status === 'success' ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 p-5 rounded-2xl text-center font-medium text-sm relative z-10 backdrop-blur-sm shadow-inner">
                <span className="block font-bold mb-2 text-emerald-800 text-base">🎉 Thanks for subscribing!</span>
                All new scholarships will be forwarded to you from <br/><strong className="text-emerald-900 mt-2 inline-block bg-emerald-500/10 px-3 py-1 rounded-lg">{systemEmail}</strong>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4 relative z-10">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-2xl focus:ring-4 focus:ring-blue-600/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400 text-slate-800 shadow-sm font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : null}
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
                </button>
                {status === 'error' && (
                  <p className="text-rose-500 text-sm font-bold text-center bg-rose-50 p-2 rounded-xl border border-rose-100">Something went wrong or already subscribed.</p>
                )}
              </form>
            )}
            
            <p className="text-center text-xs text-slate-400 mt-6 relative z-10">
              We respect your privacy. No spam ever.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

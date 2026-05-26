import React, { useState } from 'react';
import api from '../api';
import { Mail, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/public/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
      <div className="max-w-[768px] mx-auto bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-none">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl mb-6 shadow-sm border border-blue-100">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">Get in Touch</h1>
          <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
            Have questions about a scholarship or need help applying? Send us a message and our team will get back to you.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-emerald-50 text-emerald-800 p-8 rounded-2xl text-center border border-emerald-100">
            <div className="text-emerald-600 font-bold text-xl mb-2">Message Sent!</div>
            <p className="text-sm">Thank you for reaching out. We will respond shortly.</p>
            <button onClick={() => setStatus('idle')} className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors">Send another message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-800 placeholder-slate-400"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-800 placeholder-slate-400"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Your Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-blue-600 outline-none transition-all resize-none text-slate-800 placeholder-slate-400"
                placeholder="How can we help you today?"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center text-sm"
            >
              {status === 'loading' ? 'Sending...' : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
            </button>
            {status === 'error' && (
              <p className="text-rose-500 text-sm text-center font-bold mt-4">Could not send your message. Please try again.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

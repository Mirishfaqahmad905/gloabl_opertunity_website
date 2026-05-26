import { useState, useEffect } from 'react';
import api from '../api';
import { Settings } from '../types';
import { FileText, CheckCircle, Clock, ShieldCheck, MessageCircle, Github, Linkedin, Instagram, Youtube, Facebook, Globe } from 'lucide-react';
import AdBanner from '../components/AdBanner';

export default function HelpPage() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    api.get('/public/settings').then(res => {
      if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
        setSettings(res.data);
      }
    }).catch(console.error);
    window.scrollTo(0, 0);
  }, []);

  const handleWhatsAppClick = () => {
    if (settings?.socialLinks?.whatsapp) {
      window.open(settings.socialLinks.whatsapp, '_blank');
    } else {
      window.open('https://wa.me/923463079238', '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <AdBanner placement="between_content" />
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mt-8 mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-6 leading-tight">
          {settings?.helpPage?.title || 'How We Can Help You'}
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
          {settings?.helpPage?.description || 'We can prepare your documents here and apply for this scholarship for an affordable price.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12 mb-12 text-left">
          <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 items-start">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><FileText className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">Document Preparation</h3>
              <p className="text-slate-500 text-sm leading-relaxed">We'll help you prepare customized Motivation Letters, CVs, and Study Plans that stand out to admission committees.</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 items-start">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><CheckCircle className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">Application Submission</h3>
              <p className="text-slate-500 text-sm leading-relaxed">We manage the full application process, ensuring no deadlines are missed and every detail is correct.</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 items-start">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">Expert Review</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Our experts will review your entire profile and documentation before making any submissions.</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 items-start">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><Clock className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">Fast Turnaround</h3>
              <p className="text-slate-500 text-sm leading-relaxed">We know deadlines are strict. We guarantee timely delivery and prompt updates on your application status.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleWhatsAppClick}
          className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <MessageCircle className="w-6 h-6" />
          Apply Through Us on WhatsApp
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Follow Our Pages</h2>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto">Stay updated with the latest scholarship announcements, tips, and direct guidance on our social channels.</p>
        
        <div className="flex flex-wrap justify-center gap-4 items-center">
          {settings?.socialLinks?.linkedin && (
            <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-md">
              <Linkedin className="w-6 h-6" />
            </a>
          )}
          {settings?.socialLinks?.youtube && (
            <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-md">
              <Youtube className="w-6 h-6" />
            </a>
          )}
          {settings?.socialLinks?.instagram && (
            <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all shadow-sm hover:shadow-md">
              <Instagram className="w-6 h-6" />
            </a>
          )}
          {settings?.socialLinks?.facebook && (
            <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-md">
              <Facebook className="w-6 h-6" />
            </a>
          )}
          {settings?.socialLinks?.github && (
            <a href={settings.socialLinks.github} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all shadow-sm hover:shadow-md">
              <Github className="w-6 h-6" />
            </a>
          )}
          {settings?.socialLinks?.portfolio && (
            <a href={settings.socialLinks.portfolio} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm hover:shadow-md">
              <Globe className="w-6 h-6" />
            </a>
          )}
        </div>
      </div>
      <div className="mt-12"><AdBanner placement="footer" /></div>
    </div>
  );
}

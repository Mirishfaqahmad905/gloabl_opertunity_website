import { useState, useEffect } from 'react';
import api from '../api';
import { Settings } from '../types';
import AdBanner from './AdBanner';
import { Github, Linkedin, Instagram, Youtube, Facebook, Mail, Phone, MapPin, Globe, Bell } from 'lucide-react';

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    api.get('/public/settings').then(res => {
      if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) setSettings(res.data);
    }).catch(console.error);
  }, []);

  return (
    <div className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-300">
      <AdBanner placement="footer" />
      <footer className="max-w-[1024px] mx-auto px-6 py-16 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="flex flex-col gap-6 max-w-sm">
          <div>
            <span className="font-bold text-white text-2xl tracking-tight">{settings?.siteName || 'GlobalOpportunity'}</span>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Find fully funded scholarships and study opportunities worldwide. Your gateway to global education.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <a href={settings?.socialLinks?.whatsapp || 'https://wa.me/923463079238'} target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm text-center flex-1">
              Apply Through Us (WhatsApp)
            </a>
            <button onClick={() => window.dispatchEvent(new Event('open-subscription-popup'))} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/25 text-center flex-1 flex items-center justify-center gap-2">
              <Bell className="w-4 h-4 animate-bounce" />
              Scholarship Alerts
            </button>
          </div>
          <div className="flex flex-col gap-4 text-sm mt-2">
             {settings?.address && (
               <span className="flex gap-3 items-start"><MapPin className="w-5 h-5 shrink-0 text-blue-400"/> <span>{settings.address}</span></span>
             )}
             {settings?.phone && (
               <span className="flex gap-3 items-center"><Phone className="w-5 h-5 shrink-0 text-blue-400"/> <span>{settings.phone}</span></span>
             )}
             {settings?.email && (
               <a href={`mailto:${settings.email}`} className="flex gap-3 items-center hover:text-white transition-colors"><Mail className="w-5 h-5 shrink-0 text-blue-400"/> <span>{settings.email}</span></a>
             )}
          </div>
        </div>
        
        <div className="flex gap-16 md:gap-24">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-white text-sm uppercase tracking-wider">Quick Links</span>
            <div className="flex flex-col gap-3 text-sm">
              <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
              <a href="/countries" className="hover:text-blue-400 transition-colors">Browse Countries</a>
              <a href="/scholarships" className="hover:text-blue-400 transition-colors">All Scholarships</a>
              <a href="/blogs" className="hover:text-blue-400 transition-colors">Latest Blogs</a>
              <a href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</a>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <span className="font-bold text-white text-sm uppercase tracking-wider">Follow Us</span>
            <div className="flex gap-4 items-center mt-2">
              {settings?.socialLinks?.linkedin && <a href={settings.socialLinks.linkedin} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors" title="LinkedIn"><Linkedin className="w-5 h-5"/></a>}
              {settings?.socialLinks?.github && <a href={settings.socialLinks.github} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors" title="GitHub"><Github className="w-5 h-5"/></a>}
              {settings?.socialLinks?.youtube && <a href={settings.socialLinks.youtube} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors" title="YouTube"><Youtube className="w-5 h-5"/></a>}
              {settings?.socialLinks?.instagram && <a href={settings.socialLinks.instagram} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors" title="Instagram"><Instagram className="w-5 h-5"/></a>}
              {settings?.socialLinks?.facebook && <a href={settings.socialLinks.facebook} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors" title="Facebook"><Facebook className="w-5 h-5"/></a>}
              {settings?.socialLinks?.portfolio && <a href={settings.socialLinks.portfolio} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors" title="Portfolio"><Globe className="w-5 h-5"/></a>}
            </div>
          </div>
        </div>
      </footer>
      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-slate-950">
        &copy; {new Date().getFullYear()} {settings?.siteName || 'GlobalOpportunity'} Scholarship Platform. Built by <a href="https://geekyskill.netlify.app" className="text-slate-400 hover:text-white font-medium">Mir Ishfaq Ahmad</a>
      </div>
    </div>
  );
}

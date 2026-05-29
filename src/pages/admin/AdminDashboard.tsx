import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import { Settings, LogOut, FileText, Globe, Image, Users, Home, Youtube, Briefcase } from 'lucide-react';
import CrudView from './CrudView';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scholarships');
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const tabs = [
    { id: 'scholarships', label: 'Scholarships', icon: <FileText className="w-5 h-5 mr-2" /> },
    { id: 'blogs', label: 'Blogs', icon: <FileText className="w-5 h-5 mr-2" /> },
    { id: 'countries', label: 'Countries', icon: <Globe className="w-5 h-5 mr-2" /> },
    { id: 'services', label: 'Services', icon: <Briefcase className="w-5 h-5 mr-2" /> },
    { id: 'videos', label: 'Videos', icon: <Youtube className="w-5 h-5 mr-2" /> },
    { id: 'ads', label: 'Ads', icon: <Image className="w-5 h-5 mr-2" /> },
    { id: 'carousels', label: 'Carousels', icon: <Image className="w-5 h-5 mr-2" /> },
    { id: 'messages', label: 'Messages', icon: <Users className="w-5 h-5 mr-2" /> },
    { id: 'subscribers', label: 'Subscribers', icon: <Users className="w-5 h-5 mr-2" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
          <Link to="/" className="text-slate-400 hover:text-blue-600" title="Go to Website"><Home className="w-5 h-5"/></Link>
        </div>
        <nav className="p-4 flex md:block overflow-x-auto gap-2 md:space-y-1 no-scrollbar md:pb-4 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 md:w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
                activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          <button
            onClick={logout}
            className="flex-shrink-0 md:w-full flex items-center px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl md:mt-8 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto w-full max-w-full">
        {activeTab === 'settings' ? <SettingsManager /> : <CrudView model={activeTab} />}
      </div>
    </div>
  );
}

function SettingsManager() {
  const [settings, setSettings] = useState<any>({ siteName: '', logo: '', socialLinks: {} });
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/admin/settings').then(res => {
      if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
        setSettings(res.data || { socialLinks: {} });
      }
    }).catch(err => {
      if (err.response?.status !== 401) {
        console.error(err);
      }
    });
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', settings);
      setStatus('Settings saved!');
      setTimeout(() => setStatus(''), 3000);
    } catch {
      setStatus('Error saving');
    }
  };

  const updatePassword = async () => {
    try {
      await api.post('/admin/password', { newPassword: password });
      setStatus('Password updated!');
      setPassword('');
      setTimeout(() => setStatus(''), 3000);
    } catch {
      setStatus('Error updating password');
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Platform Settings</h2>
      {status && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">{status}</div>}
      
      <form onSubmit={saveSettings} className="space-y-4 mb-10">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Site Name</label>
          <input type="text" value={settings.siteName || ''} onChange={e => setSettings({...settings, siteName: e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Logo URL or Upload Image</label>
          <input type="text" value={settings.logo || ''} onChange={e => setSettings({...settings, logo: e.target.value})} placeholder="https://... or upload below" className="mt-1 w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2" />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {settings.logo && <img src={settings.logo} alt="Logo Preview" className="mt-4 w-16 h-16 object-contain border border-slate-200 rounded-md" />}
        </div>
        <h3 className="font-bold text-slate-800 pt-4 border-t border-slate-100">Contact Information</h3>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
          <input type="email" value={settings.email || ''} onChange={e => setSettings({...settings, email: e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Phone Number</label>
          <input type="text" value={settings.phone || ''} onChange={e => setSettings({...settings, phone: e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Physical Address</label>
          <textarea value={settings.address || ''} onChange={e => setSettings({...settings, address: e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600" rows={2}></textarea>
        </div>
        <h3 className="font-bold text-slate-800 pt-4 border-t border-slate-100">Social Links</h3>
        {['linkedin', 'github', 'instagram', 'youtube', 'facebook', 'portfolio', 'whatsapp'].map(social => (
          <div key={social}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{social} URL</label>
            <input type="text" value={settings.socialLinks?.[social as keyof typeof settings.socialLinks] || ''} onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, [social]: e.target.value}})} className="mt-1 w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
        ))}

        <h3 className="font-bold text-slate-800 pt-4 border-t border-slate-100">Help Page Content</h3>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Help Title</label>
          <input type="text" value={settings.helpPage?.title || ''} onChange={e => setSettings({...settings, helpPage: {...settings.helpPage, title: e.target.value}})} className="mt-1 w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Help Description</label>
          <textarea value={settings.helpPage?.description || ''} onChange={e => setSettings({...settings, helpPage: {...settings.helpPage, description: e.target.value}})} className="mt-1 w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600" rows={3}></textarea>
        </div>

        <h3 className="font-bold text-slate-800 pt-4 border-t border-slate-100">System Notification Email</h3>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">System Email</label>
          <input type="email" value={settings.systemEmail || ''} onChange={e => setSettings({...settings, systemEmail: e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600" />
          <p className="text-xs text-slate-400 mt-1">This email acts as the sender/system email for new scholarship alerts.</p>
        </div>

        <h3 className="font-bold text-slate-800 pt-4 border-t border-slate-100">SEO Settings</h3>
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Meta Title</label>
            <span className={`text-xs ${
              (settings.seo?.title?.length || 0) > 60 ? 'text-red-500 font-bold' : 
              (settings.seo?.title?.length || 0) >= 40 ? 'text-green-600 font-bold' : 'text-slate-400'
            }`}>
              {(settings.seo?.title?.length || 0)}/60 characters (Optimal: 50-60)
            </span>
          </div>
          <input type="text" value={settings.seo?.title || ''} onChange={e => setSettings({...settings, seo: {...settings.seo, title: e.target.value}})} className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="e.g. GlobalOpportunity - World's Best Scholarship Portal" />
        </div>
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Meta Description</label>
            <span className={`text-xs ${
              (settings.seo?.description?.length || 0) > 160 ? 'text-red-500 font-bold' : 
              (settings.seo?.description?.length || 0) >= 140 ? 'text-green-600 font-bold' : 'text-slate-400'
            }`}>
              {(settings.seo?.description?.length || 0)}/160 characters (Optimal: 150-160)
            </span>
          </div>
          <textarea value={settings.seo?.description || ''} onChange={e => setSettings({...settings, seo: {...settings.seo, description: e.target.value}})} className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600" rows={2} placeholder="Briefly describe your site for search engines."></textarea>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 mt-1">Keywords (Comma separated)</label>
          <textarea value={settings.seo?.keywords || ''} onChange={e => setSettings({...settings, seo: {...settings.seo, keywords: e.target.value}})} className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600" rows={2} placeholder="scholarship, university, study abroad"></textarea>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-4">Save Settings</button>
      </form>

      <h2 className="text-xl font-bold mb-4 text-slate-800 border-t border-slate-100 pt-8">Change Admin Password</h2>
      <div className="flex gap-4">
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password" className="border border-slate-200 rounded-xl p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-600 block w-full" />
        <button onClick={updatePassword} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">Update Password</button>
      </div>
    </div>
  );
}

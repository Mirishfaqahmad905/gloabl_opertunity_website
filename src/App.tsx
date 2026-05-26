/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import api from './api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CountryPage from './pages/CountryPage';
import CountriesPage from './pages/CountriesPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import ScholarshipDetail from './pages/ScholarshipDetail';
import BlogsPage from './pages/BlogsPage';
import BlogDetail from './pages/BlogDetail';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import VideosPage from './pages/VideosPage';
import ServicesPage from './pages/ServicesPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import SubscriptionPopup from './components/SubscriptionPopup';

import AdBanner from './components/AdBanner';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <AdBanner placement="over_navbar" />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <SubscriptionPopup />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', window.location.href);

    api.get('/public/settings').then(res => {
      const data = res.data;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        if (data.seo) {
          if (data.seo.title) document.title = data.seo.title;
          
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          if (data.seo.description) metaDesc.setAttribute('content', data.seo.description);

          let metaKeywords = document.querySelector('meta[name="keywords"]');
          if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
          }
          if (data.seo.keywords) metaKeywords.setAttribute('content', data.seo.keywords);
        }
      }
    }).catch(console.error);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="countries" element={<CountriesPage />} />
          <Route path="country/:name" element={<CountryPage />} />
          <Route path="scholarships" element={<ScholarshipsPage />} />
          <Route path="scholarship/:id" element={<ScholarshipDetail />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="blogs/:id" element={<BlogDetail />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="services" element={<ServicesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

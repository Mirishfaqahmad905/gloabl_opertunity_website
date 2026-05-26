import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { Scholarship, Country } from '../types';
import AdBanner from '../components/AdBanner';
import { Search, ChevronRight, Globe2, GraduationCap, Calendar } from 'lucide-react';

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const currentSearch = queryParams.get('search') || '';
  const currentLevel = queryParams.get('level') || 'all';
  const currentCountry = queryParams.get('country') || 'all';
  const currentRegion = queryParams.get('region') || 'all';

  useEffect(() => {
    api.get('/public/countries').then(res => setCountries(Array.isArray(res.data) ? res.data : [])).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = '/public/scholarships?';
    if (currentSearch) url += `search=${encodeURIComponent(currentSearch)}&`;
    if (currentLevel && currentLevel !== 'all') url += `level=${encodeURIComponent(currentLevel)}&`;
    if (currentCountry && currentCountry !== 'all') url += `country=${encodeURIComponent(currentCountry)}&`;
    if (currentRegion && currentRegion !== 'all') url += `region=${encodeURIComponent(currentRegion)}&`;

    api.get(url)
      .then(res => {
        setScholarships(Array.isArray(res.data) ? res.data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentSearch, currentLevel, currentCountry, currentRegion]);

  const updateFilters = (key: string, value: string) => {
    if (value && value !== 'all') {
      queryParams.set(key, value);
    } else {
      queryParams.delete(key);
    }
    navigate(`/scholarships?${queryParams.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    updateFilters('search', fd.get('search') as string);
  };

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12 flex flex-col space-y-6">
      <AdBanner placement="home" />

      <div className="bg-white rounded-3xl p-8 border border-slate-200 overflow-hidden text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">All Scholarships</h1>
        <p className="text-sm text-slate-500 mb-8 max-w-xl mx-auto">Browse and filter thousands of fully funded opportunities.</p>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex-grow w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              name="search"
              defaultValue={currentSearch}
              placeholder="Search by title or university..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </form>
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={currentLevel}
              onChange={(e) => updateFilters('level', e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Levels</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
              <option value="Summer Scholarship">Summer Scholarship</option>
              <option value="Winter Scholarship">Winter Scholarship</option>
              <option value="Internship">Internship</option>
            </select>
            <select 
              value={currentCountry}
              onChange={(e) => updateFilters('country', e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Countries</option>
              {countries.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
            <select 
              value={currentRegion}
              onChange={(e) => updateFilters('region', e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Regions</option>
              {['Europe', 'Asia', 'South Asia', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East'].map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <AdBanner placement="between_content" />

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm font-medium">Loading scholarships...</div>
      ) : scholarships.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">No scholarships found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map(schol => (
            <Link to={`/scholarship/${schol._id}`} key={schol._id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-blue-200 transition-colors flex flex-col h-full shadow-sm hover:shadow-md">
              {schol.image && (
                <div className="h-40 w-full overflow-hidden bg-slate-100">
                  <img src={schol.image} alt={schol.imageAltText || schol.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                    {schol.level}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider flex items-center max-w-[120px] truncate">
                    <Globe2 className="w-3 h-3 mr-1 flex-shrink-0" /> <span className="truncate">{schol.country}</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors leading-snug">{schol.title}</h3>
                <p className="text-slate-500 text-xs mb-6 line-clamp-2 flex-grow">{schol.university}</p>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {schol.deadline ? new Date(schol.deadline).toLocaleDateString() : 'Varies'}
                  </span>
                  <span className="text-blue-600 text-xs font-bold flex items-center hover:translate-x-1 transition-transform">Details <ChevronRight className="w-4 h-4 ml-0.5" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

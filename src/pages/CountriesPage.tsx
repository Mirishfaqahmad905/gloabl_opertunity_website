import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Country } from '../types';
import AdBanner from '../components/AdBanner';
import { Globe2 } from 'lucide-react';

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/countries')
      .then(res => {
        setCountries(Array.isArray(res.data) ? res.data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12 flex flex-col space-y-6">
      <AdBanner placement="home" />

      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center relative overflow-hidden">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-6 shadow-sm border border-blue-100">
          <Globe2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Browse by Country</h1>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Find fully funded scholarships and study opportunities in your favorite destinations.
        </p>
      </div>

      <AdBanner placement="between_content" />

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm font-medium">Loading countries...</div>
      ) : countries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">No countries listed</h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {countries.map(c => (
            <Link to={`/country/${c.name}`} key={c._id} className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all flex flex-col items-center text-center">
              {c.image ? (
                <img src={c.image} alt={c.name} className="w-16 h-16 object-cover rounded-full mb-4 shadow-sm border border-slate-100" />
              ) : (
                <div className="w-16 h-16 bg-slate-100 rounded-full mb-4 flex items-center justify-center text-slate-400 border border-slate-200">
                  <Globe2 className="w-8 h-8 opacity-50" />
                </div>
              )}
              <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight mb-1">{c.name}</h3>
              <span className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                {c.scholarshipCount || 0} Scholarships
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

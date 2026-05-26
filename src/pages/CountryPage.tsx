import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Scholarship } from '../types';
import AdBanner from '../components/AdBanner';
import { ChevronRight, Globe2, MapPin } from 'lucide-react';

export default function CountryPage() {
  const { name } = useParams<{ name: string }>();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/public/scholarships?country=${name}`)
      .then(res => {
        setScholarships(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error(err);
        setScholarships([]);
      })
      .finally(() => setLoading(false));
  }, [name]);

  const filteredScholarships = filter === 'all' 
    ? scholarships 
    : scholarships.filter(s => s.level.toLowerCase() === filter.toLowerCase());

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12 flex flex-col space-y-6">
      <AdBanner placement="home" />

      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center relative overflow-hidden group">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-6 shadow-sm border border-blue-100">
          <MapPin className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Study in {name}</h1>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Explore all available scholarship opportunities and fully funded programs for international students in {name}.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider font-bold transition-colors ${filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All Levels
          </button>
          <button 
            onClick={() => setFilter('Undergraduate')}
            className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider font-bold transition-colors ${filter === 'Undergraduate' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Undergraduate
          </button>
          <button 
            onClick={() => setFilter('Master')}
            className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider font-bold transition-colors ${filter === 'Master' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Master's
          </button>
          <button 
            onClick={() => setFilter('PhD')}
            className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider font-bold transition-colors ${filter === 'PhD' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            PhD
          </button>
        </div>
      </div>

      <AdBanner placement="between_content" />

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm font-medium">Loading scholarships...</div>
      ) : filteredScholarships.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">No scholarships found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map(schol => (
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
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider flex items-center">
                    <Globe2 className="w-3 h-3 mr-1" /> {schol.country}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors leading-snug">{schol.title}</h3>
                <p className="text-slate-500 text-xs mb-6 line-clamp-2 flex-grow">{schol.university}</p>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    {schol.deadline ? new Date(schol.deadline).toLocaleDateString() : 'Varies'}
                  </span>
                  <span className="text-blue-600 text-xs font-bold flex items-center group-hover:translate-x-1 transition-transform">Details <ChevronRight className="w-4 h-4 ml-0.5" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

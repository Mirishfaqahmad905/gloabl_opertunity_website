import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Scholarship } from '../types';
import AdBanner from '../components/AdBanner';
import { MapPin, GraduationCap, Calendar, ExternalLink, ArrowLeft } from 'lucide-react';

export default function ScholarshipDetail() {
  const { id } = useParams<{ id: string }>();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [related, setRelated] = useState<Scholarship[]>([]);

  useEffect(() => {
    api.get(`/public/scholarships/${id}`).then(res => {
      if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
        setScholarship(res.data);
        // Fetch related by country or level
        if (res.data.country) {
          api.get(`/public/scholarships?country=${res.data.country}`).then(relRes => {
            if (Array.isArray(relRes.data)) {
              setRelated(relRes.data.filter((s: Scholarship) => s._id !== id).slice(0, 3));
            }
          }).catch(console.error);
        }
      }
    }).catch(console.error);
  }, [id]);

  if (!scholarship) return <div className="text-center py-20 text-slate-500 font-medium text-sm">Loading...</div>;

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to listings
      </Link>
      
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 mb-8 overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md uppercase tracking-wider flex items-center">
            <GraduationCap className="w-3 h-3 mr-1" /> {scholarship.level}
          </span>
          <Link to={`/country/${scholarship.country}`} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider flex items-center hover:bg-slate-200 transition-colors">
            <MapPin className="w-3 h-3 mr-1" /> {scholarship.country}
          </Link>
          {scholarship.deadline && (
            <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-md uppercase tracking-wider flex items-center">
              <Calendar className="w-3 h-3 mr-1" /> Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight leading-tight">
          {scholarship.title}
        </h1>
        
        <h2 className="text-lg text-slate-500 font-medium flex items-center mb-8 pb-8 border-b border-slate-100">
          At <span className="font-bold text-slate-800 ml-2">{scholarship.university}</span>
        </h2>

        {scholarship.image && (
          <div className="mb-8 w-full rounded-2xl overflow-hidden border border-slate-200">
            <img src={scholarship.image} alt={scholarship.imageAltText || scholarship.title} className="w-full h-auto max-h-[400px] object-cover" />
          </div>
        )}

        <div className="prose prose-slate max-w-none mb-10 text-slate-600">
          <div dangerouslySetInnerHTML={{ __html: scholarship.description.replace(/\n/g, '<br/>') }} />
        </div>

        {scholarship.applyLink && (
          <div className="flex">
            <a 
              href={scholarship.applyLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm"
            >
              Apply on Official Website <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        )}
      </div>

      <AdBanner placement="sidebar" />

      {related.length > 0 && (
        <div className="mt-12 bg-slate-100 rounded-3xl p-8 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">More Scholarships in {scholarship.country}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map(schol => (
              <Link to={`/scholarship/${schol._id}`} key={schol._id} className="group bg-white rounded-2xl border border-slate-200 p-5 flex flex-col hover:border-blue-200 hover:shadow-sm transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-md mb-3">{schol.level}</span>
                <h4 className="font-bold text-sm text-slate-800 mb-2 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">{schol.title}</h4>
                <p className="text-xs text-slate-500 mt-auto">{schol.university}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

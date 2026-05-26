import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Globe, Menu, X, ChevronDown, Moon, Sun } from 'lucide-react';
import api from '../api';
import { Settings, Country } from '../types';

export default function Navbar() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    api.get('/public/settings').then(res => {
      if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) setSettings(res.data);
    }).catch(console.error);

    api.get('/public/countries').then(res => {
      if (Array.isArray(res.data)) setCountries(res.data);
    }).catch(console.error);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCountriesOpen(false);
    setIsCategoriesOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[1024px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            {settings?.logo ? (
              <img src={settings.logo} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg leading-none">
                {settings?.siteName ? settings.siteName.charAt(0).toUpperCase() : 'G'}
              </div>
            )}
            <span className="text-xl font-bold tracking-tight text-slate-800">
              {settings?.siteName || 'GlobalOpportunity'}
            </span>
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          
          <div className="relative group/countries">
            <button className="flex items-center hover:text-blue-600 transition-colors py-2">
              Countries <ChevronDown className="w-3 h-3 ml-1 opacity-50 group-hover/countries:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg opacity-0 invisible group-hover/countries:opacity-100 group-hover/countries:visible transition-all flex flex-col overflow-hidden z-50">
              {countries.slice(0, 5).map(c => (
                <Link key={c._id} to={`/country/${c.name}`} className="px-4 py-3 hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-sm border-b border-slate-50 last:border-0 truncate">
                  {c.name}
                </Link>
              ))}
              <Link to="/countries" className="px-4 py-3 bg-slate-50 text-blue-600 font-bold hover:bg-slate-100 text-xs uppercase tracking-wider text-center">
                View All Countries
              </Link>
            </div>
          </div>

          <Link to="/scholarships" className="hover:text-blue-600 transition-colors">Scholarships</Link>

          <div className="relative group/categories">
            <button className="flex items-center hover:text-blue-600 transition-colors py-2">
              Categories <ChevronDown className="w-3 h-3 ml-1 opacity-50 group-hover/categories:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full -left-4 mt-0 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg opacity-0 invisible group-hover/categories:opacity-100 group-hover/categories:visible transition-all flex flex-col overflow-hidden z-50">
              <Link to="/scholarships?level=Undergraduate" className="px-4 py-3 hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-sm border-b border-slate-50">Undergraduate</Link>
              <Link to="/scholarships?level=Master" className="px-4 py-3 hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-sm border-b border-slate-50">Master</Link>
              <Link to="/scholarships?level=PhD" className="px-4 py-3 hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-sm border-b border-slate-50">PhD</Link>
              <Link to="/scholarships?level=Summer%20Scholarship" className="px-4 py-3 hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-sm border-b border-slate-50">Summer Scholarship</Link>
              <Link to="/scholarships?level=Winter%20Scholarship" className="px-4 py-3 hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-sm border-b border-slate-50">Winter Scholarship</Link>
              <Link to="/scholarships?level=Internship" className="px-4 py-3 hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-sm">Internship</Link>
            </div>
          </div>

          <div className="relative group/regions">
            <button className="flex items-center hover:text-blue-600 transition-colors py-2">
              Regions <ChevronDown className="w-3 h-3 ml-1 opacity-50 group-hover/regions:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full -left-4 mt-0 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg opacity-0 invisible group-hover/regions:opacity-100 group-hover/regions:visible transition-all flex flex-col overflow-hidden z-50">
              {['Europe', 'Asia', 'South Asia', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East'].map(region => (
                <Link key={region} to={`/scholarships?region=${region}`} className="px-4 py-3 hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-sm border-b border-slate-50 last:border-0">{region}</Link>
              ))}
            </div>
          </div>

          <Link to="/blogs" className="hover:text-blue-600 transition-colors">Blogs</Link>
          <Link to="/videos" className="hover:text-blue-600 transition-colors">YouTube</Link>
          <Link to="/help" className="hover:text-blue-600 transition-colors">Help</Link>
          <Link to="/services" className="hover:text-blue-600 transition-colors">IT Services</Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors" title="Toggle Theme">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu buttons */}
        <div className="md:hidden flex items-center gap-2 -mr-2">
          <button onClick={toggleTheme} className="p-2 text-slate-600 transition-colors rounded-full hover:bg-slate-100" title="Toggle Theme">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="p-2 text-slate-600 rounded-full hover:bg-slate-100" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 flex flex-col gap-4 text-sm font-medium text-slate-700 shadow-xl max-h-[80vh] overflow-y-auto">
          <Link to="/" className="py-2">Home</Link>
          
          <div className="py-2 border-t border-slate-100">
            <button onClick={() => setIsCountriesOpen(!isCountriesOpen)} className="flex items-center justify-between w-full">
              Countries <ChevronDown className={`w-4 h-4 ${isCountriesOpen ? 'rotate-180' : ''} transition-transform`} />
            </button>
            {isCountriesOpen && (
              <div className="mt-2 flex flex-col gap-3 text-slate-500 text-sm border-l-2 border-slate-100 ml-2 pl-4">
                {countries.map(c => <Link key={c._id} to={`/country/${c.name}`} className="truncate">{c.name}</Link>)}
                <Link to="/countries" className="text-blue-600 font-bold">All Countries &rarr;</Link>
              </div>
            )}
          </div>

          <Link to="/scholarships" className="py-2 border-t border-slate-100">Scholarships</Link>

          <div className="py-2 border-t border-slate-100">
            <button onClick={() => setIsCategoriesOpen(!isCategoriesOpen)} className="flex items-center justify-between w-full">
              Categories <ChevronDown className={`w-4 h-4 ${isCategoriesOpen ? 'rotate-180' : ''} transition-transform`} />
            </button>
            {isCategoriesOpen && (
              <div className="mt-2 flex flex-col gap-3 text-slate-500 text-sm border-l-2 border-slate-100 ml-2 pl-4">
                <Link to="/scholarships?level=Undergraduate">Undergraduate</Link>
                <Link to="/scholarships?level=Master">Master</Link>
                <Link to="/scholarships?level=PhD">PhD</Link>
                <Link to="/scholarships?level=Summer%20Scholarship">Summer Scholarship</Link>
                <Link to="/scholarships?level=Winter%20Scholarship">Winter Scholarship</Link>
                <Link to="/scholarships?level=Internship">Internship</Link>
              </div>
            )}
          </div>

          <div className="py-2 border-t border-slate-100">
            <div className="flex flex-col gap-3">
              <span className="text-slate-400">Regions</span>
              <div className="flex flex-col gap-3 text-slate-500 text-sm border-l-2 border-slate-100 ml-2 pl-4">
                 {['Europe', 'Asia', 'South Asia', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East'].map(region => (
                   <Link key={region} to={`/scholarships?region=${region}`}>{region}</Link>
                 ))}
              </div>
            </div>
          </div>

          <Link to="/blogs" className="py-2 border-t border-slate-100">Blogs</Link>
          <Link to="/videos" className="py-2 border-t border-slate-100">YouTube</Link>
          <Link to="/help" className="py-2 border-t border-slate-100">Help</Link>
          <Link to="/services" className="py-2 border-t border-slate-100 mb-4">IT Services</Link>
        </div>
      )}
    </nav>
  );
}

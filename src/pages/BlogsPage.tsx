import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Blog, Country } from '../types';
import AdBanner from '../components/AdBanner';
import { BookOpen, MapPin } from 'lucide-react';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    api.get('/public/blogs').then(res => {
      if (Array.isArray(res.data)) setBlogs(res.data);
    }).catch(console.error);
    api.get('/public/countries').then(res => {
      if (Array.isArray(res.data)) setCountries(res.data);
    }).catch(console.error);
  }, []);

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
      <div className="flex-grow">
        <h1 className="text-4xl font-bold text-slate-800 mb-8 tracking-tight">Student Resources</h1>
        <AdBanner placement="home" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {blogs.map(blog => (
            <Link to={`/blogs/${blog._id}`} key={blog._id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-blue-200 transition-colors flex flex-col h-full">
              {blog.image ? (
                <div className="aspect-video w-full bg-slate-100 overflow-hidden">
                   <img src={blog.image} alt={blog.imageAltText || blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="aspect-video w-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <BookOpen className="w-16 h-16" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-[10px] text-slate-400 mb-2 uppercase tracking-wider font-bold">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                  {blog.title}
                </h2>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow">
                  {blog.content.substring(0, 150)}...
                </p>
                <div className="mt-auto text-blue-600 text-xs font-bold uppercase tracking-wider">
                  Read Article <span aria-hidden="true" className="group-hover:ml-1 transition-all">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <aside className="w-full md:w-72 flex-shrink-0 space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><MapPin className="w-4 h-4 mr-2 text-blue-600" /> Browse by Country</h3>
          <ul className="space-y-2">
            {countries.map(c => (
              <li key={c._id}>
                <Link to={`/country/${c.name}`} className="flex items-center text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors font-medium">
                  {c.image ? <img src={c.image} alt={c.name} className="w-5 h-5 rounded-md object-cover mr-3" /> : <div className="w-5 h-5 rounded-md bg-slate-100 mr-3"></div>}
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <AdBanner placement="sidebar" />
      </aside>
    </div>
  );
}

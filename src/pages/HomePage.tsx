import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Scholarship, Blog, Carousel } from '../types';
import AdBanner from '../components/AdBanner';
import { motion } from 'motion/react';
import { ChevronRight, GraduationCap, Globe2, BookOpen } from 'lucide-react';

export default function HomePage() {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [upcomingScholarships, setUpcomingScholarships] = useState<Scholarship[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [trendingScholarships, setTrendingScholarships] = useState<Scholarship[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/public/carousels').catch(() => ({ data: [] })),
      api.get('/public/scholarships').catch(() => ({ data: [] })),
      api.get('/public/scholarships?sort=trending').catch(() => ({ data: [] })),
      api.get('/public/blogs').catch(() => ({ data: [] }))
    ]).then(([carRes, scholRes, trendingRes, blogRes]) => {
      setCarousels(Array.isArray(carRes.data) ? carRes.data : []);
      
      if (Array.isArray(scholRes.data)) {
        setScholarships(scholRes.data.filter(s => !s.isUpcoming).slice(0, 6));
        setUpcomingScholarships(scholRes.data.filter(s => s.isUpcoming).slice(0, 3));
      } else {
        setScholarships([]);
        setUpcomingScholarships([]);
      }

      if (Array.isArray(trendingRes.data)) {
         setTrendingScholarships(trendingRes.data.filter(s => !s.isUpcoming).slice(0, 3));
      }

      setBlogs(Array.isArray(blogRes.data) ? blogRes.data.slice(0, 3) : []);
    });
  }, []);

  useEffect(() => {
    if (carousels.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carousels.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carousels]);

  return (
    <div className="flex flex-col max-w-[1024px] mx-auto w-full p-6 space-y-4">
      {/* Hero Carousel */}
      {carousels.length > 0 && (
        <div className="relative h-[400px] w-full bg-slate-900 rounded-3xl border border-slate-200 overflow-hidden group">
          {carousels.map((slide, index) => (
            <motion.div
              key={slide._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentSlide === index ? 1 : 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
              style={{ display: currentSlide === index ? 'block' : 'none' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
              <img src={slide.image} alt={slide.imageAltText || slide.title} className="w-full h-full object-cover" />
              <div className="absolute top-6 left-6 z-20 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold">
                FEATURED
              </div>
              <div className="absolute bottom-8 left-8 right-8 z-20 text-white">
                <h1 className="text-3xl font-bold mb-2 drop-shadow-lg text-white">
                  {slide.title}
                </h1>
                {slide.description && (
                  <p className="text-slate-200 text-sm mb-4 leading-relaxed max-w-2xl drop-shadow">
                    {slide.description}
                  </p>
                )}
                {slide.link && (
                  <a href={slide.link} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-sm transition-colors mt-2 inline-block">
                    Learn More
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="py-4 space-y-4 w-full">
        <AdBanner placement="home" />

        {/* Categories / Services Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <Link to="/countries" className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col items-center text-center hover:bg-slate-50 transition-colors group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-800">Browse by Country</h3>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">Find global opportunities tailored to specific regions and countries.</p>
            <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wider flex items-center mt-auto group-hover:text-blue-700">View Countries <ChevronRight className="w-4 h-4 ml-1" /></span>
          </Link>
          <Link to="/scholarships" className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col items-center text-center hover:bg-blue-100/50 transition-colors group">
            <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-blue-100/50 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-800">All Academic Levels</h3>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">From Undergraduate to PhD, discover programs that fit your academic journey.</p>
            <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wider flex items-center mt-auto group-hover:text-blue-700">Explore Scholarships <ChevronRight className="w-4 h-4 ml-1" /></span>
          </Link>
          <Link to="/blogs" className="bg-slate-900 p-6 rounded-3xl flex flex-col items-center text-center hover:bg-slate-800 transition-colors group">
            <div className="w-14 h-14 bg-slate-800 text-blue-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Student Resources</h3>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">Read our latest guides, application tips, and success stories.</p>
            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-wider flex items-center mt-auto group-hover:text-blue-300">Read Blogs <ChevronRight className="w-4 h-4 ml-1" /></span>
          </Link>
        </div>

        <AdBanner placement="between_content" />

        {/* Trending Scholarships */}
        {trendingScholarships.length > 0 && (
          <section className="mt-8 bg-amber-50 rounded-3xl p-8 border border-amber-100 mb-8">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">🔥 Trending Scholarships</h2>
                <p className="text-slate-500 text-sm">Most viewed opportunities right now.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingScholarships.map(schol => (
                <Link to={`/scholarship/${schol._id}`} key={schol._id} className="group bg-white rounded-3xl border border-amber-200 overflow-hidden hover:border-amber-400 shadow-sm transition-colors flex flex-col h-full">
                  {schol.image && (
                    <div className="h-40 w-full overflow-hidden bg-slate-100">
                      <img src={schol.image} alt={schol.imageAltText || schol.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                        Trending
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                        {schol.level}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider flex items-center max-w-[100px] truncate">
                        <Globe2 className="w-3 h-3 mr-1 flex-shrink-0" /> <span className="truncate">{schol.country}</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors leading-snug">{schol.title}</h3>
                    <p className="text-slate-500 text-xs mb-6 line-clamp-2">{schol.university}</p>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                       <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        {schol.deadline ? new Date(schol.deadline).toLocaleDateString() : 'Varies'}
                      </span>
                      <span className="text-blue-600 text-xs font-bold flex items-center group-hover:translate-x-1 transition-transform">Details <ChevronRight className="w-4 h-4 ml-0.5" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Scholarships */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Featured Scholarships</h2>
              <p className="text-slate-500 text-sm">Discover the latest funded opportunities worldwide.</p>
            </div>
            <Link to="/scholarships" className="text-blue-600 hover:text-blue-800 text-[10px] font-bold uppercase tracking-wider hidden md:flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.length === 0 ? (
              <p className="text-slate-500 col-span-full">No scholarships available yet.</p>
            ) : (
              scholarships.map(schol => (
                <Link to={`/scholarship/${schol._id}`} key={schol._id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-blue-200 transition-colors flex flex-col h-full shadow-sm hover:shadow-md">
                  {schol.image && (
                    <div className="h-40 w-full overflow-hidden bg-slate-100">
                      <img src={schol.image} alt={schol.imageAltText || schol.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                        {schol.level}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider flex items-center">
                        <Globe2 className="w-3 h-3 mr-1" /> {schol.country}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors leading-snug">{schol.title}</h3>
                    <p className="text-slate-500 text-xs mb-6 line-clamp-2">{schol.university}</p>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        {schol.deadline ? new Date(schol.deadline).toLocaleDateString() : 'Varies'}
                      </span>
                      <span className="text-blue-600 text-xs font-bold flex items-center group-hover:translate-x-1 transition-transform">Details <ChevronRight className="w-4 h-4 ml-0.5" /></span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {upcomingScholarships.length > 0 && (
          <section className="mt-8 bg-blue-50 rounded-3xl p-8 border border-blue-100">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Upcoming Scholarships</h2>
                <p className="text-slate-500 text-sm">Prepare early for these upcoming opportunities.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingScholarships.map(schol => (
                <Link to={`/scholarship/${schol._id}`} key={schol._id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-blue-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                  {schol.image && (
                    <div className="h-32 w-full overflow-hidden bg-slate-100">
                      <img src={schol.image} alt={schol.imageAltText || schol.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col h-full uppercase">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                        Upcoming • {schol.level}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors leading-snug normal-case">{schol.title}</h3>
                    <p className="text-slate-500 text-xs mb-6 line-clamp-2 normal-case">{schol.university}</p>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center normal-case">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        {schol.deadline ? new Date(schol.deadline).toLocaleDateString() : 'Announcing Soon'}
                      </span>
                      <span className="text-blue-600 text-xs font-bold flex items-center group-hover:translate-x-1 transition-transform">Details <ChevronRight className="w-4 h-4 ml-0.5" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest Blogs */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 overflow-hidden">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Latest Insights</h2>
              <p className="text-slate-500 text-sm">Expert advice and success stories to help you apply.</p>
            </div>
            <Link to="/blogs" className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wider hidden md:flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.length === 0 ? (
              <p className="text-slate-500 col-span-full">No blogs available yet.</p>
            ) : (
              blogs.map(blog => (
                <Link to={`/blogs/${blog._id}`} key={blog._id} className="group flex flex-col bg-slate-50 rounded-2xl p-4 border border-transparent hover:border-slate-200 transition-colors h-full">
                  {blog.image ? (
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-slate-200">
                      <img src={blog.image} alt={blog.imageAltText || blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-slate-200 flex items-center justify-center text-slate-400">
                      <BookOpen className="w-8 h-8 opacity-40" />
                    </div>
                  )}
                  <span className="text-[10px] text-blue-600 font-bold mb-2 uppercase tracking-wider">Expert Advice</span>
                  <h3 className="text-sm font-bold text-slate-800 mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{blog.title}</h3>
                  <p className="text-slate-500 text-xs mb-4 line-clamp-2 flex-grow">{blog.content.substring(0, 100)}...</p>
                  <div className="flex items-center gap-2 mt-auto">
                     <span className="text-[10px] font-medium text-slate-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

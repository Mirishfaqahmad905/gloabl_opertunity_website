import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Blog } from '../types';
import AdBanner from '../components/AdBanner';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    api.get(`/public/blogs/${id}`).then(res => {
      if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
         setBlog(res.data);
      }
    }).catch(console.error);
  }, [id]);

  if (!blog) return <div className="text-center py-20 text-slate-500 font-medium text-sm">Loading...</div>;

  return (
    <article className="max-w-[1024px] mx-auto px-6 py-12">
      <Link to="/blogs" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to blogs
      </Link>
      
      <div className="bg-white rounded-3xl p-8 md:p-14 border border-slate-200 mb-8 overflow-hidden">
        <div className="flex items-center text-slate-400 text-[10px] font-bold mb-6 uppercase tracking-wider">
          <Calendar className="w-3 h-3 mr-1.5" />
          {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-8 tracking-tight leading-tight">
          {blog.title}
        </h1>
        
        {blog.image && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden mb-10 bg-slate-100">
            <img src={blog.image} alt={blog.imageAltText || blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-slate max-w-none text-slate-600">
          <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }} />
        </div>
      </div>

      <AdBanner placement="between_content" />
    </article>
  );
}

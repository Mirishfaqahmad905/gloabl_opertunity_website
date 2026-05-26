import { useState, useEffect } from 'react';
import api from '../api';
import { Video } from '../types';
import AdBanner from '../components/AdBanner';
import { Youtube } from 'lucide-react';

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/videos')
      .then(res => setVideos(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, []);

  // Use a simple embed function if possible, e.g. turning a normal youtube URL into an embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12 flex flex-col space-y-6">
      <AdBanner placement="between_content" />
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 text-center bg-gradient-to-br from-red-900/50 to-slate-900 overflow-hidden relative">
        <Youtube className="w-48 h-48 absolute -top-10 -right-10 text-red-500/10 rotate-12" />
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 relative z-10">Our Latest Videos</h1>
        <p className="text-slate-300 max-w-xl mx-auto relative z-10 text-lg">
          Watch our videos for scholarship tips, application guides, and success stories.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-200">
          <Youtube className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-lg font-medium">No videos available yet.</p>
          <p className="text-sm mt-1">Check back soon for new content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <div key={video._id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <div className="aspect-video w-full bg-slate-100">
                {getEmbedUrl(video.youtubeLink) && getEmbedUrl(video.youtubeLink).includes('embed') ? (
                  <iframe 
                    src={getEmbedUrl(video.youtubeLink)} 
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full border-0"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 p-4 text-center text-sm">
                    Invalid YouTube URL
                  </div>
                )}
              </div>
              <div className="p-5 flex-grow">
                <h3 className="font-bold text-slate-800 line-clamp-2 leading-snug break-words">{video.title}</h3>
                {video.description && (
                  <p className="text-slate-500 text-sm mt-2 line-clamp-3 leading-relaxed break-words whitespace-pre-wrap">{video.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8"><AdBanner placement="footer" /></div>
    </div>
  );
}

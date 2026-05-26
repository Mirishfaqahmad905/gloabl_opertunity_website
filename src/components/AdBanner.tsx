import { useState, useEffect } from 'react';
import api from '../api';
import { Ad } from '../types';

export default function AdBanner({ placement }: { placement: 'home' | 'sidebar' | 'footer' | 'between_content' | 'over_navbar' | 'header' }) {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    api.get('/public/ads').then((res) => {
      if (Array.isArray(res.data)) {
        setAds(res.data.filter((ad: Ad) => ad.placement === placement));
      }
    }).catch(err => console.error("Failed to fetch ads", err));
  }, [placement]);

  if (ads.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center my-4 space-y-4 w-full">
      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold text-center">Advertisement</div>
      {ads.map((ad) => (
        <div key={ad._id} className="w-full max-w-[1024px] overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center min-h-[96px] border border-slate-200">
          {ad.type === 'image' ? (
            <img src={ad.content} alt="Advertisement" className="w-full h-full object-cover max-h-[150px]" />
          ) : (
            <div 
              className="w-full p-4 flex items-center justify-center overflow-hidden" 
              ref={(el) => {
                if (el && !el.hasAttribute('data-injected')) {
                  el.setAttribute('data-injected', 'true');
                  el.innerHTML = '';
                  
                  // Extract script tags to execute them properly
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = ad.content;
                  
                  Array.from(tempDiv.childNodes).forEach(node => {
                    if (node.nodeName.toLowerCase() === 'script') {
                      const scriptEl = document.createElement('script');
                      Array.from((node as HTMLScriptElement).attributes).forEach(attr => {
                        scriptEl.setAttribute(attr.name, attr.value);
                      });
                      scriptEl.text = (node as HTMLScriptElement).text;
                      el.appendChild(scriptEl);
                    } else {
                      el.appendChild(node.cloneNode(true));
                    }
                  });
                }
              }} 
            />
          )}
        </div>
      ))}
    </div>
  );
}

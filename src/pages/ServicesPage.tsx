import { useState, useEffect } from 'react';
import api from '../api';
import { Settings, Service } from '../types';
import AdBanner from '../components/AdBanner';
import * as Icons from 'lucide-react';
import { MessageCircle } from 'lucide-react';

export default function ServicesPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    api.get('/public/settings').then(res => {
      if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
        setSettings(res.data);
      }
    }).catch(console.error);

    api.get('/public/services').then(res => {
      setServices(Array.isArray(res.data) ? res.data : []);
    }).catch(console.error).finally(() => setLoadingServices(false));

    window.scrollTo(0, 0);
  }, []);

  const handleWhatsAppClick = () => {
    if (settings?.socialLinks?.whatsapp) {
      window.open(settings.socialLinks.whatsapp, '_blank');
    } else {
      window.open('https://wa.me/923463079238', '_blank');
    }
  };

  const getIcon = (iconName?: string, colorClass?: string) => {
    // @ts-ignore
    const IconComponent = iconName && Icons[iconName] ? Icons[iconName] : Icons.FileText;
    return <IconComponent className={`w-8 h-8 ${colorClass || 'text-blue-600'}`} />;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col space-y-6">
      <AdBanner placement="between_content" />
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-4 text-center overflow-hidden">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Our IT Services</h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
          We offer a comprehensive suite of professional document creation services to give your application the best chance of success.
        </p>
      </div>

      {loadingServices ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-200">
          <p className="text-lg font-medium">No services available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className={`rounded-3xl p-8 border hover:-translate-y-1 transition-transform ${service.colorClass || 'bg-blue-50 border-blue-100'}`}>
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                {getIcon(service.iconName, service.iconColorClass)}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-3xl p-10 mt-6 border border-slate-200 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Ready to Get Started?</h2>
        <p className="text-slate-500 max-w-lg mx-auto mb-8">
          Reach out to our team right now to request any of the services listed above. We prepare everything promptly.
        </p>
        <button 
          onClick={handleWhatsAppClick}
          className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg"
        >
          <MessageCircle className="w-6 h-6" />
          Apply Through Us (WhatsApp)
        </button>
      </div>

      <div className="mt-8"><AdBanner placement="footer" /></div>
    </div>
  );
}

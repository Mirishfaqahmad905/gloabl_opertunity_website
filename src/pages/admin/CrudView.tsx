import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Plus, Trash, Edit, X } from 'lucide-react';

const SCHEMAS: Record<string, { key: string, type: string, label: string, options?: string[] }[]> = {
  scholarships: [
    { key: 'title', type: 'text', label: 'Title' },
    { key: 'region', type: 'select', label: 'Region', options: ['Europe', 'Asia', 'South Asia', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East'] },
    { key: 'country', type: 'text', label: 'Country' },
    { key: 'level', type: 'select', label: 'Level', options: ['Undergraduate', 'Master', 'PhD', 'Summer Scholarship', 'Winter Scholarship', 'Internship'] },
    { key: 'university', type: 'text', label: 'University' },
    { key: 'description', type: 'textarea', label: 'Description' },
    { key: 'deadline', type: 'date', label: 'Deadline' },
    { key: 'applyLink', type: 'text', label: 'Apply Link' },
    { key: 'image', type: 'text', label: 'Image (URL or Upload)' },
    { key: 'imageAltText', type: 'text', label: 'Image Alt Text (SEO/Accessibility)' },
    { key: 'isUpcoming', type: 'checkbox', label: 'Upcoming Scholarship?' }
  ],
  blogs: [
    { key: 'title', type: 'text', label: 'Title' },
    { key: 'image', type: 'text', label: 'Image URL' },
    { key: 'imageAltText', type: 'text', label: 'Image Alt Text (SEO/Accessibility)' },
    { key: 'content', type: 'textarea', label: 'Content (HTML/Text)' }
  ],
  countries: [
    { key: 'name', type: 'text', label: 'Country Name' },
    { key: 'image', type: 'text', label: 'Flag/Image URL' }
  ],
  ads: [
    { key: 'type', type: 'select', label: 'Type', options: ['image', 'script', 'html', 'google_ads'] },
    { key: 'placement', type: 'select', label: 'Placement', options: ['home', 'sidebar', 'footer', 'between_content', 'over_navbar', 'header'] },
    { key: 'content', type: 'textarea', label: 'Content (URL, HTML, or Script)' },
    { key: 'active', type: 'checkbox', label: 'Active' }
  ],
  carousels: [
    { key: 'title', type: 'text', label: 'Title' },
    { key: 'description', type: 'text', label: 'Description' },
    { key: 'image', type: 'text', label: 'Image URL' },
    { key: 'imageAltText', type: 'text', label: 'Image Alt Text (SEO/Accessibility)' },
    { key: 'link', type: 'text', label: 'Link URL' },
    { key: 'order', type: 'number', label: 'Order' }
  ],
  videos: [
    { key: 'title', type: 'text', label: 'Title' },
    { key: 'youtubeLink', type: 'text', label: 'YouTube Link' },
    { key: 'description', type: 'textarea', label: 'Description' },
    { key: 'order', type: 'number', label: 'Order' }
  ],
  services: [
    { key: 'title', type: 'text', label: 'Title' },
    { key: 'description', type: 'textarea', label: 'Description' },
    { key: 'iconName', type: 'text', label: 'Icon Name (e.g. FileText, Briefcase)' },
    { key: 'colorClass', type: 'text', label: 'Color Class (e.g. bg-blue-50 border-blue-100)' },
    { key: 'iconColorClass', type: 'text', label: 'Icon Color Class (e.g. text-blue-600)' },
    { key: 'order', type: 'number', label: 'Order' }
  ],
  messages: [],
  subscribers: []
};

export default function CrudView({ model }: { model: string }) {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<any>(null);
  const schema = SCHEMAS[model];
  const readOnly = model === 'messages' || model === 'subscribers';

  useEffect(() => {
    fetchData();
  }, [model]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/admin/${model}`);
      if (Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (err: any) {
      if (err.response?.status !== 401) {
        console.error("Fetch data error:", err);
      }
      setData([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await api.delete(`/admin/${model}/${id}`);
    fetchData();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEdit._id) {
      await api.put(`/admin/${model}/${currentEdit._id}`, currentEdit);
    } else {
      await api.post(`/admin/${model}`, currentEdit);
    }
    setIsModalOpen(false);
    fetchData();
  };

  const openNew = () => {
    const initData: any = {};
    schema.forEach(field => {
      initData[field.key] = field.type === 'select' ? field.options?.[0] : '';
    });
    setCurrentEdit(initData);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 capitalize">{model} Management</h2>
        {!readOnly && (
          <button onClick={openNew} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center font-medium hover:bg-blue-700 transition">
            <Plus className="w-4 h-4 mr-2" /> Add New
          </button>
        )}
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm text-gray-500 min-w-full">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {schema.length > 0 ? schema.slice(0, 3).map(col => (
                <th key={col.key} className="px-6 py-4">{col.label}</th>
              )) : model === 'messages' ? (
                <>
                  <th className="px-6 py-4">Name</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Message</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-4">Email</th><th className="px-6 py-4">Date</th>
                </>
              )}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item._id} className="border-b last:border-0 hover:bg-gray-50">
                {schema.length > 0 ? schema.slice(0, 3).map(col => (
                  <td key={col.key} className="px-6 py-4 font-medium text-gray-900 max-w-[200px] truncate">
                    {item[col.key]?.toString()}
                  </td>
                )) : model === 'messages' ? (
                  <>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{item.message}</td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                  </>
                )}
                <td className="px-6 py-4 flex justify-end space-x-2">
                  {!readOnly && (
                    <button onClick={() => { setCurrentEdit(item); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg">
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <div className="p-8 text-center text-gray-500">No records found.</div>}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X /></button>
            <h2 className="text-2xl font-bold mb-6 capitalize">{currentEdit._id ? 'Edit' : 'Add'} {model.slice(0, -1)}</h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              {schema.map(field => (
                <div key={field.key}>
                  {field.type !== 'checkbox' && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  )}
                  {field.type === 'textarea' ? (
                    <div>
                      <textarea 
                        required={field.key === 'content' || field.key === 'description'} 
                        rows={4} 
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={currentEdit[field.key] || ''} 
                        onChange={e => setCurrentEdit({...currentEdit, [field.key]: e.target.value})}
                      />
                      {model === 'ads' && field.key === 'content' && currentEdit['type'] === 'image' && (
                        <div className="mt-2 text-sm text-gray-500 text-center font-medium my-2">- OR -</div>
                      )}
                      {model === 'ads' && field.key === 'content' && currentEdit['type'] === 'image' && (
                        <div className="mt-2">
                          <input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setCurrentEdit({...currentEdit, [field.key]: reader.result as string});
                              reader.readAsDataURL(file);
                            }
                          }} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                          {currentEdit['content'] && currentEdit['content'].length > 10 && (
                            <img src={currentEdit['content']} alt="Ad Preview" className="mt-4 max-h-32 object-contain bg-slate-100 border border-gray-200 rounded-md" />
                          )}
                        </div>
                      )}
                    </div>
                  ) : field.type === 'select' ? (
                    <select 
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={currentEdit[field.key] || ''} 
                      onChange={e => setCurrentEdit({...currentEdit, [field.key]: e.target.value})}
                    >
                      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!!currentEdit[field.key]} 
                        onChange={e => setCurrentEdit({...currentEdit, [field.key]: e.target.checked})}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>{field.label}</span>
                    </label>
                  ) : (
                    <div>
                      <input 
                        required={field.key !== 'deadline' && field.key !== 'applyLink' && field.key !== 'image' && field.key !== 'description' && field.key !== 'link' && field.key !== 'title' && field.key !== 'content'} 
                        type={field.type} 
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={field.type === 'date' && currentEdit[field.key] ? currentEdit[field.key].slice(0, 10) : currentEdit[field.key] || ''} 
                        onChange={e => setCurrentEdit({...currentEdit, [field.key]: e.target.value})}
                      />
                      {field.key === 'image' && (
                        <div className="mt-2">
                          <input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setCurrentEdit({...currentEdit, [field.key]: reader.result as string});
                              reader.readAsDataURL(file);
                            }
                          }} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                          {currentEdit['image'] && <img src={currentEdit['image']} alt="Preview" className="mt-4 w-16 h-16 object-cover border border-gray-200 rounded-md" />}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 hover:bg-blue-700 rounded-xl font-medium">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Mail, ArrowLeft } from 'lucide-react';
import api from '../../api';

export default function AdminForgot() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data?.message) {
        setStatus(res.data.message);
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        setStatus(err.response.data.error);
      } else {
        setStatus('An error occurred while resetting the password.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mb-4 flex justify-between">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
          <Home className="w-4 h-4 mr-2" />
          Back to Website
        </Link>
        <Link to="/admin" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>
      </div>
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100 relative">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">Account Access</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Create account or reset admin password</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleReset}>
          {status && (
            <div className={`p-4 rounded-xl text-sm font-medium ${status.includes('error') || status.includes('only allowed') || status.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
              {status}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Admin Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-50 transition-colors"
                  placeholder="Enter authorized email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Send Password'}
            </button>
          </div>
          <p className="text-xs text-center text-gray-500 mt-4">
            Credentials will only be sent to the authorized admin email (techhub905@gmail.com).
          </p>
        </form>
      </div>
    </div>
  );
}

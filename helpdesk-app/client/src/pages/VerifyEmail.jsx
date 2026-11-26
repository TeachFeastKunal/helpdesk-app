import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }

    api
      .get(`/auth/verify-email?token=${token}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed.');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Email Verification</h1>
        <p
          className={`mb-6 text-sm font-medium ${
            status === 'success'
              ? 'text-green-700'
              : status === 'error'
              ? 'text-red-600'
              : 'text-slate-600'
          }`}
        >
          {message}
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
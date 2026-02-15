import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail, Info } from 'lucide-react';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');
    const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
    const [canResend, setCanResend] = useState(false);

    const hasFetched = useRef(false);

    useEffect(() => {
        const verifyToken = async () => {
            if (hasFetched.current) return;
            if (!token) {
                setStatus('error');
                setMessage('No token found.');
                return;
            }

            try {
                const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const fullUrl = `${apiBase}/auth/verify?token=${token}`;
                
                hasFetched.current = true;

                const response = await fetch(fullUrl, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    credentials: 'include',
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.msg);
                    
                    if (data.alreadyVerified) {
                        setIsAlreadyVerified(true);
                        // If already verified, redirect to login instead of dashboard
                        setTimeout(() => navigate('/login'), 4000);
                    } else {
                        setTimeout(() => navigate('/dashboard'), 3000);
                    }
                } else {
                    setStatus('error');
                    setMessage(data.msg || 'Verification failed');
                    setCanResend(true);
                }
            } catch (err) {
                setStatus('error');
                setMessage('Connection error. Please try again later.');
                setCanResend(true);
            }
        };

        verifyToken();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                
                {status === 'verifying' && (
                    <div className="space-y-4">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
                        <h1 className="text-2xl font-bold text-gray-800">Verifying Protocol</h1>
                        <p className="text-gray-500 italic">Synchronizing with BerryBox Cloud...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        {isAlreadyVerified ? (
                            <Info className="w-16 h-16 text-blue-500 mx-auto" />
                        ) : (
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        )}
                        <h1 className={`text-2xl font-bold ${isAlreadyVerified ? 'text-blue-600' : 'text-green-600'}`}>
                            {isAlreadyVerified ? 'Already Verified' : 'Email Verified!'}
                        </h1>
                        <p className="text-gray-600">{message}</p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Redirecting...
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
                        <p className="text-gray-600 font-medium">{message}</p>
                        <div className="pt-4 space-y-2">
                            {canResend && (
                                <Link to="/resend-verification" className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all">
                                    <Mail size={18} /> Request New Link
                                </Link>
                            )}
                            <Link to="/login" className="block text-sm text-gray-500 hover:underline">Back to Login</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
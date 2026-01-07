import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyDeposit } from '../../api/wallet';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const WalletDepositCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                // Convert params to object
                const params = {};
                for (const [key, value] of searchParams.entries()) {
                    params[key] = value;
                }

                if (Object.keys(params).length === 0) {
                    setStatus('error');
                    setMessage('No parameters received');
                    return;
                }

                await verifyDeposit(params);
                setStatus('success');
                setTimeout(() => {
                    navigate('/profile/wallet');
                }, 3000);
            } catch (error) {
                console.error("Deposit verification failed:", error);
                setStatus('error');
                setMessage(error.response?.data?.message || "Verification failed");
            }
        };

        verify();
    }, [searchParams, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                {status === 'processing' && (
                    <>
                        <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Processing Deposit...</h2>
                        <p className="text-gray-600">Please wait while we verify your transaction.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Deposit Successful!</h2>
                        <p className="text-gray-600 mb-4">Your wallet balance has been updated.</p>
                        <p className="text-sm text-gray-400">Redirecting to wallet in 3 seconds...</p>
                        <button
                            onClick={() => navigate('/profile/wallet')}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Go to Wallet
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <FaTimesCircle className="text-5xl text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Deposit Failed</h2>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <button
                            onClick={() => navigate('/profile/wallet')}
                            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                        >
                            Back to Wallet
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default WalletDepositCallback;

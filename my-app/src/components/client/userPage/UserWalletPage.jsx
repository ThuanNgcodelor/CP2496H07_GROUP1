import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserWallet, getWalletEntries, deposit, withdraw, depositDirect } from '../../../api/wallet';
import Loading from '../Loading';
import { FaWallet, FaHistory, FaArrowUp, FaArrowDown, FaExchangeAlt, FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function UserWalletPage() {
    const { t } = useTranslation();
    const [wallet, setWallet] = useState(null);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    // Deposit/Withdraw Modals
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [withdrawInfo, setWithdrawInfo] = useState({
        amount: '',
        bankAccount: '',
        bankName: '',
        accountHolder: ''
    });

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const walletData = await getUserWallet();
            setWallet(walletData);

            const entriesData = await getWalletEntries(page, pageSize);
            setEntries(entriesData.content || []);
            setTotalPages(entriesData.totalPages || 0);
        } catch (error) {
            console.error("Failed to fetch wallet data", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (type) => {
        switch (type) {
            case 'REFUND':
            case 'DEPOSIT':
                return 'bg-success';
            case 'WITHDRAWAL':
            case 'PAYMENT':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    const getEntryTypeLabel = (type) => {
        switch (type) {
            case 'REFUND': return t('wallet.refund');
            case 'DEPOSIT': return t('wallet.deposit');
            case 'WITHDRAWAL': return t('wallet.withdrawal');
            case 'PAYMENT': return t('wallet.payment');
            default: return type;
        }
    };

    const formatNumberInput = (value) => {
        // Remove non-digits
        const rawValue = value.replace(/\D/g, '');
        // Format with dots
        return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const parseNumberInput = (value) => {
        return value.replace(/\./g, '');
    };

    const handleDeposit = async () => {
        try {
            const rawAmount = parseNumberInput(amount);
            if (!rawAmount || parseInt(rawAmount) <= 0) {
                toast.error("Please enter a valid amount");
                return;
            }
            if (parseInt(rawAmount) < 10000) {
                toast.error("Minimum deposit amount is 10,000 VND");
                return;
            }

            // Direct Deposit (Simple)
            await depositDirect(rawAmount);

            toast.success("Deposit successful");
            setShowDepositModal(false);
            setAmount('');
            fetchData(); // Refresh wallet data

        } catch (error) {
            console.error("Deposit failed:", error);
            toast.error("Failed to deposit: " + (error.response?.data?.message || "Unknown error"));
        }
    };

    const handleWithdraw = async () => {
        try {
            const rawAmount = parseNumberInput(withdrawInfo.amount);
            if (!rawAmount || parseInt(rawAmount) <= 0) {
                toast.error("Please enter a valid amount");
                return;
            }
            if (parseInt(rawAmount) < 10000) {
                toast.error("Minimum withdrawal amount is 10,000 VND");
                return;
            }
            if (!withdrawInfo.bankAccount || !withdrawInfo.bankName || !withdrawInfo.accountHolder) {
                toast.error("Please fill all bank details");
                return;
            }

            await withdraw(rawAmount, withdrawInfo.bankAccount, withdrawInfo.bankName, withdrawInfo.accountHolder);
            toast.success("Withdrawal request submitted");
            setShowWithdrawModal(false);
            setWithdrawInfo({ amount: '', bankAccount: '', bankName: '', accountHolder: '' });
            fetchData();
        } catch (error) {
            console.error("Withdraw failed:", error);
            toast.error("Withdrawal failed: " + (error.response?.data?.message || "Unknown error"));
        }
    };

    if (loading && !wallet) {
        return <Loading />;
    }

    // Modal CSS styles
    const modalStyle = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'block'
        },
        content: {
            border: 'none',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            overflow: 'hidden'
        },
        header: {
            background: 'none',
            border: 'none',
            padding: '40px 40px 10px 40px',
            textAlign: 'center'
        },
        title: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '8px'
        },
        subtitle: {
            fontSize: '15px',
            color: '#888',
            marginBottom: '30px'
        },
        inputContainer: {
            textAlign: 'center',
            marginBottom: '40px',
            position: 'relative',
        },
        input: {
            fontSize: '48px',
            fontWeight: '700',
            textAlign: 'center',
            border: 'none',
            borderBottom: '2px solid #eee',
            width: '80%',
            padding: '10px',
            color: '#333',
            outline: 'none',
            background: 'transparent',
            transition: 'border-color 0.3s'
        },
        currency: {
            fontSize: '24px',
            fontWeight: '500',
            color: '#aaa',
            position: 'absolute',
            top: '20px',
            right: '15%',
        },
        actions: {
            padding: '0 40px 40px 40px',
            display: 'flex',
            gap: '15px',
            justifyContent: 'center'
        },
        btnSecondary: {
            borderRadius: '16px',
            padding: '16px 32px',
            border: 'none',
            background: '#f5f5f7',
            color: '#666',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'all 0.2s'
        },
        btnPrimary: {
            borderRadius: '16px',
            padding: '16px 48px',
            border: 'none',
            background: 'linear-gradient(135deg, #111 0%, #333 100%)',
            color: 'white',
            fontWeight: '600',
            fontSize: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.2s',
            flex: 1
        }
    };

    return (
        <div className="p-4" style={{ background: '#fff', borderRadius: '4px' }}>
            <div className="flex justify-between items-center mb-4">
                <h5 style={{ fontSize: '18px', color: '#222' }}>{t('wallet.title')}</h5>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-12">
                    <div className="p-5 rounded-3 h-100 text-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF8A65 100%)', color: 'white', boxShadow: '0 10px 30px rgba(255, 87, 34, 0.3)' }}>
                        {/* Decorative circles */}
                        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>

                        <div className="mb-2 opacity-75 text-uppercase letter-spacing-2" style={{ fontSize: '14px', letterSpacing: '1px' }}>{t('wallet.availableBalance')}</div>
                        <div style={{ fontSize: '48px', fontWeight: '800', textShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                            {wallet ? formatCurrency(wallet.balanceAvailable) : '0 ₫'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mb-5 justify-content-start">
                <button
                    onClick={() => setShowDepositModal(true)}
                    className="btn-modern btn-deposit"
                >
                    <FaPlus /> {t('wallet.deposit')}
                </button>
                <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="btn-modern btn-withdraw"
                >
                    <FaMinus /> {t('wallet.withdraw')}
                </button>
                <style>{`
                        .btn-modern {
                            border-radius: 50px;
                            padding: 12px 32px;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            border: 2px solid transparent;
                            font-size: 16px;
                            flex: 1; /* Make buttons grow on mobile, or remove for fixed */
                            justify-content: center;
                            max-width: 250px;
                        }
                        .btn-modern:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                        }
                        .btn-modern:active {
                            transform: translateY(0);
                        }
                        .btn-deposit {
                            background: linear-gradient(135deg, #00b09b 0%, #96c93d 100%);
                            color: white;
                            box-shadow: 0 4px 15px rgba(0, 176, 155, 0.3);
                        }
                        .btn-deposit:hover {
                            background: linear-gradient(135deg, #00c4ad 0%, #a4db43 100%);
                            color: white;
                        }
                        .btn-withdraw {
                            background: white;
                            border: 2px solid #ff5f6d;
                            color: #ff5f6d;
                            box-shadow: 0 4px 15px rgba(255, 95, 109, 0.1);
                        }
                        .btn-withdraw:hover {
                            background: #fff0f1;
                            border-color: #ff3b4e;
                            color: #ff3b4e;
                        }
                        @media (max-width: 768px) {
                             .btn-modern {
                                width: 100%;
                                max-width: none;
                             }
                        }
                        .modal-modern-input:focus {
                            border-bottom-color: #000 !important;
                        }
                    `}</style>
            </div>

            <h6 className="mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>{t('wallet.history')}</h6>
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="bg-light text-secondary small">
                        <tr>
                            <th className="py-3 border-0">{t('wallet.date')}</th>
                            <th className="py-3 border-0">{t('wallet.type')}</th>
                            <th className="py-3 border-0">{t('wallet.description')}</th>
                            <th className="py-3 border-0 text-end">{t('wallet.amount')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-5 text-muted">
                                    {t('wallet.noTransactions')}
                                </td>
                            </tr>
                        ) : (
                            entries.map((entry) => (
                                <tr key={entry.id}>
                                    <td style={{ fontSize: '14px' }}>{formatDate(entry.createdAt)}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(entry.entryType)}`} style={{ fontWeight: 500 }}>
                                            {getEntryTypeLabel(entry.entryType)}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '14px', maxWidth: '300px' }} className="text-truncate" title={entry.description}>
                                        {entry.description}
                                        {entry.orderId && <div className="small text-muted">Order: {entry.orderId}</div>}
                                    </td>
                                    <td className="text-end fw-bold" style={{ color: entry.amount > 0 && (entry.entryType === 'REFUND' || entry.entryType === 'DEPOSIT') ? '#28a745' : '#dc3545' }}>
                                        {(entry.entryType === 'REFUND' || entry.entryType === 'DEPOSIT') ? '+' : '-'}{formatCurrency(entry.amount)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {
                totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination">
                                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(p => Math.max(0, p - 1))}>
                                        &laquo;
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(i)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>
                                        &raquo;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )
            }

            {/* Modern Deposit Modal */}
            {showDepositModal && (
                <div className="modal fade show" style={modalStyle.overlay} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={modalStyle.content}>
                            <div style={modalStyle.header}>
                                <h3 style={modalStyle.title}>{t('wallet.deposit')}</h3>
                                <p style={modalStyle.subtitle}>Enter amount to deposit to your wallet</p>
                            </div>

                            <div style={modalStyle.inputContainer}>
                                <input
                                    type="text"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(formatNumberInput(e.target.value))}
                                    style={modalStyle.input}
                                    className="modal-modern-input"
                                    autoFocus
                                />
                                <span style={modalStyle.currency}>VND</span>
                            </div>

                            <div style={modalStyle.actions}>
                                <button
                                    onClick={() => setShowDepositModal(false)}
                                    style={modalStyle.btnSecondary}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeposit}
                                    style={{ ...modalStyle.btnPrimary, background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)' }}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modern Withdraw Modal */}
            {showWithdrawModal && (
                <div className="modal fade show" style={modalStyle.overlay} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={modalStyle.content}>
                            <div style={modalStyle.header}>
                                <h3 style={modalStyle.title}>{t('wallet.withdraw')}</h3>
                                <p style={modalStyle.subtitle}>Enter amount and bank details</p>
                            </div>

                            <div style={modalStyle.inputContainer}>
                                <input
                                    type="text"
                                    placeholder="0"
                                    value={withdrawInfo.amount}
                                    onChange={(e) => setWithdrawInfo({ ...withdrawInfo, amount: formatNumberInput(e.target.value) })}
                                    style={{ ...modalStyle.input, color: '#ff5f6d' }}
                                    className="modal-modern-input"
                                />
                                <span style={{ ...modalStyle.currency, color: '#ff5f6d' }}>VND</span>
                            </div>

                            <div className="px-5 pb-4">
                                <div className="vstack gap-3">
                                    <input
                                        type="text"
                                        placeholder="Bank Name (e.g. Vietcombank)"
                                        value={withdrawInfo.bankName}
                                        onChange={(e) => setWithdrawInfo({ ...withdrawInfo, bankName: e.target.value })}
                                        className="form-control form-control-lg bg-light border-0"
                                        style={{ borderRadius: '12px', fontSize: '15px' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Account Number"
                                        value={withdrawInfo.bankAccount}
                                        onChange={(e) => setWithdrawInfo({ ...withdrawInfo, bankAccount: e.target.value })}
                                        className="form-control form-control-lg bg-light border-0 font-monospace"
                                        style={{ borderRadius: '12px', fontSize: '15px' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Account Holder Name"
                                        value={withdrawInfo.accountHolder}
                                        onChange={(e) => setWithdrawInfo({ ...withdrawInfo, accountHolder: e.target.value.toUpperCase() })}
                                        className="form-control form-control-lg bg-light border-0"
                                        style={{ borderRadius: '12px', fontSize: '15px' }}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setWithdrawInfo({
                                        amount: formatNumberInput('50000'),
                                        bankAccount: '999988887777',
                                        bankName: 'Ngan Hang Test (Demo)',
                                        accountHolder: 'NGUYEN VAN TEST'
                                    })}
                                    className="btn btn-link text-decoration-none text-muted p-0 mt-3 d-flex align-items-center gap-1 small mx-auto"
                                >
                                    <i className="fa fa-magic text-warning"></i> {t('wallet.fillTestData')}
                                </button>
                            </div>

                            <div style={modalStyle.actions}>
                                <button
                                    onClick={() => setShowWithdrawModal(false)}
                                    style={modalStyle.btnSecondary}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleWithdraw}
                                    style={{ ...modalStyle.btnPrimary, background: '#ff5f6d', boxShadow: '0 4px 15px rgba(255, 95, 109, 0.3)' }}
                                >
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

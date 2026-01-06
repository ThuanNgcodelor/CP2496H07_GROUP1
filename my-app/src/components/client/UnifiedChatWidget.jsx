import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './UnifiedChatWidget.css';

export default function UnifiedChatWidget() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('shop'); // 'shop' or 'ai'
    const [shopUnreadCount, setShopUnreadCount] = useState(0);

    // Listen for unread count updates from shop chat
    useEffect(() => {
        const handleUnreadUpdate = (event) => {
            setShopUnreadCount(event.detail || 0);
        };
        window.addEventListener('shop-chat-unread-update', handleUnreadUpdate);
        return () => {
            window.removeEventListener('shop-chat-unread-update', handleUnreadUpdate);
        };
    }, []);

    return (
        <>
            {/* Unified FAB Button */}
            {!isOpen && (
                <button
                    className="unified-chat-fab"
                    onClick={() => setIsOpen(true)}
                    title={t('chat.openChat', 'Mở chat')}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor" />
                        <circle cx="8" cy="10" r="1.5" fill="white" />
                        <circle cx="12" cy="10" r="1.5" fill="white" />
                        <circle cx="16" cy="10" r="1.5" fill="white" />
                    </svg>
                    <span>Chat</span>
                    {shopUnreadCount > 0 && (
                        <span className="unified-chat-badge">
                            {shopUnreadCount > 99 ? '99+' : shopUnreadCount}
                        </span>
                    )}
                </button>
            )}

            {/* Unified Chat Panel */}
            {isOpen && (
                <div className="unified-chat-panel">
                    {/* Tab Header */}
                    <div className="unified-chat-header">
                        <div className="unified-chat-tabs">
                            <button
                                className={`unified-chat-tab ${activeTab === 'shop' ? 'active' : ''}`}
                                onClick={() => setActiveTab('shop')}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor" />
                                </svg>
                                <span>{t('chat.shopChat', 'Chat với Shop')}</span>
                                {shopUnreadCount > 0 && (
                                    <span className="unified-tab-badge">{shopUnreadCount}</span>
                                )}
                            </button>
                            <button
                                className={`unified-chat-tab ${activeTab === 'ai' ? 'active' : ''}`}
                                onClick={() => setActiveTab('ai')}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" fill="currentColor" />
                                    <circle cx="9" cy="10" r="1.5" fill="white" />
                                    <circle cx="15" cy="10" r="1.5" fill="white" />
                                    <path d="M12 16C14.21 16 16 14.67 16 13H8C8 14.67 9.79 16 12 16Z" fill="white" />
                                </svg>
                                <span>{t('chat.aiAssistant', 'AI Assistant')}</span>
                            </button>
                        </div>
                        <button
                            className="unified-chat-close"
                            onClick={() => setIsOpen(false)}
                            title={t('chat.close', 'Đóng')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
                            </svg>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="unified-chat-content">
                        {activeTab === 'shop' ? (
                            <div id="unified-shop-chat-container" className="unified-tab-content" />
                        ) : (
                            <div id="unified-ai-chat-container" className="unified-tab-content" />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

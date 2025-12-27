import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { sendShopOwnerAIChatMessage, clearShopOwnerAIConversation } from '../../api/shop-owner-ai-chat';
import './ShopOwnerAIChatWidget.css';

const ShopOwnerAIChatWidget = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Get shop owner ID from cookie
    const getShopOwnerId = () => {
        try {
            const userCookie = Cookies.get('user');
            if (userCookie) {
                const userData = JSON.parse(userCookie);
                return userData.id || userData.userId || null;
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        // Add user message to chat
        setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const shopOwnerId = getShopOwnerId();
            const response = await sendShopOwnerAIChatMessage(userMessage, conversationId, shopOwnerId);

            if (response.conversationId) {
                setConversationId(response.conversationId);
            }

            // Add AI response
            setMessages(prev => [...prev, {
                type: 'ai',
                content: response.message,
                success: response.success
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                type: 'ai',
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
                success: false
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = async () => {
        if (conversationId) {
            try {
                await clearShopOwnerAIConversation(conversationId);
            } catch (error) {
                console.error('Failed to clear conversation:', error);
            }
        }
        setMessages([]);
        setConversationId(null);
    };

    // Quick action buttons for shop owner
    const handleQuickAction = (action) => {
        setInputMessage(action);
        const fakeEvent = { preventDefault: () => { } };
        setTimeout(() => {
            const form = document.querySelector('.shop-ai-input-form');
            if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
        }, 100);
    };

    // Render message with simple markdown
    const renderMessageContent = (msg) => {
        let content = msg.content || '';

        // Bold text
        content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Line breaks
        content = content.replace(/\n/g, '<br/>');

        // Highlight order IDs (UUID format)
        content = content.replace(
            /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/gi,
            '<span class="shop-ai-order-id">$1</span>'
        );

        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    };

    return (
        <div className="shop-ai-chat-widget">
            {/* Toggle Button */}
            <button
                className={`shop-ai-chat-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="AI Assistant"
            >
                {isOpen ? (
                    <span className="shop-ai-close-icon">✕</span>
                ) : (
                    <span className="shop-ai-bot-icon">🤖</span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="shop-ai-chat-window">
                    {/* Header */}
                    <div className="shop-ai-chat-header">
                        <div className="shop-ai-header-info">
                            <span className="shop-ai-bot-avatar">🤖</span>
                            <div>
                                <h4>VIBE Shop Assistant</h4>
                                <span className="shop-ai-status">Quản lý đơn hàng thông minh</span>
                            </div>
                        </div>
                        <button className="shop-ai-clear-btn" onClick={handleClearChat} title="Xóa chat">
                            🗑️
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="shop-ai-quick-actions">
                        <button onClick={() => handleQuickAction('Bao nhiêu đơn chờ xác nhận?')}>
                            📊 Thống kê đơn
                        </button>
                        <button onClick={() => handleQuickAction('Đơn hàng pending')}>
                            📦 Đơn pending
                        </button>
                        <button onClick={() => handleQuickAction('Xác nhận hết đơn pending')}>
                            ✅ Duyệt tất cả
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="shop-ai-messages">
                        {messages.length === 0 && (
                            <div className="shop-ai-welcome">
                                <p>👋 Xin chào! Tôi là AI Assistant dành cho Shop Owner.</p>
                                <p>Tôi có thể giúp bạn:</p>
                                <ul>
                                    <li>📊 Thống kê đơn hàng theo trạng thái</li>
                                    <li>📦 Xem danh sách đơn chờ xác nhận</li>
                                    <li>✅ Xác nhận tất cả đơn pending cùng lúc</li>
                                </ul>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div key={index} className={`shop-ai-message ${msg.type}`}>
                                {msg.type === 'ai' && <span className="shop-ai-avatar">🤖</span>}
                                <div className="shop-ai-message-content">
                                    {renderMessageContent(msg)}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="shop-ai-message ai">
                                <span className="shop-ai-avatar">🤖</span>
                                <div className="shop-ai-message-content">
                                    <div className="shop-ai-typing">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form className="shop-ai-input-form" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Nhập câu hỏi về đơn hàng..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !inputMessage.trim()}>
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ShopOwnerAIChatWidget;

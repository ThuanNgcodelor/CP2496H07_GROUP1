import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Hls from 'hls.js';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import Header from '../../components/client/Header';
import Footer from '../../components/client/Footer';
import { getLiveRoom, getRecentChats, getLiveProducts, addLiveItemToCart } from '../../api/live';
import { getUser } from '../../api/user';
import { LOCAL_BASE_URL } from '../../config/config.js';

export default function LiveWatchPage() {
    const { roomId } = useParams();
    const videoRef = useRef(null);
    const chatContainerRef = useRef(null);
    const stompClientRef = useRef(null);
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewerCount, setViewerCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [products, setProducts] = useState([]);
    const [addingToCart, setAddingToCart] = useState(null);

    // Check if user is logged in via cookie
    const token = Cookies.get('accessToken');
    const isLoggedIn = !!token;

    // Fetch room data and user info
    useEffect(() => {
        fetchRoom();
        fetchChats();
        // Fetch user info if logged in
        if (isLoggedIn) {
            getUser().then(setUserInfo).catch(console.error);
        }
    }, [roomId, isLoggedIn]);

    // WebSocket connection
    useEffect(() => {
        if (!roomId) return;

        // WebSocket connects through Gateway (port 8080) which routes to notification-service
        const wsUrl = (LOCAL_BASE_URL || 'http://localhost:8080') + '/ws/live';

        const client = new Client({
            webSocketFactory: () => new SockJS(wsUrl),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => console.log('STOMP: ', str),
            onConnect: () => {
                console.log('WebSocket connected for room:', roomId);
                setIsConnected(true);

                // Subscribe to viewer count updates
                client.subscribe(`/topic/live/${roomId}/viewers`, (message) => {
                    const data = JSON.parse(message.body);
                    console.log('Viewer count update:', data);
                    setViewerCount(data.count || 0);
                });

                // Subscribe to chat messages
                client.subscribe(`/topic/live/${roomId}/chat`, (message) => {
                    const chatMsg = JSON.parse(message.body);
                    console.log('New chat message:', chatMsg);
                    setMessages(prev => [...prev, chatMsg]);

                    // Auto scroll
                    if (chatContainerRef.current) {
                        setTimeout(() => {
                            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                        }, 100);
                    }
                });

                // Subscribe to product updates
                client.subscribe(`/topic/live/${roomId}/product`, (message) => {
                    const productData = JSON.parse(message.body);
                    console.log('Product update:', productData);
                    setProducts(Array.isArray(productData) ? productData : [productData]);
                });

                // Join room to increment viewer count
                client.publish({
                    destination: `/app/live/${roomId}/join`,
                    body: JSON.stringify({})
                });
            },
            onDisconnect: () => {
                console.log('WebSocket disconnected');
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
            }
        });

        client.activate();
        stompClientRef.current = client;

        // Cleanup on unmount
        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                // Leave room before disconnecting
                stompClientRef.current.publish({
                    destination: `/app/live/${roomId}/leave`,
                    body: JSON.stringify({})
                });
                stompClientRef.current.deactivate();
            }
        };
    }, [roomId]);

    useEffect(() => {
        // Use streamUrl directly from API response (streamKey is not exposed to public)
        if (room && room.streamUrl && videoRef.current) {
            const streamUrl = room.streamUrl;

            if (Hls.isSupported()) {
                const hls = new Hls({
                    liveDurationInfinity: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(videoRef.current);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    videoRef.current.play().catch(e => console.log('Autoplay prevented'));
                });
                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        console.error('HLS Error:', data);
                        // Don't show error if stream just hasn't started yet
                        if (room.status === 'LIVE') {
                            setError('Không thể kết nối đến stream. Vui lòng thử lại.');
                        }
                    }
                });

                return () => hls.destroy();
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = streamUrl;
            }
        }
    }, [room]);

    const fetchRoom = async () => {
        try {
            const data = await getLiveRoom(roomId);
            setRoom(data);
            setViewerCount(data.viewerCount || 0);
        } catch (err) {
            setError('Không tìm thấy phòng live');
        } finally {
            setLoading(false);
        }
    };

    const fetchChats = async () => {
        try {
            const chats = await getRecentChats(roomId);
            setMessages(chats.reverse()); // Newest at bottom

            // Auto scroll to bottom
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        } catch (err) {
            console.error('Error fetching chats:', err);
        }
    };

    // Fetch live products on mount
    const fetchProducts = async () => {
        try {
            const prods = await getLiveProducts(roomId);
            setProducts(prods || []);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    // Call fetchProducts when room is loaded
    useEffect(() => {
        if (room) {
            fetchProducts();
        }
    }, [room]);

    // Handle add to cart
    const handleAddToCart = async (product) => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để mua hàng');
            return;
        }

        setAddingToCart(product.id);
        try {
            await addLiveItemToCart({
                productId: product.productId,
                sizeId: null,
                quantity: 1,
                liveRoomId: roomId,
                liveProductId: product.id,
                livePrice: product.livePrice,
                originalPrice: product.originalPrice
            });
            alert('Đã thêm vào giỏ hàng với giá live!');
        } catch (err) {
            console.error('Error adding to cart:', err);
            alert('Không thể thêm vào giỏ hàng');
        } finally {
            setAddingToCart(null);
        }
    };

    // Send chat message
    const sendChat = () => {
        if (!chatInput.trim() || !stompClientRef.current?.connected || !isLoggedIn) return;

        stompClientRef.current.publish({
            destination: `/app/live/${roomId}/chat`,
            body: JSON.stringify({
                message: chatInput.trim(),
                username: userInfo?.userDetails?.fullName || userInfo?.username || 'Người xem',
                avatarUrl: userInfo?.userDetails?.avatarUrl || null,
                isOwner: false // Regular viewer
            })
        });
        setChatInput('');

        // Auto scroll after sending
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 100);
    };

    if (loading) {
        return (
            <div className="wrapper" style={{ background: '#F5F5F5', minHeight: '100vh' }}>
                <Header />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '60vh'
                }}>
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="wrapper" style={{ background: '#F5F5F5', minHeight: '100vh' }}>
                <Header />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '60vh'
                }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>😢</div>
                    <h2>{error || 'Không tìm thấy phòng live'}</h2>
                    <Link to="/live" className="btn btn-danger mt-3">
                        ← Quay lại danh sách Live
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="wrapper" style={{ background: '#1a1a1a', minHeight: '100vh' }}>
            <Header />
            <main style={{ padding: '20px' }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: '1fr 350px',
                    gap: '20px',
                    minHeight: 'calc(100vh - 200px)'
                }}>
                    {/* Video Section */}
                    <div>
                        {/* Video Player */}
                        <div style={{
                            position: 'relative',
                            background: '#000',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            paddingTop: '56.25%'
                        }}>
                            <video
                                ref={videoRef}
                                controls
                                autoPlay
                                playsInline
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%'
                                }}
                            />

                            {/* Live Badge */}
                            {room.status === 'LIVE' && (
                                <div style={{
                                    position: 'absolute',
                                    top: '15px',
                                    left: '15px',
                                    background: '#ee4d2d',
                                    color: 'white',
                                    padding: '6px 14px',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    zIndex: 10
                                }}>
                                    <span style={{
                                        width: '8px',
                                        height: '8px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        animation: 'pulse 1s infinite'
                                    }}></span>
                                    LIVE
                                </div>
                            )}

                            {/* Viewer Count */}
                            <div style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                fontSize: '13px',
                                zIndex: 10
                            }}>
                                👁 {viewerCount} đang xem
                            </div>
                        </div>

                        {/* Stream Info */}
                        <div style={{
                            background: '#2a2a2a',
                            borderRadius: '8px',
                            padding: '20px',
                            marginTop: '15px'
                        }}>
                            <h1 style={{
                                color: 'white',
                                fontSize: '20px',
                                margin: '0 0 15px'
                            }}>
                                {room.title}
                            </h1>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: '#ee4d2d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    color: 'white',
                                    overflow: 'hidden'
                                }}>
                                    {room.shopAvatarUrl ? (
                                        <img
                                            src={room.shopAvatarUrl}
                                            alt={room.shopName}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : '🏪'}
                                </div>
                                <div>
                                    <div style={{ color: 'white', fontWeight: '600' }}>
                                        {room.shopName || 'Shop'}
                                    </div>
                                    <Link
                                        to={`/shop/${room.shopOwnerId}`}
                                        style={{ color: '#ee4d2d', fontSize: '13px' }}
                                    >
                                        Xem Shop →
                                    </Link>
                                </div>
                            </div>

                            {room.description && (
                                <p style={{
                                    color: '#aaa',
                                    marginTop: '15px',
                                    fontSize: '14px'
                                }}>
                                    {room.description}
                                </p>
                            )}
                        </div>

                        {/* Live Products Section */}
                        {products.length > 0 && (
                            <div style={{
                                background: '#2a2a2a',
                                borderRadius: '8px',
                                padding: '15px',
                                marginTop: '15px'
                            }}>
                                <h3 style={{ color: 'white', fontSize: '16px', margin: '0 0 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    🛍️ Sản phẩm đang Live
                                    <span style={{ background: '#ee4d2d', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>
                                        {products.length}
                                    </span>
                                </h3>
                                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
                                    {products.map(product => (
                                        <div
                                            key={product.id}
                                            style={{
                                                minWidth: '160px',
                                                background: '#333',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                flexShrink: 0,
                                                border: product.isFeatured ? '2px solid #ffc107' : 'none'
                                            }}
                                        >
                                            {/* Product Image */}
                                            <div style={{
                                                height: '120px',
                                                background: '#444',
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {product.productImageUrl ? (
                                                    <img
                                                        src={product.productImageUrl}
                                                        alt={product.productName}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <span style={{ color: '#666', fontSize: '30px' }}>📦</span>
                                                )}
                                                {product.isFeatured && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '5px',
                                                        left: '5px',
                                                        background: '#ffc107',
                                                        color: '#333',
                                                        fontSize: '10px',
                                                        padding: '2px 6px',
                                                        borderRadius: '3px',
                                                        fontWeight: '600'
                                                    }}>
                                                        HOT
                                                    </div>
                                                )}
                                                {product.discountPercent > 0 && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '5px',
                                                        right: '5px',
                                                        background: '#ee4d2d',
                                                        color: 'white',
                                                        fontSize: '10px',
                                                        padding: '2px 6px',
                                                        borderRadius: '3px',
                                                        fontWeight: '600'
                                                    }}>
                                                        -{Math.round(product.discountPercent)}%
                                                    </div>
                                                )}
                                            </div>
                                            {/* Product Info */}
                                            <div style={{ padding: '10px' }}>
                                                <div style={{
                                                    color: 'white',
                                                    fontSize: '13px',
                                                    marginBottom: '8px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {product.productName}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                                                    <span style={{ color: '#ee4d2d', fontWeight: '600', fontSize: '14px' }}>
                                                        ₫{(product.livePrice || 0).toLocaleString()}
                                                    </span>
                                                    {product.originalPrice > product.livePrice && (
                                                        <span style={{
                                                            color: '#888',
                                                            fontSize: '11px',
                                                            textDecoration: 'line-through'
                                                        }}>
                                                            ₫{product.originalPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={addingToCart === product.id}
                                                    style={{
                                                        width: '100%',
                                                        background: addingToCart === product.id ? '#666' : '#ee4d2d',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '8px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        cursor: addingToCart === product.id ? 'not-allowed' : 'pointer'
                                                    }}
                                                >
                                                    {addingToCart === product.id ? 'Đang thêm...' : '🛒 Thêm vào giỏ'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Section */}
                    <div style={{
                        background: '#2a2a2a',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}>
                        {/* Chat Header */}
                        <div style={{
                            padding: '15px 20px',
                            borderBottom: '1px solid #444',
                            color: 'white',
                            fontWeight: '600'
                        }}>
                            💬 Chat trực tiếp
                        </div>

                        {/* Chat Messages */}
                        <div
                            ref={chatContainerRef}
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}
                        >
                            {messages.length === 0 ? (
                                <div style={{
                                    color: '#888',
                                    textAlign: 'center',
                                    marginTop: '50px'
                                }}>
                                    Chưa có tin nhắn nào
                                </div>
                            ) : (
                                messages.map((msg, index) => (
                                    <ChatMessage key={msg.id || index} message={msg} />
                                ))
                            )}
                        </div>

                        {/* Chat Input */}
                        <div style={{
                            padding: '15px',
                            borderTop: '1px solid #444'
                        }}>
                            {isLoggedIn ? (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendChat()}
                                        placeholder="Nhập bình luận..."
                                        style={{
                                            flex: 1,
                                            background: '#444',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '10px 20px',
                                            color: 'white',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        onClick={sendChat}
                                        disabled={!chatInput.trim() || !isConnected}
                                        style={{
                                            background: chatInput.trim() && isConnected ? '#ee4d2d' : '#666',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '10px 20px',
                                            cursor: chatInput.trim() && isConnected ? 'pointer' : 'not-allowed',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Gửi
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    style={{
                                        display: 'block',
                                        background: '#444',
                                        borderRadius: '20px',
                                        padding: '10px 20px',
                                        color: '#888',
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        textAlign: 'center'
                                    }}
                                >
                                    Đăng nhập để chat...
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* CSS */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}

function ChatMessage({ message }) {
    const isSystem = message.type === 'SYSTEM' || message.type === 'ORDER';

    return (
        <div style={{
            display: 'flex',
            gap: '10px',
            padding: isSystem ? '8px 12px' : '0',
            background: isSystem ? (message.type === 'ORDER' ? 'rgba(238, 77, 45, 0.2)' : 'rgba(255,255,255,0.05)') : 'transparent',
            borderRadius: isSystem ? '8px' : '0'
        }}>
            {!isSystem && (
                <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#ee4d2d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: 'white',
                    flexShrink: 0,
                    overflow: 'hidden'
                }}>
                    {message.avatarUrl ? (
                        <img
                            src={message.avatarUrl}
                            alt={message.username}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (message.username?.[0] || '?').toUpperCase()}
                </div>
            )}
            <div style={{ flex: 1 }}>
                {!isSystem && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '2px'
                    }}>
                        <span style={{
                            color: message.isOwner ? '#ffc107' : '#ee4d2d',
                            fontSize: '12px',
                            fontWeight: message.isOwner ? '600' : 'normal'
                        }}>
                            {message.username || 'User'}
                        </span>
                        {message.isOwner && (
                            <span style={{
                                background: '#ffc107',
                                color: '#333',
                                fontSize: '10px',
                                padding: '1px 6px',
                                borderRadius: '3px',
                                fontWeight: '600'
                            }}>
                                CHỦ SHOP
                            </span>
                        )}
                    </div>
                )}
                <div style={{
                    color: isSystem ? '#ffc107' : 'white',
                    fontSize: '14px',
                    wordBreak: 'break-word'
                }}>
                    {message.message}
                </div>
            </div>
        </div>
    );
}

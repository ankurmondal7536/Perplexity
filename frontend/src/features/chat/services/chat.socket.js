import io from 'socket.io-client'

export function initializeSocketConnection() {
   
    const socketUrl = import.meta.env.MODE === 'production'
        || 'https://perplexity-jnxai.onrender.com'
        || 'http://localhost:3000'
    
    console.log('🔌 Socket URL:', socketUrl);
    
    const socket = io(socketUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        withCredentials: true,
        transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
        console.log('✅ Socket connected');
    });

    socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
    });

    return socket;
}
import io from 'socket.io-client'

export function initializeSocketConnection() {
   
    const socketUrl = import.meta.env.MODE === 'production'
        ? 'https://perplexity-jnxai.onrender.com'
        : 'http://localhost:3000'
    
    // console.log('🔌 Socket URL:', socketUrl);
    
    const socket = io(socketUrl, {
       
        withCredentials: true,
        
    });

    socket.on('connect', () => {
        // console.log('✅ Socket connected');
    });

    socket.on('disconnect', () => {
        // console.log('❌ Socket disconnected');
    });

    return socket;
}
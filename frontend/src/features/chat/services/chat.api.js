import axios from 'axios'


const api = axios.create({
    baseURL: import.meta.env.MODE === "production" ? "/" : "http://localhost:3000/",
    withCredentials: true,
})

export const sendMessage = async ({ message, chatId }) => {
    const response = await api.post('/api/chats/message', { message, chat: chatId })
    return response.data
}

export const getChats = async () => {
    const response = await api.get('/api/chats/')
    // console.log('raw API Response:', response)  // <-- debug
    //   console.log('API Response:', response.data)  // <-- debug 
    return response.data
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`)
    return response.data
}
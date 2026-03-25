import { initializeSocketConnection } from "../services/chat.socket"
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api"
import { setChats, setCurrentChatId, setIsLoading, setError } from "../chat.slice"
import { useDispatch } from "react-redux"
import { sendMessageThunk, fetchChatsThunk, fetchMessagesThunk } from "../chat.slice"


export const useChat = () => {
    const dispatch = useDispatch()

    const handleSendMessage = async ({ message, chatId }) => {
        // console.log('🔍 useChat - message:', message)  // ← debug
        // console.log('🔍 useChat - chatId:', chatId)  // ✅ Ye undefined तो नहीं?

        try {
            const result = await dispatch(sendMessageThunk({ message, chatId }))
            // console.log('🔍 Dispatch result:', result)  // debug 
            return result
        } catch (error) {
            console.error('Error:', error)
        }
    }


    const handleFetchChats = async () => {
        // console.log('handleFetchChats called')  // <-- debug
        const result = await dispatch(fetchChatsThunk())
        // console.log('Thunk result:', result)    // <-- debug
        return result
    }

    const handleFetchMessages = async (chatId) => {
        // console.log('handleFetchMessages called with chatID:', chatId)  // <-- debug
        try {
            // console.log('Thunk running for fetching messages for:', chatId)  // <-- debug
            const result = await dispatch(fetchMessagesThunk(chatId))
            // console.log('Thunk result:', result)    // <-- debug

            return result
        } catch (error) {
            console.log('Error:', error)  // <-- debug
            return error
        }
    }

    const initSocket = () => {
        initializeSocketConnection()
    }

    return {
        handleSendMessage,
        handleFetchMessages,
        handleFetchChats,
        initSocket
    }
}
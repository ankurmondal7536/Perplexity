import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as chatAPI from './services/chat.api.js'



const initialState = {
    chats: {},             //sabhi chats ka data
    currentChatId: null,    //current selected chat
    messages: [],           //current chat messages
    isLoading: false,
    error: null
}





// Async thunk for fetching chats
export const fetchChatsThunk = createAsyncThunk(
    'chat/fetchChats',
    async (_, { rejectWithValue }) => {
        try {
            // console.log('Thunk running')  // <-- debug  
            const response = await chatAPI.getChats()
            // console.log('Thunk response:', response)  // <-- debug

            return response.chats || []
        } catch (error) {
            console.log('Thunk error:', error)  // <-- debug
            return rejectWithValue(error.message)
        }
    }
)
// async thunk for sending messages
export const fetchMessagesThunk = createAsyncThunk(
    'chat/fetchMessages',
    async (chatId, { rejectWithValue }) => {
        try {
            // console.log('fetching messages for chatId:', chatId)  // <-- debug
            const response = await chatAPI.getMessages(chatId)
            // console.log('Messages response:', response)  // <-- debug
            return response.messages  // Backend se messages array aayega
        } catch (error) {
            console.log('Error:', error)  // <-- debug
            return rejectWithValue(error.message)
        }
    }
)

// Send message
export const sendMessageThunk = createAsyncThunk(
    'chat/sendMessage',
    async ({ message, chatId }, { rejectWithValue }) => {
        try {
            const response = await chatAPI.sendMessage({ message, chatId })
            return response  // { chat, aiMessage }
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

// Delete chat
export const deleteChatThunk = createAsyncThunk(
    'chat/deleteChat',
    async (chatId, { rejectWithValue }) => {
        try {
            await chatAPI.deleteChat(chatId)
            return chatId  // Return id to delete from state
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)


const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // setChats: (state, action) => {
        //     state.chats = action.payload
        // },
        // setCurrentChatId: (state, action) => {
        //     state.currentChatId = action.payload
        // },
        // setIsLoading: (state, action) => {
        //     state.isLoading = action.payload
        // },
        // setError: (state, action) => {
        //     state.error = action.payload
        // }
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
            state.messages = []  // Clear messages when chat changes
        },
        clearError: (state) => {
            state.error = null
        }
    },
    // ✅ Extra reducers (for async thunks)
    extraReducers: (builder) => {
        builder
            // ============ FETCH CHATS ============
            .addCase(fetchChatsThunk.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchChatsThunk.fulfilled, (state, action) => {
                // Convert array to object for easy access
                // console.log('=== FULFILLED CASE ===')
                // console.log('1. Payload:', action.payload)
                // console.log('2. Payload length:', action.payload?.length)
                // console.log('3. First item:', action.payload[0])
                // console.log('4. First item _id:', action.payload[0]?._id)
                // console.log('Chats fulfilled:', action.payload)  // <-- debug
                state.chats = action.payload.reduce((acc, chat) => {
                    acc[chat._id] = chat
                    return acc
                }, {})
                // console.log("state.chats:", state.chats)  // <-- debug 
                state.isLoading = false
            })
            .addCase(fetchChatsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })

            // ============ FETCH MESSAGES ============
            .addCase(fetchMessagesThunk.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
                state.messages = action.payload
                state.isLoading = false
            })
            .addCase(fetchMessagesThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })

            // ============ SEND MESSAGE ============
            .addCase(sendMessageThunk.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(sendMessageThunk.fulfilled, (state, action) => {
                // console.log("Message send MS.F", action.payload)     //for debug
                const { chat, title } = action.payload
                if (!chat || !chat._id) return

                // Check if chat already exists
                if (!state.chats[chat._id]) {
                    // create new chat
                    state.chats[chat._id] = {
                        _id: chat._id,
                        title: title || 'New Chat',
                        messages: chat.messages || [],
                        createdAt: new Date().toISOString(),
                        lastMessage: chat.messages?.[chat.messages.length - 1]?.content || ''
                    }
                    // console.log('New chat created:', chat._id)  // ← debug 
                } else {
                    // Existing chat update करो
                    state.chats[chat._id] = {
                        ...state.chats[chat._id],
                        messages: chat.messages || []
                    }
                    // console.log('Existing chat updated:', chat._id)  // ← debug
                }
                // IMPORTANT: set currentChatId
                state.currentChatId = chat._id
                // console.log('Current chat ID set to:', chat._id)  // ← debug

                // Update messages array
                state.messages = chat.messages || []
                state.isLoading = false
                state.error = null



            

            })
            .addCase(sendMessageThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
                console.log('❌ Error in sendMessageThunk:', action.payload)
            })

            // ============ DELETE CHAT ============
            .addCase(deleteChatThunk.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteChatThunk.fulfilled, (state, action) => {
                const chatId = action.payload
                delete state.chats[chatId]
                if (state.currentChatId === chatId) {
                    state.currentChatId = null
                    state.messages = []
                }
                state.isLoading = false
            })
            .addCase(deleteChatThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})


export const { setCurrentChatId, clearError } = chatSlice.actions
export const { setChats, setIsLoading, setError } = chatSlice.actions
export default chatSlice.reducer
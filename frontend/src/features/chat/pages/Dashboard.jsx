import React, { useState, useEffect } from 'react'
import { Menu, X, Plus, Send, Paperclip, ChevronDown } from 'lucide-react'
import "../global/global.css"
import { setCurrentChatId, setIsLoading } from '../chat.slice'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat.js'

export default function Dashboard() {
    // ============= STATE MANAGEMENT =============



    const dispatch = useDispatch()
    const { handleSendMessage, handleFetchMessages, handleFetchChats, initSocket } = useChat()

    // adding redux state
    const { chats, currentChatId,messages,isLoading, error } = useSelector(state => state.chat)
    // console.log('All chats:', useSelector(state => state.chat.chats))  // ← debug   
    const { user } = useSelector(state => state.auth)

    //current chat ka data
    const currentChat = chats[currentChatId]
    // const messages = currentChat?.messages || []
    // console.log("all messages:", messages)     //for debug

    const recentChats = Object.values(chats).map(chat => ({


        id: chat._id,
        title: chat.title,
        createdAt: chat.createdAt,
        lastMessage: chat.lastMessage 
        ? (chat.lastMessage.length > 50 
            ? chat.lastMessage.substring(0, 50) + '...'
            : chat.lastMessage)
        : 'No messages yet'

    } )  )
    // console.log("recentChats:", recentChats)     //for debug ie checking recentchats

    // using useEffect to initialize socket connection
    useEffect(() => {
        // console.log('useEffect running')  // <-- debug
        initSocket()
        handleFetchChats()

    }, [])

    // using useffect to fetch messages when a chat is selected
    useEffect(() => {
        if (currentChatId) {
            // calling api - 
            // console.log("chat selected", currentChatId)  // <-- debug 
            handleFetchMessages(currentChatId)
            // console.log("after handleFetchChats")  // <-- debug
        }
    }, [currentChatId])

    //local state
    const [sidebarOpen, setSidebarOpen] = useState(false) // Default false on mobile
    const [inputValue, setInputValue] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)






    // const recentChats = [
    //     { id: 1, title: 'System design kya hai', createdAt: 'Today', lastMessage: '2 hours ago' },
    //     { id: 2, title: 'LangChain aur Mistral AI', createdAt: 'Yesterday', lastMessage: '5 hours ago' },
    //     { id: 3, title: 'React hooks', createdAt: '2 days ago', lastMessage: '1 day ago' },
    // ]

    // const currentChat = recentChats.find(chat => chat.id === currentChatId)

    // ============= HANDLERS =============
    const handleNewChat = () => {
        // backend pe naya chat create hoga
        // const newChat = auait createChat()
        dispatch(setCurrentChatId(null))
        setInputValue('')
    }

    const handleSelectChat = (chatId) => {
        dispatch(setCurrentChatId(chatId))
        setSidebarOpen(false)
    }

    const handleSendMsg = async () => {
        console.log("inputValue:", inputValue)     //for debug
        console.log("currentChatId:", currentChatId)     //for debug
        if (!inputValue.trim() || !currentChatId) {
            console.log("inputValue or currentChatId is empty")     //for debug
            return
        }
        
        console.log("sending follow-up message to chatId:", currentChatId)     //for debug
        // setIsLoading(true)

       try{
         await handleSendMessage({
            message: inputValue,
            chatId: currentChatId
        })
        setInputValue('')
        setSelectedFile(null)
       }
       catch(error){
           console.log("Error:", error)     //for debug
       }






        // setMessages([...messages, userMessage])
        // setInputValue('')
        // setSelectedFile(null)
        // setIsLoading(true)

        // setTimeout(() => {
        //     const aiMessage = {
        //         id: Date.now() + 1,
        //         type: 'ai',
        //         content: 'Ye AI ka response hoga.',
        //         timestamp: new Date(),
        //         model: 'Mistral AI'
        //     }
        //     setMessages(prev => [...prev, aiMessage])
        //     setIsLoading(false)
        // }, 1500)
    }

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile({
                name: file.name,
                size: file.size,
                type: file.type
            })
        }
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-[#0f0f1e] via-zinc-950 to-[#1a1a2e] text-zinc-100 overflow-hidden">

            {/* ============= SIDEBAR ============= */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/95 backdrop-blur-xl border-r border-[#31b8c6]/20 transition-transform duration-300 overflow-y-auto md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-3 md:block border-b border-[#31b8c6]/20">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-[#31b8c6] to-[#45c7d4] bg-clip-text text-transparent">
                        JNXAI
                    </h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1 hover:bg-zinc-800 rounded-lg transition md:hidden"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Desktop Header - Above New Chat Button */}
                <div className="hidden md:block p-4 border-b border-[#31b8c6]/20">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#31b8c6] to-[#45c7d4] bg-clip-text text-transparent">
                        JNXAI
                    </h1>
                    <p className="text-xs text-zinc-400 mt-1">AI Chat</p>
                </div>

                {/* New Chat Button */}
                <button
                    onClick={handleNewChat}
                    className="mx-3 mt-3 w-[calc(100%-1.5rem)] flex items-center justify-center gap-2 bg-gradient-to-r from-[#31b8c6] to-[#45c7d4] text-zinc-950 font-semibold py-2 px-3 rounded-lg hover:shadow-lg hover:shadow-[#31b8c6]/40 transition text-sm md:text-base"
                >
                    <Plus size={16} />
                    New Chat
                </button>



                {/* Recent Chats */}
                <div className="px-3 py-4">
                    <p className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">
                        Recent Chats
                    </p>
                    <div className="space-y-2">
                        {recentChats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => handleSelectChat(chat.id)}
                                className={`w-full text-left p-2 rounded-lg transition group border text-sm ${currentChatId === chat.id
                                    ? 'bg-[#31b8c6]/20 border-[#31b8c6]/40'
                                    : 'border-transparent hover:bg-zinc-900/50'
                                    }`}
                            >
                                <p className="text-xs font-medium truncate group-hover:text-[#31b8c6] transition line-clamp-2">
                                    {chat.title}
                                </p>
                                <p className="text-xs text-zinc-500 mt-0.5">{chat.lastMessage}</p>
                                {/* {console.log("( DEBUG )chat.lastMessage:", chat.lastMessage)}    // ← debug  */}
                            </button>
                        ))}
                    </div>
                </div>

                {/* User Profile */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#31b8c6]/20 bg-black/50 backdrop-blur">
                    <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-900/50 transition group border border-transparent hover:border-[#31b8c6]/30">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#31b8c6] to-[#45c7d4] flex items-center justify-center font-bold text-zinc-950 flex-shrink-0 text-xs">
                            {user?.avatar || "U"}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-semibold truncate group-hover:text-[#31b8c6]">
                                {user?.username || "User"}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">{user?.email || "user@user.com"}</p>
                        </div>
                    </button>
                </div>
            </aside>

            {/* ============= MAIN CONTENT ============= */}
            <div className="flex-1 flex flex-col w-full">

                {/* ============= HEADER ============= */}
                <div className="flex items-center gap-2 p-2 md:p-4 border-b border-[#31b8c6]/20 bg-black/40 backdrop-blur-sm flex-shrink-0">
                    {/* Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden p-1.5 hover:bg-zinc-800 rounded-lg transition flex-shrink-0"
                    >
                        <Menu size={18} />
                    </button>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                        {currentChat ? (
                            <>
                                <h2 className="text-sm md:text-lg font-semibold text-zinc-100 truncate">
                                    {currentChat.title}
                                </h2>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    {new Date(currentChat.createdAt).toLocaleDateString()}
                                </p>
                            </>
                        ) : (
                            <h2 className="text-sm md:text-lg font-semibold text-zinc-400">
                                New Chat
                            </h2>
                        )}
                    </div>
                </div>

                {/* ============= MESSAGES ============= */}
                <div className="flex-1 overflow-y-auto px-2 md:px-4 py-4 space-y-3 md:space-y-6 scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center flex-col gap-3">
                            <div className="text-4xl md:text-6xl animate-bounce">✨</div>
                            <p className="text-zinc-400 text-center text-xs md:text-sm max-w-sm px-2">
                                {currentChat ? 'Ask a question' : 'Create new chat'}
                            </p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={msg._id || `msg-${index}`}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs md:max-w-2xl px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base ${msg.role === 'user'
                                        ? 'bg-gradient-to-b from-[#1a3a3f] to-[#2a5a6f] text-zinc-100'
                                        : 'bg-zinc-900/60 border border-[#31b8c6]/20 text-zinc-100 rounded-bl-none'
                                        }`}
                                >
                                    <p className="leading-relaxed break-words whitespace-pre-wrap">
                                        {msg.content}
                                    </p>
                                    <div className="flex items-center justify-between gap-2 mt-2">
                                        <p
                                            className={`text-xs ${msg.role === 'user' ? 'text-zinc-800' : 'text-zinc-500'
                                                }`}
                                        >
                                            {msg.timestamp?.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        {msg.role === 'ai' && msg.model && (
                                            <p className="text-xs text-[#31b8c6]">{msg.model}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-900/60 border border-[#31b8c6]/20 px-3 py-2 md:px-4 md:py-3 rounded-lg rounded-bl-none">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-[#31b8c6] animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 rounded-full bg-[#31b8c6] animate-bounce"
                                        style={{ animationDelay: '0.1s' }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 rounded-full bg-[#31b8c6] animate-bounce"
                                        style={{ animationDelay: '0.2s' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ============= INPUT AREA ============= */}
                <div className="border-t border-[#31b8c6]/20 bg-black/40 backdrop-blur-sm p-2 md:p-4 flex-shrink-0">
                    <div className="max-w-4xl mx-auto">
                        {selectedFile && (
                            <div className="mb-2 p-2 bg-zinc-900/50 border border-[#31b8c6]/20 rounded-lg flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1 min-w-0">
                                    <Paperclip size={14} className="text-[#31b8c6] flex-shrink-0" />
                                    <span className="text-zinc-300 truncate">{selectedFile.name}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedFile(null)}
                                    className="text-zinc-500 hover:text-red-400 transition flex-shrink-0"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {/* Input Row */}
                        <div className="flex gap-2">
                            {/* File Button */}
                            <label className="p-1.5 md:p-2 hover:bg-zinc-800 rounded-lg cursor-pointer transition flex-shrink-0">
                                <Paperclip
                                    size={16}
                                    className="text-zinc-400 hover:text-[#31b8c6] transition md:w-5 md:h-5"
                                />
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    disabled={isLoading}
                                />
                            </label>

                            {/* Input */}
                            <input
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && !isLoading && handleSendMsg()}
                                placeholder="Question pocho..."
                                className="flex-1 bg-zinc-900/60 border border-[#31b8c6]/30 rounded-lg px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#31b8c6] focus:ring-1 focus:ring-[#31b8c6]/30 transition disabled:opacity-50"
                                disabled={isLoading}
                            />

                            {/* Send Button */}
                            <button
                                onClick={handleSendMsg}
                                disabled={isLoading || !inputValue.trim() || !currentChatId}
                                className="p-1.5 md:p-2 bg-gradient-to-r from-[#31b8c6] to-[#45c7d4] hover:shadow-lg hover:shadow-[#31b8c6]/40 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            >
                                <Send size={16} className="text-zinc-950 md:w-5 md:h-5" />
                            </button>
                        </div>

                        {/* Model Info */}
                        <p className="text-xs text-zinc-500 mt-2 text-center">
                            Using: <span className="text-[#31b8c6]">Mistral AI</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    )
}
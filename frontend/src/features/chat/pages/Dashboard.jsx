import React, { useState, useEffect, useRef } from 'react'
import { Menu, X, Plus, Send, Loader } from 'lucide-react'
import "../global/global.css"
import { setCurrentChatId } from '../chat.slice'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat.js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Dashboard() {
    const messagesEndRef = useRef(null)
    const dispatch = useDispatch()
    const { handleSendMessage, handleFetchMessages, handleFetchChats, initSocket } = useChat()

    const { chats, currentChatId, messages, isLoading } = useSelector(state => state.chat)
    const { user } = useSelector(state => state.auth)

    const currentChat = chats[currentChatId]

    const recentChats = Object.values(chats).map(chat => ({
        id: chat._id,
        title: chat.title,
        createdAt: chat.createdAt,
        lastMessage: chat.lastMessage
            ? (chat.lastMessage.length > 50
                ? chat.lastMessage.substring(0, 50) + '...'
                : chat.lastMessage)
            : 'No messages yet'
    }))

    useEffect(() => {
        initSocket()
        handleFetchChats()
    }, [])

    useEffect(() => {
        if (currentChatId) {
            handleFetchMessages(currentChatId)
        }
    }, [currentChatId])

    useEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }, [messages])

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const handleNewChat = () => {
        dispatch(setCurrentChatId(null))
        setInputValue('')
    }

    const handleSelectChat = (chatId) => {
        dispatch(setCurrentChatId(chatId))
        setSidebarOpen(false)
    }

    const handleSendMsg = async () => {
        if (!inputValue.trim()) return

        try {
            await handleSendMessage({
                message: inputValue,
                chatId: currentChatId
            })
            setInputValue('')
        }
        catch (error) {
            console.error("Error sending message:", error)
        }
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-[#0f0f1e] via-zinc-950 to-[#1a1a2e] text-zinc-100 overflow-hidden">

            {/* ============= SIDEBAR ============= */}
            <aside
                className={`fixed flex flex-col inset-y-0 left-0 z-50 w-64 bg-black/95 backdrop-blur-xl border-r border-[#31b8c6]/20 transition-transform duration-300 overflow-y-auto md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-3 md:block border-b border-[#31b8c6]/20">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-[#31b8c6] to-[#45c7d4] bg-clip-text text-transparent">
                        JNXAI
                    </h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1 hover:bg-zinc-800 rounded-lg transition md:hidden">
                        <X size={18} />
                    </button>
                </div>

                {/* Desktop Header */}
                <div className="hidden shrink-0 md:block p-4 border-b border-[#31b8c6]/20">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#31b8c6] to-[#45c7d4] bg-clip-text text-transparent">
                        JNXAI
                    </h1>
                </div>

                {/* New Chat Button */}
                <button
                    onClick={handleNewChat}
                    disabled={isLoading}
                    className="mx-3 mt-3 w-[calc(100%-1.5rem)] shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-[#31b8c6] to-[#45c7d4] text-zinc-950 font-semibold py-2 px-3 rounded-lg hover:shadow-lg hover:shadow-[#31b8c6]/40 transition text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader size={16} className="animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            <Plus size={16} />
                            <span>New Chat</span>
                        </>
                    )}
                </button>

                {/* Recent Chats */}
                <div className="px-3 py-4 flex-1 overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <p className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">
                        Recent Chats
                    </p>
                    <div className="space-y-3">
                        {isLoading && recentChats.length === 0 ? (
                            <>
                                <div className="animate-pulse space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-full p-3 rounded-lg bg-zinc-900/30 border border-[#31b8c6]/10">
                                            <div className="h-3 bg-[#31b8c6]/20 rounded w-3/4 mb-2"></div>
                                            <div className="h-2 bg-[#31b8c6]/10 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            recentChats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => handleSelectChat(chat.id)}
                                    disabled={isLoading}
                                    className={`w-full text-left p-3 rounded-lg transition group border text-sm disabled:opacity-60 disabled:cursor-not-allowed ${currentChatId === chat.id
                                        ? 'bg-[#31b8c6]/20 border-[#31b8c6]/40'
                                        : 'border-transparent hover:bg-zinc-900/50'
                                        }`}
                                >
                                    <p className="text-xs font-medium truncate group-hover:text-[#31b8c6] transition line-clamp-2">
                                        {chat.title}
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-0.5">{chat.lastMessage}</p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* User Profile */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t shrink-0 border-[#31b8c6]/20 bg-black/50 backdrop-blur">
                    <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-900/50 transition group border border-transparent hover:border-[#31b8c6]/30">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#31b8c6] to-[#45c7d4] flex items-center justify-center font-bold text-zinc-950 flex-shrink-0 text-xs">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
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
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden p-1.5 hover:bg-zinc-800 rounded-lg transition flex-shrink-0"
                    >
                        <Menu size={18} />
                    </button>

                    <div className="flex-1 min-w-0">
                        {isLoading && !currentChat ? (
                            <div className="animate-pulse">
                                <div className="h-5 bg-zinc-700/30 rounded w-1/3 mb-1"></div>
                                <div className="h-3 bg-zinc-800/30 rounded w-1/4"></div>
                            </div>
                        ) : currentChat ? (
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
                <div className="flex-1 overflow-y-auto px-2 md:px-4 py-4 space-y-3 md:space-y-5 scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center flex-col gap-3">
                            {isLoading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative w-16 h-16">
                                        <div className="absolute inset-0 border-4 border-[#31b8c6]/20 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-transparent border-t-[#31b8c6] border-r-[#31b8c6] rounded-full animate-spin"></div>
                                    </div>
                                    <p className="text-zinc-400 text-center text-xs md:text-sm">Loading your messages...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="text-4xl md:text-6xl animate-bounce">✨</div>
                                    <p className="text-zinc-400 text-center text-xs md:text-sm max-w-sm px-2">
                                        {currentChat ? 'Ask a question' : 'Create new chat'}
                                    </p>
                                </>
                            )}
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
                                    <div className="leading-relaxed break-words whitespace-pre-wrap">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                a: ({ node, ...props }) => (
                                                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300" />
                                                ),
                                                table: ({ node, ...props }) => (
                                                    <div className="overflow-x-auto my-4 border rounded-lg">
                                                        <table {...props} className="min-w-full divide-y divide-gray-700 font-mono text-sm" />
                                                    </div>
                                                ),
                                                thead: ({ node, ...props }) => <thead {...props} className="bg-gradient-to-r from-cyan-500 to-cyan-400" />,
                                                th: ({ node, ...props }) => <th {...props} className="px-4 py-2 text-left text-gray-900 font-bold border-b" />,
                                                td: ({ node, ...props }) => <td {...props} className="px-4 py-2 border-b border-gray-700" />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 mt-2">
                                        <p className={`text-xs ${msg.role === 'user' ? 'text-zinc-800' : 'text-zinc-500'}`}>
                                            {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], {
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

                    {isLoading && messages.length > 0 && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-900/60 border border-[#31b8c6]/20 px-3 py-2 md:px-4 md:py-3 rounded-lg rounded-bl-none">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-[#31b8c6] animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-[#31b8c6] animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-[#31b8c6] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* ============= INPUT AREA ============= */}
                <div className="border-t border-[#31b8c6]/20 bg-black/40 backdrop-blur-sm p-2 md:p-4 flex-shrink-0">
                    <div className="max-w-4xl mx-auto flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !isLoading && handleSendMsg()}
                            placeholder="Question pocho..."
                            className="flex-1 bg-zinc-900/60 border border-[#31b8c6]/30 rounded-lg px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#31b8c6] focus:ring-1 focus:ring-[#31b8c6]/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        />

                        <button
                            onMouseDown={handleSendMsg}
                            disabled={isLoading || !inputValue.trim()}
                            className="p-1.5 md:p-2 bg-gradient-to-r from-[#31b8c6] to-[#45c7d4] hover:shadow-lg hover:shadow-[#31b8c6]/40 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center relative"
                        >
                            {isLoading ? (
                                <Loader size={16} className="text-zinc-950 md:w-5 md:h-5 animate-spin" />
                            ) : (
                                <Send size={16} className="text-zinc-950 md:w-5 md:h-5" />
                            )}
                        </button>
                    </div>

                    <p className="text-xs text-zinc-500 mt-2 text-center">
                        <span className="text-[#31b8c6]">JNX AI</span>
                    </p>
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onMouseDown={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    )
}
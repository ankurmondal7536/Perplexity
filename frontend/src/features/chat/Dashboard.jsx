import React from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../chat/hooks/useChat.js'
import { useEffect } from 'react'

const Dashboard = () => {
    const { user } = useSelector(state => state.auth)
    const chat = useChat()
    useEffect(() => {
        chat.initializeSocketConnection()
    }, [])


    return (
        <>
            <h1>Dashboard</h1>
            {/* {console.log(user)}  // ← debug */}
        </>
    )
}

export default Dashboard
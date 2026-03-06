import { useEffect, useState } from "react";
import { api } from "../config";
import "./ChatSidebar.css";

interface ChatSidebarProps {
    setChat: (chat: string) => void;
    currentChat?: string;
    refreshTrigger?: number;
}

export default function ChatSidebar({setChat, currentChat, refreshTrigger}: ChatSidebarProps) {

const [chats,setChats] = useState<string[]>([])
const [selectedChat, setSelectedChat] = useState<string>("")

useEffect(()=>{
 loadChats()
},[])

// Refresh chat list when currentChat changes (new chat created)
useEffect(() => {
    if (currentChat) {
        setSelectedChat(currentChat)
        loadChats()
    }
}, [currentChat])

// Refresh chat list when refreshTrigger changes (after message sent)
useEffect(() => {
    if (refreshTrigger !== undefined) {
        loadChats()
    }
}, [refreshTrigger])

const loadChats = async ()=>{
 const res = await api.get("/chats")
 setChats(res.data)
}

const handleNewChat = async () => {
    const name = prompt("Enter chat name")
    if(name && name.trim()) {
        const chatName = name.trim()
        setChat(chatName)
        setSelectedChat(chatName)
        // Refresh the chat list to show the new chat
        await loadChats()
    }
}

const handleChatSelect = (chatName: string) => {
    setChat(chatName)
    setSelectedChat(chatName)
}

return (
<div className="chat-sidebar">
    
    {/* Header */}
    <div className="chat-sidebar-header">
        <div className="chat-sidebar-brand">
            <h1 className="chat-sidebar-title">
                NanoReplica
            </h1>
            <p className="chat-sidebar-subtitle">AI Chat Assistant</p>
        </div>
        
        <button
            className="chat-sidebar-new-button"
            onClick={handleNewChat}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
        </button>
    </div>

    {/* Chat List */}
    <div className="chat-sidebar-list">
        {chats.length === 0 ? (
            <div className="chat-sidebar-empty">
                <div className="chat-sidebar-empty-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <p className="chat-sidebar-empty-title">No conversations yet</p>
                <p className="chat-sidebar-empty-text">Create a new chat to get started</p>
            </div>
        ) : (
            <div className="chat-sidebar-chats">
                {chats.map((c)=>(
                    <div
                        key={c}
                        className={`chat-sidebar-item ${selectedChat === c ? 'selected' : ''}`}
                        onClick={() => handleChatSelect(c)}
                    >
                        <div className="chat-sidebar-item-content">
                            <div className={`chat-sidebar-item-dot ${selectedChat === c ? 'selected' : ''}`}></div>
                            <span className="chat-sidebar-item-name">{c}</span>
                            <svg className="chat-sidebar-item-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>

    {/* Footer */}
    <div className="chat-sidebar-footer">
        <div className="chat-sidebar-footer-text">
            Powered by Gemini AI
        </div>
    </div>

</div>
)
}
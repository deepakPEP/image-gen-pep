import { useEffect, useState } from "react"
import { api } from "../config"
import ChatSidebar from "../components/ChatSidebar"
import ChatWindow, { type ReplyPayload } from "../components/ChatWindow"
import MessageInput from "../components/MessageInput"
import "./ChatPage.css"

export default function ChatPage(){

const [chat,setChat] = useState("")
const [messages,setMessages] = useState([])
const [refreshTrigger, setRefreshTrigger] = useState(0)
const [replyTo, setReplyTo] = useState<ReplyPayload | null>(null)

const loadChat = async ()=>{

if(!chat) return

const res = await api.get(`/chat/${chat}`)

setMessages(res.data.messages)
// Trigger sidebar refresh after loading messages
setRefreshTrigger(prev => prev + 1)

}

useEffect(()=>{
loadChat()
},[chat])

return(

<div className="chat-page">

<ChatSidebar setChat={setChat} currentChat={chat} refreshTrigger={refreshTrigger}/>

<div className="chat-page-main">

{chat && (
    <div className="chat-page-header">
        <div className="chat-page-header-container">
            <h2 className="chat-page-header-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {chat}
            </h2>
        </div>
    </div>
)}

<ChatWindow messages={messages} onReply={setReplyTo}/>

{chat && <MessageInput chat={chat} refresh={loadChat} replyTo={replyTo} onReplyConsumed={() => setReplyTo(null)}/>}

</div>

</div>

)

}
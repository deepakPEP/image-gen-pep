import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { apiUrl } from "../config"
import "./MessageInput.css"

interface ReplyToPayload {
    text: string;
    images?: Array<{ data: string; mime_type: string }>;
}

interface MessageInputProps {
    chat : string;
    refresh : () => void;
    replyTo?: ReplyToPayload | null;
    onReplyConsumed?: () => void;
}

function formatAsQuotedReply(raw: string): string {
    const quoted = raw.split("\n").map((line) => `> ${line}`).join("\n")
    return `${quoted}\n\n`
}

function base64ToFile(base64: string, mimeType: string, filename: string): File {
    const byteChars = atob(base64)
    const byteNumbers = new Array(byteChars.length).fill(0).map((_, i) => byteChars.charCodeAt(i))
    const blob = new Blob([new Uint8Array(byteNumbers)], { type: mimeType })
    return new File([blob], filename, { type: mimeType })
}

export default function MessageInput({chat, refresh, replyTo, onReplyConsumed}: MessageInputProps){

const [text,setText] = useState("")
const [file,setFile] = useState<File|null>(null)

useEffect(() => {
    if (!replyTo?.text?.trim()) return
    setText((prev) => (prev ? `${prev}\n\n${formatAsQuotedReply(replyTo.text)}` : formatAsQuotedReply(replyTo.text)))
    if (replyTo.images && replyTo.images.length > 0) {
        const first = replyTo.images[0]
        const ext = first.mime_type === "image/png" ? "png" : first.mime_type === "image/jpeg" ? "jpg" : "png"
        setFile(base64ToFile(first.data, first.mime_type, `reply-image.${ext}`))
    }
    onReplyConsumed?.()
}, [replyTo])
const [isSending, setIsSending] = useState(false)
const fileInputRef = useRef<HTMLInputElement>(null)
const textareaRef = useRef<HTMLTextAreaElement>(null)

const send = async()=>{
if(!text.trim() && !file) return

setIsSending(true)

try {
const form = new FormData()

form.append("chat_name",chat)
form.append("prompt",text)

if(file) form.append("file",file)

    await axios.post(apiUrl("/chat"), form)

setText("")
setFile(null)
if(fileInputRef.current) {
    fileInputRef.current.value = ""
}
if(textareaRef.current) {
    textareaRef.current.style.height = "auto"
}

refresh()
} catch (error) {
    console.error("Error sending message:", error)
} finally {
    setIsSending(false)
}
}

const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        send()
    }
}

const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
}

return(

<div className="message-input">
    <div className="message-input-container">
        
        {file && (
            <div className="message-input-file-preview">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="message-input-file-name">{file.name}</span>
                <button
                    onClick={() => {
                        setFile(null)
                        if(fileInputRef.current) fileInputRef.current.value = ""
                    }}
                    className="message-input-file-remove"
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        )}

        <div className="message-input-wrapper">

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e)=>setFile(e.target.files?.[0]||null)}
                className="message-input-file-input"
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                className="message-input-attach-button"
                title="Attach image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </button>

            <textarea
                ref={textareaRef}
                className="message-input-textarea"
                value={text}
                onChange={handleInput}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
            />

            <button
                className="message-input-send-button"
                onClick={send}
                disabled={isSending || (!text.trim() && !file)}
            >
                {isSending ? (
                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                )}
            </button>

        </div>

    </div>
</div>

)

}
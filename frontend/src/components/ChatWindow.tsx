import { useEffect, useRef, useState } from "react";
import "./ChatWindow.css";

export interface ReplyPayload {
    text: string;
    images?: Array<{ data: string; mime_type: string }>;
}

interface ChatWindowProps {
    messages: { role: string; text: string | null; images?: Array<{ data: string; mime_type: string }> | null }[];
    onReply?: (payload: ReplyPayload) => void;
}

function getMessageReplyPayload(m: { role: string; text: string | null; images?: Array<{ data: string; mime_type: string }> | null }): ReplyPayload {
    const parts: string[] = [];
    if (m.text?.trim()) parts.push(m.text.trim());
    if (m.images && m.images.length > 0) parts.push(`[${m.images.length} image(s) in this message]`);
    return {
        text: parts.join("\n") || "(no text)",
        images: m.images && m.images.length > 0 ? m.images : undefined,
    };
}

export default function ChatWindow({messages, onReply}: ChatWindowProps){
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [imageModal, setImageModal] = useState<{ data: string; mime_type: string } | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleDownloadImage = (img: { data: string; mime_type: string }) => {
        const extension = img.mime_type === "image/png" ? "png" : img.mime_type === "image/jpeg" ? "jpg" : "png";
        const link = document.createElement("a");
        link.href = `data:${img.mime_type};base64,${img.data}`;
        link.download = `generated-image.${extension}`;
        link.click();
    };

    return(
    
    <div className="chat-window">
        <div className="chat-window-container">
    
        {messages.length === 0 && (
            <div className="chat-window-empty">
                <div className="chat-window-empty-content">
                    <div className="chat-window-empty-icon-wrapper">
                        <div className="chat-window-empty-icon-circle">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="chat-window-empty-title">Start a conversation</h2>
                    <p className="chat-window-empty-text">Send a message to begin chatting with AI</p>
                </div>
            </div>
        )}
        
        <div className="chat-window-messages">
        {messages.map((m,i)=>(
            <div
                key={i}
                className={`chat-message ${m.role}`}
            >
                {m.role === "assistant" && (
                    <div className="chat-message-avatar assistant">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                )}
                
                <div className={`chat-message-content-wrapper ${m.role}`}>
                    <div className={`chat-message-bubble ${m.role}`}>
                        {m.text && (
                            <div className="chat-message-text">
                                {m.text}
                            </div>
                        )}
                        
                        {onReply && (
                            <button
                                type="button"
                                className="chat-message-reply-btn"
                                onClick={() => onReply(getMessageReplyPayload(m))}
                                title="Reply to this message"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                </svg>
                                Reply
                            </button>
                        )}
                        
                        {m.images && m.images.length > 0 && (
                            <div className="chat-message-images">
                                {m.images.map((img, imgIdx) => (
                                    <div
                                        key={imgIdx}
                                        className="chat-message-image-wrapper chat-message-image-clickable"
                                        onClick={() => setImageModal(img)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === "Enter" && setImageModal(img)}
                                        aria-label="Open image in modal"
                                    >
                                        <img
                                            src={`data:${img.mime_type};base64,${img.data}`}
                                            alt={`Generated image ${imgIdx + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {m.role === "user" && (
                    <div className="chat-message-avatar user">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                )}
            </div>
        ))}
        </div>
        
        <div ref={messagesEndRef} />
        </div>

        {imageModal && (
            <div
                className="image-modal-overlay"
                onClick={() => setImageModal(null)}
                role="dialog"
                aria-modal="true"
                aria-label="Image preview"
            >
                <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        className="image-modal-close"
                        onClick={() => setImageModal(null)}
                        aria-label="Close modal"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={`data:${imageModal.mime_type};base64,${imageModal.data}`}
                        alt="Generated image"
                        className="image-modal-img"
                    />
                    <div className="image-modal-actions">
                        <button
                            type="button"
                            className="image-modal-download"
                            onClick={() => handleDownloadImage(imageModal)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
    
    )
    
    }
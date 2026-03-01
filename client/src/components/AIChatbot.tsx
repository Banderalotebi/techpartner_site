import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, Sparkles } from "lucide-react";

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLeadCaptured, setIsLeadCaptured] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    
    const [messages, setMessages] = useState<{ role: "user" | "ai", text: string }[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleStartChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;
        setIsLeadCaptured(true);
        setMessages([{ 
            role: "ai", 
            text: `Hi ${name}! Welcome to TechPartner. I'm your AI assistant. How can I help you with your project today?` 
        }]);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setIsTyping(true);

        try {
            // Format history for the AI
            const history = messages.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}`).join("\n");

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    messages: [
                        { role: "system", content: "You are TechPartner's AI sales assistant. Be helpful, professional, and concise." },
                        ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
                        { role: "user", content: userMsg }
                    ]
                })
            });
            
            const data = await res.json();
            
            if (data.reply && data.reply.content) {
                setMessages(prev => [...prev, { role: "ai", text: data.reply.content }]);
            } else {
                setMessages(prev => [...prev, { role: "ai", text: "I'm here to help! Could you tell me more about your project?" }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "ai", text: "I'm having trouble connecting right now. Please try again in a moment." }]);
        } finally {
            setIsTyping(false);
        }
    };

    // CRM Handoff - Send transcript to AI Sales Closer
    const handleCloseChat = async () => {
        setIsOpen(false);
        
        // If they actually chatted, send the transcript to the CRM
        if (isLeadCaptured && messages.length > 2) {
            const transcript = messages.map(m => `${m.role === 'user' ? name : 'AI'}: ${m.text}`).join("\n");
            
            console.log("📝 Sending chat transcript to CRM...");
            
            // Fire and forget - asynchronous background task
            fetch("/api/crm/process-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userEmail: email, 
                    userName: name, 
                    chatTranscript: transcript,
                    source: "Website Chatbot"
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("✅ CRM processed:", data.analysis);
                    if (data.autonomousAction) {
                        console.log("🔥 Autonomous action taken:", data.autonomousAction);
                    }
                }
            })
            .catch(err => console.error("CRM handoff error:", err));
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Floating Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-[#01A1C1] text-white p-4 rounded-full shadow-2xl hover:bg-[#0089a4] transition transform hover:scale-105 flex items-center gap-2"
                >
                    <MessageSquare className="w-6 h-6" />
                    <span className="hidden sm:inline font-medium">Chat with AI</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all h-[500px]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#01A1C1] to-[#0089a4] text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">TechPartner AI</h3>
                                <p className="text-xs text-blue-100 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                                </p>
                            </div>
                        </div>
                        <button onClick={handleCloseChat} className="text-white hover:text-gray-200 transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Stage 1: Lead Capture Form */}
                    {!isLeadCaptured ? (
                        <div className="flex-1 p-6 flex flex-col justify-center bg-gray-50">
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-blue-100 text-[#01A1C1] rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-gray-900">Let's get started</h4>
                                <p className="text-sm text-gray-500 mt-1">Please introduce yourself before we chat.</p>
                            </div>
                            <form onSubmit={handleStartChat} className="space-y-4">
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Your Name" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] outline-none text-sm" 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                />
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="Your Email" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] outline-none text-sm" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                />
                                <button 
                                    type="submit" 
                                    className="w-full bg-[#01A1C1] text-white font-bold py-2 rounded-lg hover:bg-[#0089a4] transition text-sm"
                                >
                                    Start Chat
                                </button>
                            </form>
                            <p className="text-xs text-gray-400 text-center mt-4">
                                Your conversation will be analyzed by our AI to provide better service.
                            </p>
                        </div>
                    ) : (
                        /* Stage 2: Chat Interface */
                        <>
                            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                            msg.role === "user" 
                                                ? "bg-[#01A1C1] text-white rounded-br-none" 
                                                : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-gray-200 text-gray-500 p-3 rounded-2xl rounded-bl-none shadow-sm text-xs flex gap-1">
                                            <span className="animate-bounce">●</span>
                                            <span className="animate-bounce delay-100">●</span>
                                            <span className="animate-bounce delay-200">●</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Type your message..." 
                                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#01A1C1] text-sm" 
                                    value={input} 
                                    onChange={e => setInput(e.target.value)} 
                                />
                                <button 
                                    type="submit" 
                                    disabled={!input.trim()} 
                                    className="bg-[#01A1C1] text-white p-2 rounded-full hover:bg-[#0089a4] transition disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

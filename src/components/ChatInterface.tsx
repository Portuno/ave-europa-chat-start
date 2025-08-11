import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Ave Europa's AI assistant. Ask me anything about our vision for a united, sovereign Europe.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your question. I'd be happy to discuss our federalist vision for Europe and how we can strengthen European sovereignty while promoting unity among member states.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-chat-border rounded-2xl shadow-[var(--shadow-chat)] overflow-hidden">
      {/* Chat Header */}
      <div className="bg-[var(--europa-gradient)] text-primary-foreground p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold">Ave Europa AI</h3>
          <p className="text-primary-foreground/80 text-sm">Your guide to European federalism</p>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-chat-background">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            {!message.isUser && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                message.isUser
                  ? "bg-chat-user-bubble text-primary-foreground"
                  : "bg-chat-bot-bubble border border-chat-border"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
            {message.isUser && (
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-chat-border bg-background">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about European federalism, policies, or our vision..."
            className="flex-1 border-chat-border focus:border-primary"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-primary hover:bg-primary/90 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
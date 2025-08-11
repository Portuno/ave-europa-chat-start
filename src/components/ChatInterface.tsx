import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User, RotateCcw } from "lucide-react";
import mabotChatService from "@/lib/services/mabotChat";
import MabotConfigStatus from "./MabotConfigStatus";
import MabotApiDebug from "./MabotApiDebug";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void;
}

interface ChatInterfaceRef {
  sendMessage: (message: string) => void;
}

const quickHelpQuestions = [
  "What is Ave Europa?",
  "What is your ideology?",
  "How can I contribute?",
  "Tell me about your 12 policies"
];

const ChatInterface = forwardRef<ChatInterfaceRef, ChatInterfaceProps>(({ onSendMessage }, ref) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I am Ave Europa's AI assistant. I'm here to help you explore our vision and our policies. You can ask me about federalism, sovereignty, our ideology, or any of our 12 key points for Europe's future. How would you like to start?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [showQuickHelp, setShowQuickHelp] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const formatMessageText = (text: string) => {
    // Convertir markdown básico a HTML para mejor presentación
    let formattedText = text;
    
    // Convertir **texto** a <strong>texto</strong>
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convertir listas numeradas a formato HTML
    formattedText = formattedText.replace(/(\d+\.\s+)(.*?)(?=\d+\.|$)/g, '<div class="ml-4 mb-2"><span class="font-semibold">$1</span>$2</div>');
    
    // Convertir saltos de línea a <br>
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    return formattedText;
  };

  const handleSendMessage = async (customMessage?: string) => {
    const messageText = customMessage || inputText;
    if (!messageText.trim()) return;

    // Authentication is handled automatically by the service
    // No need to check or show login modal

    // Hide quick help after first message
    if (showQuickHelp) {
      setShowQuickHelp(false);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customMessage) {
      setInputText("");
    }
    onSendMessage?.(messageText);

    // Show loading state
    setIsLoading(true);

    try {
      // Send message to MABOT
      const botResponseText = await mabotChatService.sendMessage(messageText);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Failed to get bot response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hello! I am Ave Europa's AI assistant. I'm here to help you explore our vision and our policies. You can ask me about federalism, sovereignty, our ideology, or any of our 12 key points for Europe's future. How would you like to start?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setShowQuickHelp(true);
    mabotChatService.resetChat();
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  // Logout functionality removed for public demo
  // const handleLogout = () => {
  //   mabotAuthService.logout();
  //   setIsAuthenticated(false);
  //   handleResetChat();
  // };

  // Authentication is handled automatically by the service
  // No need to check authentication status for public demo
  useEffect(() => {
    // Set authenticated to true since credentials are pre-configured
    setIsAuthenticated(true);
  }, []);

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  useImperativeHandle(ref, () => ({
    sendMessage: (message: string) => {
      handleSendMessage(message);
    }
  }));

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-chat-border rounded-2xl shadow-[var(--shadow-chat)] overflow-hidden">
      {/* MABOT Configuration Status */}
      <MabotConfigStatus />
      
      {/* Chat Header */}
      <div className="bg-[var(--europa-gradient)] text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Ave Europa AI</h3>
            <p className="text-primary-foreground/80 text-sm">Your guide to European federalism</p>
          </div>
        </div>
        
        {/* Authentication Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-primary-foreground/80">MABOT Connected</span>
          </div>
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
              {message.isUser ? (
                <p className="text-sm leading-relaxed">{message.text}</p>
              ) : (
                <div 
                  className="text-sm leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMessageText(message.text) 
                  }}
                />
              )}
            </div>
            {message.isUser && (
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-chat-bot-bubble border border-chat-border rounded-2xl px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground">Ave Europa está pensando...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Help Questions - Only show before first message */}
      {showQuickHelp && (
        <div className="p-4 border-t border-chat-border bg-muted/30">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground text-center">Quick Questions</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickHelpQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuestionClick(question)}
                  className="text-xs h-8 px-3 hover:bg-primary/10"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

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
            onClick={() => handleSendMessage()}
            size="icon"
            className="bg-primary hover:bg-primary/90 shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Chat Reset Button */}
      <div className="p-4 border-t border-chat-border bg-background flex justify-end">
        <Button
          onClick={handleResetChat}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
        >
          <RotateCcw className="w-4 h-4" />
          Chat Reset
        </Button>
      </div>

      {/* MABOT Login Modal - Not needed for public demo */}
      {/* <MabotLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      /> */}
      
      {/* Debug Info (only in development) */}
      <MabotApiDebug />
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;
export type { ChatInterfaceProps, ChatInterfaceRef };
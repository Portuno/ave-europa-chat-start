import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw } from "lucide-react";
import mabotChatService from "@/lib/services/mabotChat";

const ChatDebugInfo = () => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    updateChatId();
  }, []);

  const updateChatId = () => {
    const currentChatId = mabotChatService.getCurrentChatId();
    setChatId(currentChatId);
  };

  const copyChatId = async () => {
    if (chatId) {
      try {
        await navigator.clipboard.writeText(chatId);
        // You could add a toast notification here
        console.log('Chat ID copied to clipboard:', chatId);
      } catch (err) {
        console.error('Failed to copy chat ID:', err);
      }
    }
  };

  const resetChat = () => {
    mabotChatService.resetChat();
    updateChatId();
  };

  // Only show in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        variant="outline"
        size="sm"
        className="bg-background/80 backdrop-blur-sm"
      >
        Debug
      </Button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-background border rounded-lg p-4 shadow-lg min-w-[300px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Chat Debug Info</h4>
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="sm"
                className="h-6 px-2"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Current Chat ID (UUID):</div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  {chatId || 'Not generated'}
                </Badge>
                {chatId && (
                  <Button
                    onClick={copyChatId}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={resetChat}
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Reset Chat
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              UUID Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDebugInfo; 
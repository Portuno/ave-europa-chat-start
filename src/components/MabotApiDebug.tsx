import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw, Send, AlertCircle } from "lucide-react";
import mabotChatService from "@/lib/services/mabotChat";
import mabotAuthService from "@/lib/services/mabotAuth";

const MabotApiDebug = () => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [apiLogs, setApiLogs] = useState<any[]>([]);
  const [authStatus, setAuthStatus] = useState<any>({});

  useEffect(() => {
    updateInfo();
    
    // Listen for console logs to capture API calls
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      originalLog.apply(console, args);
      if (args[0] && typeof args[0] === 'string' && args[0].includes('MABOT')) {
        setApiLogs(prev => [...prev, { type: 'log', timestamp: new Date(), data: args }]);
      }
    };
    
    console.error = (...args) => {
      originalError.apply(console, args);
      if (args[0] && typeof args[0] === 'string' && args[0].includes('MABOT')) {
        setApiLogs(prev => [...prev, { type: 'error', timestamp: new Date(), data: args }]);
      }
    };
    
    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  const updateInfo = () => {
    const currentChatId = mabotChatService.getCurrentChatId();
    setChatId(currentChatId);
    
    // Get auth status
    setAuthStatus({
      isAuthenticated: mabotAuthService.isAuthenticated(),
      hasToken: !!mabotAuthService.getAccessToken(),
      baseUrl: import.meta.env.MABOT_API_URL,
      botUsername: import.meta.env.MABOT_BOT_USERNAME,
      hasEmail: !!import.meta.env.MABOT_EMAIL,
      hasPassword: !!import.meta.env.MABOT_PASSWORD,
    });
  };

  const copyChatId = async () => {
    if (chatId) {
      try {
        await navigator.clipboard.writeText(chatId);
        console.log('Chat ID copied to clipboard:', chatId);
      } catch (err) {
        console.error('Failed to copy chat ID:', err);
      }
    }
  };

  const resetChat = () => {
    mabotChatService.resetChat();
    updateInfo();
  };

  const clearLogs = () => {
    setApiLogs([]);
  };

  const testApiCall = async () => {
    try {
      console.log('Testing MABOT API call...');
      const response = await mabotChatService.sendMessage('Test message from debug panel');
      console.log('Test API call successful:', response);
    } catch (error) {
      console.error('Test API call failed:', error);
    }
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
        API Debug
      </Button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-background border rounded-lg p-4 shadow-lg min-w-[500px] max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">MABOT API Debug Panel</h4>
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="sm"
                className="h-6 px-2"
              >
                ×
              </Button>
            </div>
            
            <Tabs defaultValue="status" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="api">API Logs</TabsTrigger>
                <TabsTrigger value="test">Test</TabsTrigger>
              </TabsList>
              
              <TabsContent value="status" className="space-y-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>API URL:</span>
                      <Badge variant={authStatus.baseUrl ? "default" : "destructive"}>
                        {authStatus.baseUrl || 'Missing'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Bot Username:</span>
                      <Badge variant={authStatus.botUsername ? "default" : "destructive"}>
                        {authStatus.botUsername || 'Missing'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <Badge variant={authStatus.hasEmail ? "default" : "destructive"}>
                        {authStatus.hasEmail ? 'Set' : 'Missing'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Password:</span>
                      <Badge variant={authStatus.hasPassword ? "default" : "destructive"}>
                        {authStatus.hasPassword ? 'Set' : 'Missing'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={authStatus.isAuthenticated ? "default" : "destructive"}>
                        {authStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Token:</span>
                      <Badge variant={authStatus.hasToken ? "default" : "destructive"}>
                        {authStatus.hasToken ? 'Present' : 'Missing'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Chat Session</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Chat ID:</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono">
                          {chatId ? chatId.substring(0, 8) + '...' : 'Not generated'}
                        </Badge>
                        {chatId && (
                          <Button
                            onClick={copyChatId}
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={resetChat}
                      variant="outline"
                      size="sm"
                      className="w-full h-7 text-xs"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Reset Chat
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="api" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium">API Logs</h5>
                  <Button
                    onClick={clearLogs}
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {apiLogs.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-4">
                      No API logs yet. Send a message to see logs.
                    </div>
                  ) : (
                    apiLogs.map((log, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-xs font-mono ${
                          log.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-gray-50'
                        }`}
                      >
                        <div className="text-xs text-muted-foreground mb-1">
                          {log.timestamp.toLocaleTimeString()}
                        </div>
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="test" className="space-y-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Test API Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Test the MABOT API integration by sending a test message.
                    </p>
                    <Button
                      onClick={testApiCall}
                      variant="outline"
                      size="sm"
                      className="w-full h-8"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Test API Call
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      Check the API Logs tab to see the results.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default MabotApiDebug; 
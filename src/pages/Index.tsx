import { useRef } from "react";
import ChatInterface from "@/components/ChatInterface";
import Logo from "@/components/Logo";
import PolicyPoints from "@/components/PolicyPoints";
import QuickHelp from "@/components/QuickHelp";

const Index = () => {
  const chatRef = useRef<{ sendMessage: (message: string) => void }>(null);

  const handlePolicyClick = (prompt: string) => {
    chatRef.current?.sendMessage(prompt);
  };

  const handleQuestionClick = (question: string) => {
    chatRef.current?.sendMessage(question);
  };

  return (
    <div className="min-h-screen bg-[var(--europa-gradient-subtle)] flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <Logo />
      
      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold bg-[var(--europa-gradient)] bg-clip-text text-transparent text-center mb-4">
        Meet Ave Europa's AI
      </h1>
      
      {/* Subtitle */}
      <p className="text-xl md:text-2xl text-muted-foreground text-center mb-8 max-w-3xl">
        Get instant, in-depth answers on our vision for a united Europe
      </p>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Policy Points - Left Side */}
        <div className="w-full lg:w-80 order-2 lg:order-1">
          <PolicyPoints onPolicyClick={handlePolicyClick} />
        </div>

        {/* Chatbot - Center */}
        <div className="w-full max-w-2xl order-1 lg:order-2">
          <ChatInterface ref={chatRef} />
        </div>

        {/* Right side placeholder for future content */}
        <div className="w-full lg:w-80 order-3 hidden lg:block">
          {/* Reserved for future content */}
        </div>
      </div>

      {/* Quick Help - Bottom */}
      <div className="mt-8 w-full max-w-2xl">
        <QuickHelp onQuestionClick={handleQuestionClick} />
      </div>
    </div>
  );
};

export default Index;

import { useRef } from "react";
import ChatInterface from "../components/ChatInterface";
import PolicyPoints from "../components/PolicyPoints";
import PolicyPointsRight from "../components/PolicyPointsRight";

const Index = () => {
  const chatRef = useRef<{ sendMessage: (message: string) => void }>(null);

  const handlePolicyClick = (prompt: string) => {
    chatRef.current?.sendMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-[var(--europa-gradient-subtle)] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Policy Points - Left Side */}
        <div className="w-full lg:w-64 order-2 lg:order-1">
          <PolicyPoints onPolicyClick={handlePolicyClick} />
        </div>

        {/* Chatbot - Center - Hacer más grande */}
        <div className="w-full max-w-4xl order-1 lg:order-2">
          <ChatInterface ref={chatRef} />
        </div>

        {/* Policy Points - Right Side */}
        <div className="w-full lg:w-64 order-3">
          <PolicyPointsRight onPolicyClick={handlePolicyClick} />
        </div>
      </div>
    </div>
  );
};

export default Index;

import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-[var(--europa-gradient-subtle)] flex flex-col items-center justify-center px-4 py-16">
      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold bg-[var(--europa-gradient)] bg-clip-text text-transparent text-center mb-4">
        Meet Ave Europa's AI
      </h1>
      
      {/* Subtitle */}
      <p className="text-xl md:text-2xl text-muted-foreground text-center mb-12 max-w-3xl">
        Get instant, in-depth answers on our vision for a united Europe
      </p>

      {/* Chatbot */}
      <ChatInterface />
    </div>
  );
};

export default Index;

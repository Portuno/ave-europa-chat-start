import HeroSection from "@/components/HeroSection";
import ChatInterface from "@/components/ChatInterface";
import FeatureList from "@/components/FeatureList";

const Index = () => {
  return (
    <div className="min-h-screen bg-[var(--europa-gradient-subtle)]">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Why chat with Ave Europa AI?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive approach to European federalism through intelligent conversation
            </p>
          </div>
          <FeatureList />
        </section>

        {/* Chat Interface Section */}
        <section id="chat-section" className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Start your conversation
            </h2>
            <p className="text-lg text-muted-foreground">
              Ask your first question about European unity and federalism
            </p>
          </div>
          <ChatInterface />
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              © 2024 Ave Europa. Building a united, sovereign Europe through democratic federalism.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

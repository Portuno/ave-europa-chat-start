import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";

const HeroSection = () => {
  const scrollToChat = () => {
    document.getElementById("chat-section")?.scrollIntoView({ 
      behavior: "smooth" 
    });
  };

  return (
    <section className="text-center space-y-8 mb-16">
      {/* Logo/Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--europa-gradient-subtle)] border border-border rounded-full text-sm font-medium text-muted-foreground">
        <Sparkles className="w-4 h-4 text-europa-gold" />
        Ave Europa Political Movement
      </div>

      {/* Main Headline */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-[var(--europa-gradient)] bg-clip-text text-transparent leading-tight">
          Meet Ave Europa's AI
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Get instant, in-depth answers on our vision for a united Europe
        </p>
      </div>

      {/* Subtext */}
      <p className="text-lg text-foreground max-w-2xl mx-auto">
        A Vision for European Unity, Sovereignty & Civilization
      </p>

      {/* CTA Button */}
      <Button 
        onClick={scrollToChat}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold shadow-[var(--shadow-europa)] hover:shadow-lg transition-all duration-300 group"
      >
        Start chatting now
        <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
      </Button>
    </section>
  );
};

export default HeroSection;
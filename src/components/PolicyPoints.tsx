import { Shield, Globe, Users, Zap, Building, Leaf, GraduationCap, Heart, Scale, Coins, Map, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PolicyPoint {
  id: string;
  title: string;
  icon: React.ReactNode;
  prompt: string;
}

const policyPoints: PolicyPoint[] = [
  { id: "1", title: "Strategic Autonomy", icon: <Shield className="w-4 h-4" />, prompt: "Tell me about strategic autonomy" },
  { id: "2", title: "Digital Sovereignty", icon: <Globe className="w-4 h-4" />, prompt: "Explain digital sovereignty" },
  { id: "3", title: "Social Cohesion", icon: <Users className="w-4 h-4" />, prompt: "What is your approach to social cohesion?" },
  { id: "4", title: "Energy Independence", icon: <Zap className="w-4 h-4" />, prompt: "How will Europe achieve energy independence?" },
  { id: "5", title: "Infrastructure", icon: <Building className="w-4 h-4" />, prompt: "Tell me about European infrastructure plans" },
  { id: "6", title: "Green Transition", icon: <Leaf className="w-4 h-4" />, prompt: "What is your green transition policy?" },
  { id: "7", title: "Education Reform", icon: <GraduationCap className="w-4 h-4" />, prompt: "Explain your education reform plans" },
  { id: "8", title: "Healthcare", icon: <Heart className="w-4 h-4" />, prompt: "What are your healthcare policies?" },
  { id: "9", title: "Rule of Law", icon: <Scale className="w-4 h-4" />, prompt: "How do you strengthen rule of law?" },
  { id: "10", title: "Economic Policy", icon: <Coins className="w-4 h-4" />, prompt: "Tell me about your economic policies" },
  { id: "11", title: "Border Security", icon: <Map className="w-4 h-4" />, prompt: "What is your border security approach?" },
  { id: "12", title: "Cultural Identity", icon: <Flag className="w-4 h-4" />, prompt: "How do you preserve European cultural identity?" },
];

interface PolicyPointsProps {
  onPolicyClick: (prompt: string) => void;
}

const PolicyPoints = ({ onPolicyClick }: PolicyPointsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground text-center">12 Key Policy Points</h3>
      <div className="grid grid-cols-2 gap-2">
        {policyPoints.map((point) => (
          <Button
            key={point.id}
            variant="outline"
            size="sm"
            onClick={() => onPolicyClick(point.prompt)}
            className="h-auto p-3 flex flex-col items-center gap-2 text-xs hover:bg-primary/5 hover:border-primary/30"
          >
            <div className="text-primary">{point.icon}</div>
            <span className="text-center leading-tight">{point.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PolicyPoints;
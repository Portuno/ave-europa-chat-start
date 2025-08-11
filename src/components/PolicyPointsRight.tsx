import { GraduationCap, Heart, Scale, Coins, Map, Flag } from "lucide-react";
import { Button } from "./ui/button";

interface PolicyPoint {
  id: string;
  title: string;
  icon: React.ReactNode;
  prompt: string;
}

const policyPoints: PolicyPoint[] = [
  { id: "7", title: "Education Reform", icon: <GraduationCap className="w-4 h-4" />, prompt: "Explain your education reform plans" },
  { id: "8", title: "Healthcare", icon: <Heart className="w-4 h-4" />, prompt: "What are your healthcare policies?" },
  { id: "9", title: "Rule of Law", icon: <Scale className="w-4 h-4" />, prompt: "How do you strengthen rule of law?" },
  { id: "10", title: "Economic Policy", icon: <Coins className="w-4 h-4" />, prompt: "Tell me about your economic policies" },
  { id: "11", title: "Border Security", icon: <Map className="w-4 h-4" />, prompt: "What is your border security approach?" },
  { id: "12", title: "Cultural Identity", icon: <Flag className="w-4 h-4" />, prompt: "How do you preserve European cultural identity?" },
];

interface PolicyPointsRightProps {
  onPolicyClick: (prompt: string) => void;
}

const PolicyPointsRight = ({ onPolicyClick }: PolicyPointsRightProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground text-center">Key Points</h3>
      <div className="space-y-2">
        {policyPoints.map((point) => (
          <Button
            key={point.id}
            variant="outline"
            size="sm"
            onClick={() => onPolicyClick(point.prompt)}
            className="w-full h-auto p-3 flex items-center gap-3 text-sm hover:bg-primary/5 hover:border-primary/30"
          >
            <div className="text-primary">{point.icon}</div>
            <span className="text-left">{point.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PolicyPointsRight; 
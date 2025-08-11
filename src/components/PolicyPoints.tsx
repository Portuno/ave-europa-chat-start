import { Shield, Globe, Users, Zap, Building, Leaf } from "lucide-react";
import { Button } from "./ui/button";

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
];

interface PolicyPointsProps {
  onPolicyClick: (prompt: string) => void;
}

const PolicyPoints = ({ onPolicyClick }: PolicyPointsProps) => {
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

export default PolicyPoints;
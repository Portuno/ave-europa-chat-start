import { MessageSquare, Users, BookOpen, ArrowRight } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Ask anything",
    description: "Get detailed information on policies and federalist principles",
  },
  {
    icon: Users,
    title: "Discuss Europe's future",
    description: "Explore key topics like federalism and sovereignty",
  },
  {
    icon: BookOpen,
    title: "Learn more",
    description: "Understand the party's mission and goals",
  },
];

const FeatureList = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <div
            key={index}
            className="group p-6 bg-card border border-border rounded-xl hover:border-primary/20 hover:shadow-[var(--shadow-europa)] transition-all duration-300"
          >
            <div className="w-12 h-12 bg-europa-blue-light rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              {feature.title}
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureList;
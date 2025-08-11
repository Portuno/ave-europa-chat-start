import { Button } from "@/components/ui/button";

const quickHelpQuestions = [
  "What is Ave Europa?",
  "What is your ideology?",
  "How can I contribute?",
  "Tell me about your 12 policies"
];

interface QuickHelpProps {
  onQuestionClick: (question: string) => void;
}

const QuickHelp = ({ onQuestionClick }: QuickHelpProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground text-center">Quick Questions</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {quickHelpQuestions.map((question, index) => (
          <Button
            key={index}
            variant="secondary"
            size="sm"
            onClick={() => onQuestionClick(question)}
            className="text-xs h-8 px-3 hover:bg-primary/10"
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickHelp;
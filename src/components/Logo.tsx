import { Flag } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-12 h-12 bg-[var(--europa-gradient)] rounded-full flex items-center justify-center shadow-lg">
        <Flag className="w-6 h-6 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ave Europa</h1>
        <p className="text-sm text-muted-foreground">A Vision for European Unity</p>
      </div>
    </div>
  );
};

export default Logo;
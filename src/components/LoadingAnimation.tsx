
import { Loader } from "lucide-react";

interface LoadingAnimationProps {
  text?: string;
}

const LoadingAnimation = ({ text = "Loading data..." }: LoadingAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader className="h-10 w-10 text-playlist-primary animate-spin" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};

export default LoadingAnimation;

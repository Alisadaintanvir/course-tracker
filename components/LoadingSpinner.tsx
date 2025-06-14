import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

export default function LoadingSpinner({
  size = 24,
  className = "",
  text,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer pulsing circle */}
        <div className="absolute inset-0 rounded-full animate-ping bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-20" />

        {/* Inner spinning circle */}
        <div className="relative">
          <Loader2
            className={`animate-spin text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 ${className}`}
            size={size}
          />
        </div>
      </div>

      {/* Loading text */}
      {text && (
        <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

import { AlertTriangle } from 'lucide-react';

interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      <AlertTriangle className="w-8 h-8 text-amber-400" />
      <p className="text-sm text-gray-300 max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          Try Again
        </button>
      )}
    </div>
  );
}
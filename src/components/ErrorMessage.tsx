interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
      <div className="flex items-start justify-between gap-4">
        <p className="text-red-700 flex-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors whitespace-nowrap"
            aria-label="다시 시도"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}

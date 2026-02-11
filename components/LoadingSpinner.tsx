'use client';

export default function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full" />
        <div className="absolute top-0 left-0 w-full h-full border-4 border-warlord-accent border-t-transparent rounded-full animate-spin" />
      </div>
      {message && (
        <p className="text-gray-400 text-center max-w-md">{message}</p>
      )}
    </div>
  );
}

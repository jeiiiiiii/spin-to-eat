export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div data-testid="loading-spinner" className="flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 border-4 border-[#E6F2FA] border-t-[#0067A5] rounded-full animate-spin" />
      {message && <p className="text-[#6B7280] text-sm">{message}</p>}
    </div>
  );
}

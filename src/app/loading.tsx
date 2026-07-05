export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 w-full bg-transparent overflow-hidden">
      <div className="h-full bg-alemah-red-600 w-1/3 animate-loading-bar" />
    </div>
  );
}

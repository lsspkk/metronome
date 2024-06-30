export const NpButton = (
  { onClick, children, className = "" }: { onClick: () => void; children: React.ReactNode; className?: string },
) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-blue-700 ${className || ""}`}
  >
    {children}
  </button>
);

export function NpLayout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col items-center mb-10 mt-20 sm:mt-24 ${className ? className : ""}`}>
      {children}
    </div>
  );
}

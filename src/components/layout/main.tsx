interface MainProps {
  children: React.ReactNode;
}

export function Main({ children }: MainProps) {
  return (
    <main 
      id="main-content"
      className="container flex-1 px-4 py-4 sm:px-6 sm:py-8 md:px-8"
      role="main"
      aria-label="메인 콘텐츠"
    >
      {children}
    </main>
  );
}

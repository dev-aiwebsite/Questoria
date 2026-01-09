
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-primary relative overflow-hidden h-screen flex flex-col">
      <main>
        {children}
      </main>
    </div>
  );
}

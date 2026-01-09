import MobileHeader from "@/components/mobileHeader";
import MobileNav from "@/components/mobileNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-primary overflow-hidden h-screen flex flex-col">
      <MobileHeader />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}

import { useState, ReactNode, useEffect } from "react";
// import { Header } from "./header"; // Header import removed
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Проверка ширины экрана для определения мобильного режима
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="w-full h-screen overflow-hidden relative"> {/* bg-gray-50 removed, Ensure positioning context */}
      {/* Sidebar remains a direct child, already styled as a floating island */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* New Main Content Island */}
      <div
        className={cn(
          "h-full flex flex-col overflow-y-auto", // Full height, layout
          "pt-4 pr-4 pb-4", // Base padding for top, right, bottom
          "transition-all duration-300 ease-in-out", // For smooth padding change
          sidebarOpen ? "md:pl-[288px] pl-6" : "md:pl-20 pl-6" // Dynamic left padding
        )}
      >
        {/* Header component removed */}
        
        {/* Main scrollable area within the island */}
        <main 
          className={cn(
            "flex-1 isolate", // flex-1 to grow, p-4 removed, isolate for stacking context
            className // className prop from page will be merged here
          )}
        >
          <div className="h-full"> {/* This div might be redundant if main can handle height correctly */}
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Navigation - position may need review in full app context */}
      <MobileNav />
    </div>
  );
}

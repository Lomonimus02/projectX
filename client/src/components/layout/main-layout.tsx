import { useState, ReactNode, useEffect, useRef } from "react";
// import { Header } from "./header"; // Header import removed
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

// Helper function to get initial pin state from localStorage
const getInitialPinState = (): boolean => {
  // Ensure localStorage is accessed only on the client-side
  if (typeof window !== 'undefined') {
    const storedPinState = localStorage.getItem('sidebarPinned');
    return storedPinState ? JSON.parse(storedPinState) : false;
  }
  return false;
};

export function MainLayout({ children, className }: MainLayoutProps) {
  const initialPinnedState = getInitialPinState();
  const [isSidebarPinned, setIsSidebarPinned] = useState<boolean>(initialPinnedState);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(initialPinnedState); // Sidebar is open if it was pinned
  const [isMobile, setIsMobile] = useState(false); // isMobile state remains
  const sidebarRef = useRef<HTMLElement | null>(null);

  // Effect to save pin state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarPinned', JSON.stringify(isSidebarPinned));
    }
  }, [isSidebarPinned]);

  const toggleSidebar = () => {
    // Prevent closing sidebar if it's pinned and open
    if (isSidebarPinned && sidebarOpen) {
      return;
    }
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarPin = () => {
    const newPinState = !isSidebarPinned;
    setIsSidebarPinned(newPinState);
    if (newPinState) { // If just pinned
      setSidebarOpen(true);
    }
    // If unpinned, sidebarOpen remains as is, will be closable by other means
  };
  
  const handleRequestClose = () => {
    if (!isSidebarPinned) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      if (isSidebarPinned) {
        // If sidebar is pinned, do nothing regarding toggle
        return;
      }
      // Standard logic from before, but using the potentially modified toggleSidebar
      if (sidebarOpen) {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
          toggleSidebar(); // Will not close if pinned due to internal check in toggleSidebar
        }
      } else {
        toggleSidebar();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isSidebarPinned, toggleSidebar, sidebarOpen]);
  
  return (
    <div className="w-full h-screen"> {/* relative removed, overflow-hidden removed, bg-gray-50 removed, Ensure positioning context */}
      {/* Sidebar remains a direct child, already styled as a floating island */}
      <Sidebar 
        isOpen={sidebarOpen} 
        ref={sidebarRef} 
        isSidebarPinned={isSidebarPinned}
        toggleSidebarPin={toggleSidebarPin}
        requestClose={handleRequestClose}
        setSidebarOpen={setSidebarOpen} // Added setSidebarOpen prop
      />
      
      {/* New Main Content Island */}
      <div // Main content island - Reverted to padding-left
        className={cn(
          "h-full flex flex-col overflow-y-auto", // Full height, layout
          "pr-4 pb-4", // Right and bottom padding remain
          "transition-all duration-300 ease-in-out", // Re-added transition classes
          sidebarOpen ? "md:pl-[288px] pl-6" : "md:pl-20 pl-6" // Dynamic left padding classes
        )}
        // Removed inline style attribute
      >
        {/* Header component removed */}
        
        {/* Main scrollable area within the island */}
        <main 
          className={cn(
            "flex-1 isolate", // flex-1 to grow, p-4 removed, isolate for stacking context
            className // Restore className prop from page
          )}
        >
          <div className="h-full"> {/* Restore original children structure */}
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Navigation - position may need review in full app context */}
      <MobileNav />
    </div>
  );
}

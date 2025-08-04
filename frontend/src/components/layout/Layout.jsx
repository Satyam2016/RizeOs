import { useState } from "react"
import { Topbar } from "./Topbar"
import { Sidebar } from "./Sidebar"
import { BottomNav } from "./BottomNav"

export function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      <Topbar 
        onMenuToggle={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={toggleMobileMenu} />
          <div className="fixed top-16 left-0 w-64 h-full bg-white shadow-strong">
            <div className="p-4">
              <nav className="space-y-2">
                <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary">
                  Home
                </a>
                <a href="/jobs" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary">
                  Job Board
                </a>
                <a href="/post-job" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary">
                  Post a Job
                </a>
                <a href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary">
                  Profile
                </a>
                <a href="/payments" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary">
                  Payments
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      <Sidebar />
      
      <main className="md:pl-64 pt-16 pb-16 md:pb-0">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}

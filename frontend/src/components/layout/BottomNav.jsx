import { Home, Briefcase, Plus, Wallet, User } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Post", href: "/create-post", icon: Plus, special: true },
  { name: "Wallet", href: "/payments", icon: Wallet },
  { name: "Profile", href: "/profile", icon: User },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-glass border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          
          if (item.special) {
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className="flex flex-col items-center"
              >
                <Button
                  variant="gradient"
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-medium"
                >
                  <item.icon className="h-6 w-6" />
                </Button>
              </NavLink>
            )
          }

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                isActive && "text-primary"
              )} />
              <span className="text-xs font-medium">{item.name}</span>
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

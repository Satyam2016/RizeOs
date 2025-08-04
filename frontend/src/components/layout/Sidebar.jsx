import { 
  Home, 
  Briefcase, 
  Plus, 
  FileText, 
  Wallet, 
  User, 
  Settings,
  PlusSquare
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Job Board", href: "/jobs", icon: Briefcase },
  { name: "Post a Job", href: "/post-job", icon: Plus },
  { name: "My Jobs", href: "/my-jobs", icon: FileText },
  { name: "Create Post", href: "/create-post", icon: PlusSquare },
  { name: "Payments", href: "/payments", icon: Wallet },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:top-16 bg-white/50 backdrop-blur-glass border-r border-border">
      <div className="flex flex-col flex-1 min-h-0 pt-6">
        <div className="flex-1 flex flex-col pb-4 overflow-y-auto">
          <nav className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-medium"
                      : "text-foreground hover:bg-secondary hover:text-primary"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"
                    )}
                  />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-border">
          <div className="space-y-2">
            <Button variant="gradient" className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Quick Post
            </Button>
            <Button variant="outline" className="w-full" size="sm">
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

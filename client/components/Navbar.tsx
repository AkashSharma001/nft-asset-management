import { Button } from "./ui/button"
import { Moon, Sun, LogOut } from 'lucide-react'

interface NavbarProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  email: string
  userId: string
}

export function Navbar({ theme, onToggleTheme, email, userId }: NavbarProps) {

  const handleLogout = () => {
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userId')
    window.location.reload()
  }

  return (
    <nav className="border-b mb-4">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">My Assets</h1>
            {/* User Info - Mobile View */}
            <div className="block sm:hidden space-y-1">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">ID:</span> {userId}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Email:</span> {email}
              </div>
            </div>
            {/* User Info - Desktop View */}
            <div className="hidden sm:block text-sm text-muted-foreground">
              ID: {userId} | Email: {email}
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button onClick={onToggleTheme} variant="outline" size="icon">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button onClick={handleLogout} variant="outline" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 
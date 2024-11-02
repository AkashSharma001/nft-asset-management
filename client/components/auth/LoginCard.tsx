import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

interface LoginCardProps {
  onLogin: (email: string) => void
  error?: string
}

export function LoginCard({ onLogin, error }: LoginCardProps) {
  const [loginEmail, setLoginEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(loginEmail)
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Login or Register</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="Enter your email"
            className="mb-2"
          />
          <Button type="submit" className="w-full">
            Continue with Email
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 
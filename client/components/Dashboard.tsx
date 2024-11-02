'use client'

import { useAssets } from '../hooks/nftAsset/useNFTAssets'
import { useUser } from '../hooks/auth/useUser'
import { useTheme } from '../hooks/theme/useTheme'
import { LoginCard } from '@/components/auth/LoginCard'
import { NFTAssetManagement } from '@/components/nftAsset/NFTAssetManagement'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { userId, email, login, isLoading: userLoading, error: userError } = useUser()
  const { assets, isLoading: assetLoading, error: assetError, createAsset, isCreating } = useAssets(userId)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])


  if (!mounted) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div>Initializing...</div>
        </div>
      </div>
    )
  }

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div>Loading user data...</div>
        </div>
      </div>
    )
  }

  // Show login screen if no user data
  if (!userId || !email) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <LoginCard onLogin={login} error={userError} />
      </div>
    )
  }

  return (
      <NFTAssetManagement
        userId={userId}
        email={email}
        assets={assets ?? []}
        theme={theme}
        isLoading={assetLoading}
        error={assetError}
        onToggleTheme={toggleTheme}
        onCreateAsset={createAsset}
        isCreating={isCreating}
      />
  )
} 
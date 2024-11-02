import { useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useAssets } from './useNFTAssets'

export function useAssetCreation(userId: string | null) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newAssetName, setNewAssetName] = useState('')
  const [newAssetDescription, setNewAssetDescription] = useState('')
  const { createAsset, isCreating } = useAssets(userId)
  const { toast } = useToast()

  const handleCreateAsset = async () => {
    try {
      await createAsset({ name: newAssetName, description: newAssetDescription })
      toast({
        title: 'Asset created successfully!',
        description: 'Your asset has been created and is now available in your collection.',
      })
      setIsCreateModalOpen(false)
      setNewAssetName('')
      setNewAssetDescription('')
    } catch (error) {
      toast({
        title: 'Failed to create asset',
        description: 'There was an error creating your asset. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return {
    isCreateModalOpen,
    setIsCreateModalOpen,
    newAssetName,
    setNewAssetName,
    newAssetDescription,
    setNewAssetDescription,
    handleCreateAsset,
    isCreating
  }
} 
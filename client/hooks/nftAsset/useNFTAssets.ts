import { useState } from 'react';
import { Asset } from '@/types/nft.types';
import { trpc } from '../../lib/trpc';

// Manages asset data fetching and creation with optimistic updates
export const useAssets = (userId: string | null) => {
  const [isCreating, setIsCreating] = useState(false);

  // Only enable the query when we have a valid userId
  const {
    data: assets,
    isLoading,
    error,
    refetch
  } = trpc.asset.getUserAssets.useQuery(userId as string, {
    enabled: !!userId, // Only run query when userId exists
    retry: false
  });

  const createAssetMutation = trpc.asset.createAsset.useMutation();

  const createAsset = async ({ name, description }: { name: string, description: string }) => {
    if (!userId) return;
    
    try {
      setIsCreating(true);
      await createAssetMutation.mutateAsync({
        name,
        description,
        ownerId: userId
      });
      await refetch();
    } catch (err) {
      console.error('Error creating asset:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    assets,
    isLoading: isLoading && !!userId,
    error: error?.message,
    createAsset,
    isCreating,
  };
}; 
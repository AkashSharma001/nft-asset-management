import { trpc } from '@/lib/trpc';
import { useState } from 'react';

// Handles asset transfer mutations with error handling and cache invalidation
export function useTransactions() {
  const [error, setError] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const transferAsset = trpc.transaction.transferAsset.useMutation({
    onSuccess: () => {
      utils.asset.getUserAssets.invalidate();
    },
    onError: (error) => setError(error.message)
  });

  const handleTransfer = async (assetId: string, fromUserId: string, toUserId: string) => {
    try {
      setError(null);
      await transferAsset.mutateAsync({
        assetId,
        fromUserId,
        toUserId
      });
    } catch (err) {
      console.error('Failed to transfer asset:', err);
    }
  };

  return {
    transfer: handleTransfer,
    isTransferring: transferAsset.isLoading,
    error
  };
} 
import { useState } from 'react'
import { trpc } from '../../lib/trpc'
import { useToast } from '../ui/use-toast'
import { useTransactions } from '../transactions/useTransactions'

export function useTransferAsset(userEmail: string, userId: string) {
  const [isTransferring, setIsTransferring] = useState(false)
  const { transfer } = useTransactions()
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const handleTransfer = async (assetId: string, recipientEmail: string) => {
    try {
      setIsTransferring(true)

      if (userEmail === recipientEmail) {
        toast({
          title: 'Invalid transfer',
          description: 'You cannot transfer assets to yourself.',
          variant: 'destructive',
        })
        return
      }

      const recipient = await utils.user.getUserByEmail.fetch({ email: recipientEmail })
      
      if (!recipient) {
        throw new Error('Recipient not found')
      }
      console.log('Recipient:', recipient)

      await transfer(assetId, userId, recipient.id)
      toast({
        title: 'Asset transferred successfully!',
        description: 'Your asset has been transferred to the recipient.',
      })
    } catch (error) {
      toast({
        title: 'Failed to transfer asset',
        description: 'The recipient with the provided email was not found.',
        variant: 'destructive',
      })
    } finally {
      setIsTransferring(false)
    }
  }

  return { handleTransfer, isTransferring }
}
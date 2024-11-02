"use client"

import { trpc } from "@/lib/trpc"
import { Asset, Transaction } from "@/types/nft.types"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { formatDate } from "@/lib/utils"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

interface NFTAssetCardProps {
    asset: Asset
    onTransfer: (assetId: string, recipientEmail: string) => void
    isTransferring: boolean
  }
  
  // Add validation schema
  const transferSchema = z.object({
    recipientEmail: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
  })
  
  type TransferFormData = z.infer<typeof transferSchema>
  
  function NFTAssetCard({ asset, onTransfer, isTransferring }: NFTAssetCardProps) {
    const form = useForm<TransferFormData>({
      resolver: zodResolver(transferSchema),
      defaultValues: {
        recipientEmail: ''
      }
    })
  
    const handleTransfer = async (data: TransferFormData) => {
      await onTransfer(asset.id, data.recipientEmail)
      form.reset()
    }
  
    const { data: transactions, isLoading: isLoadingHistory } = trpc.transaction.getAssetHistory.useQuery({ assetId: asset.id })
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>{asset.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">{asset.description}</p>
          <p className="text-sm text-muted-foreground mb-4">
            Created: {formatDate(asset.created_at)}
          </p>
          <form onSubmit={form.handleSubmit(handleTransfer)} className="space-y-4">
            <div>
              <Input
                type="email"
                {...form.register('recipientEmail')}
                placeholder="Enter recipient email"
                className={`mb-2 ${form.formState.errors.recipientEmail ? 'border-red-500' : ''}`}
              />
              {form.formState.errors.recipientEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.recipientEmail.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isTransferring || !form.formState.isValid}
              className="w-full"
            >
              {isTransferring ? 'Transferring...' : 'Transfer Asset'}
            </Button>
          </form>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-4 w-full">
                View Transaction History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="mb-4">Transaction History</DialogTitle>
                <div className="text-sm">
                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-4">
                      Loading transaction history...
                    </div>
                  ) : transactions?.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No transactions found
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions?.map((tx: Transaction) => (
                        <div key={tx.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">Transfer</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(tx.created_at)}
                            </span>
                          </div>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="text-muted-foreground">From: </span>
                              {tx.from_user?.email}
                            </p>
                            <p>
                              <span className="text-muted-foreground">To: </span>
                              {tx.to_user?.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    )
  }
  
  export default NFTAssetCard
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from '../ui/label'
import { useToast } from "../../hooks/ui/use-toast"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface CreateNFTAssetDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreateAsset: (data: { name: string; description: string }) => Promise<void>
  isCreating: boolean
}

// Add validation schema
const createAssetSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters")
})

type FormData = z.infer<typeof createAssetSchema>

export function CreateNFTAssetDialog({ isOpen, onOpenChange, onCreateAsset, isCreating }: CreateNFTAssetDialogProps) {
  const { toast } = useToast()
  
  const form = useForm<FormData>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const handleCreateAsset = async (data: FormData) => {
    try {
      await onCreateAsset(data)
      toast({
        title: 'Asset created successfully!',
        description: 'Your asset has been created and is now available in your collection.',
      })
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast({
        title: 'Failed to create asset',
        description: 'There was an error creating your asset. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Asset</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Enter the details for your new asset.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleCreateAsset)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  {...form.register('name')}
                  className={form.formState.errors.name ? 'border-red-500' : ''}
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <div className="col-span-3">
                <Input
                  id="description"
                  {...form.register('description')}
                  className={form.formState.errors.description ? 'border-red-500' : ''}
                />
                {form.formState.errors.description && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Adding...' : 'Add Asset'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
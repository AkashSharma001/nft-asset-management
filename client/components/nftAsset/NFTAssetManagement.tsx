import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import NFTAssetCard from './NFTAssetCard'
import NFTAssetListItem from './NFTAssetListItem'
import { CreateNFTAssetDialog } from './CreateNFTAssetDialog'
import { Asset } from '@/types/nft.types'
import { useTransferAsset } from '@/hooks/nftAsset/useTransferNFTAsset'
import { Navbar } from "../Navbar"

interface NFTAssetManagementProps {
  userId: string
  email: string
  assets: Asset[]
  theme: 'light' | 'dark'
  isLoading: boolean
  error?: string
  onToggleTheme: () => void
  onCreateAsset: (data: { name: string; description: string }) => Promise<void>
  isCreating: boolean
}

// Main NFT management interface with filtering and view options
export function NFTAssetManagement({
  userId,
  email,
  assets,
  theme,
  isLoading,
  error,
  onToggleTheme,
  onCreateAsset,
  isCreating,
}: NFTAssetManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { handleTransfer, isTransferring } = useTransferAsset(email, userId)

  const filteredAssets = assets?.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!filterDate || new Date(asset.created_at).toDateString() === new Date(filterDate).toDateString())
  ) ?? []

  if (isLoading) return <div className="container mx-auto p-4">Loading...</div>

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <Navbar
        theme={theme}
        onToggleTheme={onToggleTheme}
        email={email}
        userId={userId}
      />
      
      <main className="container mx-auto p-4">
        {error && (
          <div className="bg-destructive text-destructive-foreground px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-4">
          <div className="flex-grow space-y-2 sm:space-y-0 sm:flex sm:gap-2">
            <Input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto sm:flex-grow"
            />
            <div className="flex gap-2">
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="flex-1 sm:w-auto"
              />
              {(searchTerm || filterDate) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDate('');
                  }}
                  className="whitespace-nowrap"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          <CreateNFTAssetDialog
            isOpen={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onCreateAsset={onCreateAsset}
            isCreating={isCreating}
          />
        </div>

        <NFTDisplay 
          assets={filteredAssets}
          onTransfer={handleTransfer}
          isTransferring={isTransferring}
        />
      </main>
    </div>
  )
}

interface NFTDisplayProps {
  assets: Asset[]
  onTransfer: (assetId: string, recipientEmail: string) => Promise<void>
  isTransferring: boolean
}

  function NFTDisplay({ assets, onTransfer, isTransferring }: NFTDisplayProps) {
  return (
    <Tabs defaultValue="grid" className="w-full">
      <TabsList>
        <TabsTrigger value="grid">Grid View</TabsTrigger>
        <TabsTrigger value="list">List View</TabsTrigger>
      </TabsList>
      <TabsContent value="grid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <NFTAssetCard 
              key={asset.id} 
              asset={asset} 
              onTransfer={onTransfer} 
              isTransferring={isTransferring} 
            />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="list">
        {/* Column Headers - Desktop Only */}
        <div className="hidden md:grid md:grid-cols-5 p-4 font-semibold bg-muted rounded-t-lg">
          <div>ID</div>
          <div>Asset Details</div>
          <div>Created</div>
          <div>Transfer To</div>
          <div>Action</div>
        </div>
        <div className="space-y-2">
          {assets.map((asset) => (
            <NFTAssetListItem 
              key={asset.id} 
              asset={asset} 
              onTransfer={onTransfer} 
              isTransferring={isTransferring} 
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
} 
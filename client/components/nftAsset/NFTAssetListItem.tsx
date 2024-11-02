import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Asset } from "@/types/nft.types"

interface NFTAssetListItemProps {
  asset: Asset
  onTransfer: (assetId: string, recipientEmail: string) => void
  isTransferring: boolean
}

function NFTAssetListItem({ asset, onTransfer, isTransferring }: NFTAssetListItemProps) {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-5 p-4 gap-4 items-center">
        <div className="truncate">{asset.id}</div>
        <div>
          <h3 className="font-semibold">{asset.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{asset.description}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(asset.created_at).toLocaleString()}
        </div>
        <Input
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="Recipient email"
          className="w-full"
        />
        <Button
          onClick={() => onTransfer(asset.id, recipientEmail)}
          disabled={isTransferring || !recipientEmail}
          size="sm"
        >
          Transfer
        </Button>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="p-4" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{asset.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{asset.description}</p>
            </div>
            <Button variant="ghost" size="sm">
              {isExpanded ? '▼' : '▶'}
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="px-4 pb-4 space-y-3">
            <div className="text-sm">
              <div className="text-muted-foreground">ID:</div>
              <div className="truncate">{asset.id}</div>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">Created:</div>
              <div>{new Date(asset.created_at).toLocaleString()}</div>
            </div>
            <Input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Recipient email"
              className="w-full"
            />
            <Button
              onClick={() => onTransfer(asset.id, recipientEmail)}
              disabled={isTransferring || !recipientEmail}
              size="sm"
            >
              Transfer
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
export default NFTAssetListItem
  
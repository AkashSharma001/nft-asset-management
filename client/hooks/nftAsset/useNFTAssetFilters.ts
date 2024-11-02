import { useState, useEffect } from 'react'
import { Asset } from '@/types/nft.types'

export function useAssetFilters(assets: Asset[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])

  useEffect(() => {
    if (assets) {
      setFilteredAssets(assets.filter(asset => 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!filterDate || new Date(asset.created_at).toDateString() === new Date(filterDate).toDateString())
      ))
    }
  }, [assets, searchTerm, filterDate])

  return {
    searchTerm,
    setSearchTerm,
    filterDate,
    setFilterDate,
    filteredAssets
  }
}
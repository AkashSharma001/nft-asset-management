import { Input } from "../ui/input"

interface NFTAssetFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterDate: string
  setFilterDate: (date: string) => void
}

export function NFTAssetFilters({ searchTerm, setSearchTerm, filterDate, setFilterDate }: NFTAssetFiltersProps) {
  return (
    <div className="flex gap-2 mb-4">
      <Input
        type="text"
        placeholder="Search assets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow"
      />
      <Input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />
    </div>
  )
} 
import React from 'react'
import { 
  Search, Filter, X, Hash,
  Calendar, Users, Star, Zap, Check,
  TrendingDown
} from 'lucide-react'

interface FiltersSidebarProps {
  searchTerm: string
  selectedCategories: string[]
  sortBy: string
  onSearchChange: (value: string) => void
  onCategoryToggle: (category: string) => void
  onRemoveCategory: (category: string) => void  
  onSortChange: (value: string) => void
  onClearFilters: () => void
  hasFilters: boolean
  postCount: number
  filteredCount: number
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest', icon: Calendar },
  { value: 'oldest', label: 'Oldest', icon: Calendar },
  { value: 'liked', label: 'Most Liked', icon: Star },
  { value: 'disliked', label: 'Less Liked', icon: TrendingDown },
  { value: 'title-asc', label: 'Title A-Z', icon: Hash },
  { value: 'title-desc', label: 'Title Z-A', icon: Hash },
] as const

const CATEGORY_OPTIONS = [
  { value: 'history', label: 'History', icon: Users },
  { value: 'fiction', label: 'Fiction', icon: Star },
  { value: 'crime', label: 'Crime', icon: Users },
  { value: 'french', label: 'French', icon: Users },
  { value: 'english', label: 'English', icon: Users },
  { value: 'magical', label: 'Magical', icon: Zap },
  { value: 'mystery', label: 'Mystery', icon: Filter },
  { value: 'love', label: 'Love', icon: Star },
  { value: 'classic', label: 'Classic', icon: Star },
  { value: 'american', label: 'American', icon: Users },
] as const

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  searchTerm,
  selectedCategories,
  sortBy,
  onSearchChange,
  onCategoryToggle,
  onRemoveCategory,
  onSortChange,
  onClearFilters,
  hasFilters,
  postCount,
  filteredCount
}) => {
  const getSortLabel = (value: string): string => {
    const sortOption = SORT_OPTIONS.find(option => option.value === value)
    return sortOption?.label || value
  }

  const getCategoryLabel = (value: string): string => {
    const categoryOption = CATEGORY_OPTIONS.find(option => option.value === value)
    return categoryOption?.label || value
  }

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Discover Posts</h2>
        <p className="text-blue-100 text-sm">
          {hasFilters 
            ? `Showing ${filteredCount} of ${postCount} posts`
            : `${postCount} posts available`
          }
        </p>
      </div>
      
      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Search size={18} className="mr-2" />
          Search Posts
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      
      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Categories</h3>
          <div className="flex items-center gap-2">
            {selectedCategories.length > 0 && (
              <>
                <span className="text-xs text-gray-500">
                  {selectedCategories.length} selected
                </span>
                <button
                  onClick={() => selectedCategories.forEach(cat => onCategoryToggle(cat))}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </>
            )}
          </div>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {CATEGORY_OPTIONS.map((option) => {
            const Icon = option.icon
            const isSelected = selectedCategories.includes(option.value)
            
            return (
              <label
                key={option.value}
                className="flex items-center cursor-pointer group"
              >
                <div className={`
                  w-5 h-5 border rounded mr-3 flex items-center justify-center
                  transition-colors duration-200 shrink-0
                  ${isSelected 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300 group-hover:border-blue-400'
                  }
                `}>
                  {isSelected && (
                    <Check size={12} className="text-white" />
                  )}
                </div>
                <div className="flex items-center flex-1 min-w-0">
                  <Icon size={16} className="mr-2 text-gray-500 shrink-0" />
                  <span className={`
                    text-sm transition-colors truncate
                    ${isSelected ? 'text-blue-600 font-medium' : 'text-gray-700'}
                  `}>
                    {option.label}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onCategoryToggle(option.value)}
                  className="sr-only" 
                />
              </label>
            )
          })}
        </div>
      </div>
      
      {/* Sort */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Sort By</h3>
        <div className="space-y-2">
          {SORT_OPTIONS.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  sortBy === option.value
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} className="mr-3" />
                <span className="text-sm">{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Posts</span>
            <span className="font-semibold">{postCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Filtered Posts</span>
            <span className={`font-semibold ${
              filteredCount !== postCount ? 'text-blue-600' : ''
            }`}>
              {filteredCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Selected Categories</span>
            <span className="font-semibold">{selectedCategories.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Categories</span>
            <span className="font-semibold">{CATEGORY_OPTIONS.length}</span>
          </div>
        </div>
      </div>
      
      {/* Active Filters */}
      {hasFilters && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
          <div className="space-y-3 mb-4">
            {/* Search */}
            {searchTerm && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Search:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">"{searchTerm}"</span>
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
            
            {/* Categories */}
            {selectedCategories.length > 0 && (
              <div>
                <div className="text-sm text-gray-600 mb-2">
                  Categories ({selectedCategories.length}):
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map(category => (
                    <span 
                      key={category}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 text-xs rounded-lg"
                    >
                      <span className="font-medium">{getCategoryLabel(category)}</span>
                      <button
                        onClick={() => onRemoveCategory(category)}
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sort */}
            {sortBy !== 'newest' && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sorted by:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{getSortLabel(sortBy)}</span>
                  <button
                    onClick={() => onSortChange('newest')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onClearFilters}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <X size={16} />
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}
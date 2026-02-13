import React, { useState, useMemo } from 'react'
import { Layout } from '../layout/Layout'
import { PostFeed } from './PostFeed'
import { FiltersSidebar } from '../sidebar/FiltersSidebar'
import type { Post } from '../../api/types'

interface PostListProps {
  posts: Post[]
  isLoading?: boolean
  error?: string | null
  onRefresh?: () => void
}

export const PostList: React.FC<PostListProps> = ({ 
  posts,
  isLoading = false,
  error = null,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('newest')

  const limitedPosts = posts.slice(0, 50)

  const filteredPosts = useMemo(() => {
    let filtered = [...limitedPosts]

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(term) ||
        post.body.toLowerCase().includes(term) ||
        post.tags?.some(tag => tag.toLowerCase().includes(term))
      )
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(post => {
        const postTags = post.tags?.map(tag => tag.toLowerCase()) || []
        
        return selectedCategories.every(category => 
          postTags.some(tag => tag.includes(category.toLowerCase()))
        )
      })
    }

    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => b.id - a.id)
      case 'oldest':
        return filtered.sort((a, b) => a.id - b.id)
      case 'popular':
      case 'liked':
        return filtered.sort((a, b) => 
          (b.reactions?.likes || 0) - (a.reactions?.likes || 0)
        )
      case 'title-asc':
        return filtered.sort((a, b) => a.title.localeCompare(b.title))
      case 'title-desc':
        return filtered.sort((a, b) => b.title.localeCompare(a.title))
      default:
        return filtered
    }
  }, [limitedPosts, searchTerm, selectedCategories, sortBy])

  const hasFilters = Boolean(
    searchTerm.trim() || 
    selectedCategories.length > 0 || 
    sortBy !== 'newest'
  )

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategories([])
    setSortBy('newest')
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 font-medium mb-2">Error loading posts</div>
          <p className="text-red-500 text-sm">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    )
  }

  const sidebar = (
    <FiltersSidebar
      searchTerm={searchTerm}
      selectedCategories={selectedCategories}
      sortBy={sortBy}
      onSearchChange={setSearchTerm}
      onCategoryToggle={handleCategoryToggle}
      onRemoveCategory={handleRemoveCategory}
      onSortChange={setSortBy}
      onClearFilters={handleClearFilters}
      hasFilters={hasFilters}
      postCount={limitedPosts.length}
      filteredCount={filteredPosts.length}
    />
  )

  const mainContent = (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Posts Feed</h1>
            <p className="text-gray-600 mt-1">
              {hasFilters 
                ? `Showing ${filteredPosts.length} posts`
                : `Latest ${limitedPosts.length} posts from the community`
              }
            </p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Refresh Feed
            </button>
          )}
        </div>
      </div>

      <PostFeed posts={filteredPosts} />
    </div>
  )

  return <Layout sidebar={sidebar} main={mainContent} />
}
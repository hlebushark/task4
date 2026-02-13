import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Post as PostType } from '../../api/types'
import { 
  Heart, MessageCircle, Share2, Bookmark, MoreVertical,
  ThumbsUp, ThumbsDown,
  ExternalLink, ChevronDown, ChevronUp
} from 'lucide-react'

interface PostProps {
  post: PostType
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const reactions = post.reactions || { likes: 0, dislikes: 0 }
  const shortBody = post.body.length > 150 ? post.body.substring(0, 150) + '...' : post.body
  
  const handleLike = () => {
    setIsLiked(!isLiked)
    setIsDisliked(false)
  }
  
  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    setIsLiked(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* User info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {'user'+post.userId}
            </div>
            <div>
              <div className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                {'user'+post.userId}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Post #{post.id}</span>
              </div>
            </div>
          </div>
          
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={20} />
          </button>
        </div>
        
        {/* Post Header */}
        <Link 
          to="/posts/$postId" 
          params={{ postId: post.id.toString() }}
          className="block mb-3"
        >
          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
        </Link>
        
        {/* Post text */}
        <div className="mb-4">
          <p className={`text-gray-700 ${isExpanded ? '' : 'line-clamp-3'}`}>
            {isExpanded ? post.body : shortBody}
          </p>
          {post.body.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={16} className="mr-1" />
                  Show less
                </>
              ) : (
                <>
                  Read more
                  <ChevronDown size={16} className="ml-1" />
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Hashtags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Post stats*/}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ThumbsUp size={14} />
              <span>{reactions.likes} likes</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown size={14} />
              <span>{reactions.dislikes} dislikes</span>
            </div>
            <div>
              <span>{Math.floor(Math.random() * 50)} comments</span>
            </div>
          </div>
          
          <Link
            to="/posts/$postId"
            params={{ postId: post.id.toString() }}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ExternalLink size={14} className="mr-1" />
            Full post
          </Link>
        </div>
        
        {/* Actions */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            {/* Like/Dislike */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked 
                    ? 'bg-red-50 text-red-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                <span>Like</span>
              </button>
              
              <button
                onClick={handleDislike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isDisliked 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ThumbsDown size={18} />
                <span>Dislike</span>
              </button>
            </div>
            
            {/* Comment and share buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <MessageCircle size={18} />
                <span>Comment</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
                <Share2 size={18} />
                <span>Share</span>
              </button>
              
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg ${
                  isBookmarked 
                    ? 'text-yellow-500 hover:text-yellow-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Comments section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">Comments will be here...</div>
          </div>
        )}
      </div>
    </div>
  )
}
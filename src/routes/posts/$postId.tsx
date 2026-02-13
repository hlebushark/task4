import React from 'react'
import { useParams } from '@tanstack/react-router'
import { usePost, useDeletePost } from '../../hooks/usePosts'
import { Loader } from '../../components/ui/Loader'
import { Card } from '../../components/ui/Card'
import { useNavigate } from '@tanstack/react-router'
import { Trash2, ArrowLeft, ThumbsUp, ThumbsDown, Edit } from 'lucide-react'

export const PostDetailRoute: React.FC = () => {
  const { postId } = useParams({ from: '/posts/$postId' })
  const navigate = useNavigate()
  
  const { data: post, isLoading, error } = usePost(Number(postId))
  const deleteMutation = useDeletePost()

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteMutation.mutateAsync(Number(postId))
        navigate({ to: '/posts' })
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    }
  }

  const handleEdit = () => {
    navigate({ to: '/posts/create', search: { editId: postId } })
  }

  if (isLoading) return <Loader />
  if (error) return (
    <div className="text-center py-12">
      <div className="text-red-500 text-lg mb-2">Error loading post</div>
      <p className="text-gray-600">{error.message}</p>
    </div>
  )
  if (!post) return (
    <div className="text-center py-12">
      <div className="text-gray-500 text-lg mb-2">Post not found</div>
    </div>
  )

  const reactions = post.reactions || { likes: 0, dislikes: 0 }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate({ to: '/posts' })}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to posts</span>
      </button>
      
      <Card>
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Edit size={20} />
              <span>Edit</span>
            </button>
            
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center space-x-2 text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              <Trash2 size={20} />
              <span>Delete</span>
            </button>
          </div>
        </div>
        
        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 leading-relaxed">{post.body}</p>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-green-600">
              <ThumbsUp size={20} />
              <div>
                <div className="font-semibold">{reactions.likes}</div>
                <div className="text-xs text-gray-500">Likes</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-red-600">
              <ThumbsDown size={20} />
              <div>
                <div className="font-semibold">{reactions.dislikes}</div>
                <div className="text-xs text-gray-500">Dislikes</div>
              </div>
            </div>
          </div>
          
          <div className="text-gray-500 space-y-1">
            <div>
              <span className="font-medium">Post ID:</span> {post.id}
            </div>
            <div>
              <span className="font-medium">User ID:</span> {post.userId}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
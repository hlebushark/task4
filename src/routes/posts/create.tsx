import React from 'react'
import { useForm } from 'react-hook-form'
import { useCreatePost } from '../../hooks/usePosts'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Save } from 'lucide-react'
import type { CreatePostRequest } from '../../api/types'

// Интерфейс для формы (tags как строка)
interface CreatePostFormData {
  title: string
  body: string
  userId: number
  tags: string  // в форме это строка
  reactions?: { likes: number; dislikes: number }
}

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate()
  const createPost = useCreatePost()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    defaultValues: {
      title: '',
      body: '',
      userId: 1,
      tags: '',
    },
  })

  const onSubmit = async (formData: CreatePostFormData) => {
    try {
      // Преобразуем данные для API
      const apiData: CreatePostRequest = {
        title: formData.title,
        body: formData.body,
        userId: formData.userId,
        tags: formData.tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter(Boolean),
        reactions: { likes: 0, dislikes: 0 }
      }
      
      await createPost.mutateAsync(apiData)
      navigate({ to: '/posts' })
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('Failed to create post. Please try again.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate({ to: '/posts' })}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8"
      >
        <ArrowLeft size={20} />
        <span>Back to Posts</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Post</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              {...register('title', { 
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter post title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="body"
              rows={6}
              {...register('body', { 
                required: 'Content is required',
                minLength: {
                  value: 10,
                  message: 'Content must be at least 10 characters'
                }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.body ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Write your post content here..."
            />
            {errors.body && (
              <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              type="text"
              {...register('tags')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="react, typescript, tailwind"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter tags separated by commas (e.g., "react,typescript,tailwind")
            </p>
          </div>

          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <input
              id="userId"
              type="number"
              {...register('userId', { 
                valueAsNumber: true, 
                min: { value: 1, message: 'User ID must be at least 1' },
                max: { value: 100, message: 'User ID must be at most 100' }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.userId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.userId && (
              <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={createPost.isPending}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Save size={20} />
              {createPost.isPending ? 'Creating...' : 'Create Post'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate({ to: '/posts' })}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePostPage
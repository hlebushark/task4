import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreatePost, useUpdatePost, usePost } from '../../hooks/usePosts'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft, Save, Edit3 } from 'lucide-react'
interface CreatePostFormData {
  title: string
  body: string
  userId: number
  tags: string
}

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate()
  
  const search: { editId?: string } = useSearch({ from: '/posts/create' })
  const editId = search.editId ? parseInt(search.editId) : undefined
  
  const { data: existingPost, isLoading: isLoadingPost } = usePost(editId || 0)
  
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()
  
  const isEditMode = !!editId && !!existingPost
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<CreatePostFormData>({
    defaultValues: {
      title: '',
      body: '',
      userId: 1,
      tags: '',
    },
  })

  useEffect(() => {
    if (existingPost) {
      setValue('title', existingPost.title)
      setValue('body', existingPost.body)
      setValue('userId', existingPost.userId)
      setValue('tags', existingPost.tags?.join(', ') || '')
    }
  }, [existingPost, setValue])

  const onSubmit = async (formData: CreatePostFormData) => {
    try {
      const apiData = {
        title: formData.title,
        body: formData.body,
        userId: formData.userId,
        tags: formData.tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter(Boolean),
        reactions: { likes: 0, dislikes: 0 }
      }
      
      if (isEditMode && editId) {
        await updatePost.mutateAsync({ 
          id: editId, 
          data: apiData 
        })
        navigate({ to: `/posts/${editId}` })
      } else {
        await createPost.mutateAsync(apiData)
        navigate({ to: '/posts' })
      }
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('Failed to save post. Please try again.')
    }
  }

  const handleCancel = () => {
    if (isEditMode && editId) {
      navigate({ to: `/posts/${editId}` })
    } else {
      navigate({ to: '/posts' })
    }
  }

  if (isEditMode && isLoadingPost) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={handleCancel}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8"
      >
        <ArrowLeft size={20} />
        <span>Back to {isEditMode ? 'Post' : 'Posts'}</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          {isEditMode ? (
            <>
              <Edit3 className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
            </>
          ) : (
            <>
              <Save className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
            </>
          )}
        </div>

        {isEditMode && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              You are editing post #{editId}. Changes will be saved when you submit.
            </p>
          </div>
        )}

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
              disabled={createPost.isPending || updatePost.isPending}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Save size={20} />
              {createPost.isPending || updatePost.isPending 
                ? 'Saving...' 
                : isEditMode 
                  ? 'Update Post' 
                  : 'Create Post'
              }
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
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
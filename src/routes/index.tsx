import React from 'react'
import { Link } from '@tanstack/react-router'

const HomePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">Dummy Blog</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          SPA app built with React, TypeScript, TanStack Router & Query, and Tailwind CSS
        </p>
      </section>

      {/* CTA */}
      <section className="bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white mt-12">
        <h2 className="text-3xl font-bold mb-4">Get started</h2>
        <p className="mb-6 text-blue-100">
          Create, read, update, and delete blog posts with REST API integration.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/posts"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            View All Posts
          </Link>
          <Link
            to="/posts/create"
            className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10"
          >
            Create New Post
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import { App } from '../routes/__root'
import IndexPage from '../routes/index'
import CreatePostPage from '../routes/posts/create'

// Import route components
import { PostsRoute } from '../routes/posts/index'
import { PostsIndexRoute } from '../routes/posts/index'
import { PostDetailRoute } from '../routes/posts/$postId'

const rootRoute = createRootRoute({
  component: App,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
})

const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/posts',
  component: PostsRoute,
})

const postsIndexRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: '/',
  component: PostsIndexRoute,
})

const postDetailRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: '/$postId',
  component: PostDetailRoute,
})

const createPostRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: '/create',
  component: CreatePostPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  postsRoute.addChildren([
    postsIndexRoute,
    postDetailRoute,
    createPostRoute,
  ]),
])

export const router = createRouter({ routeTree })

export { PostsRoute, PostsIndexRoute, PostDetailRoute }

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
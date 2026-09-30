import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

export const queryClient = new QueryClient()

export function installVueQuery(app: Parameters<typeof VueQueryPlugin.install>[0]) {
    app.use(VueQueryPlugin, { queryClient })
}

// DEVTOOLS CODE
// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__:
      import('@tanstack/query-core').QueryClient
  }
}

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient
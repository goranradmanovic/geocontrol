import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

export const queryClient = new QueryClient()

export function installVueQuery(app: Parameters<typeof VueQueryPlugin.install>[0]) {
    app.use(VueQueryPlugin, { queryClient })
}
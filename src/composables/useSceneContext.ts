import { computed, type Ref } from 'vue'
import { useRoute } from 'vue-router'

import { useSceneQuery } from '@/queries/scenes'

export function useSceneContext(sceneId: Ref<string | null>) {
    const route = useRoute()

    const routeSceneId = computed(() => {
        const value = route.query.scene

        return typeof value === 'string' ? value : null
    })

    const effectiveSceneId = computed(() => sceneId ?? routeSceneId.value)

    const sceneQuery = useSceneQuery(effectiveSceneId.value)

    return {
        sceenId: effectiveSceneId,
        scene: sceneQuery.data,
        isLoading: sceneQuery.isLoading,
        isError: sceneQuery.isError,
        error: sceneQuery.error
    }
}
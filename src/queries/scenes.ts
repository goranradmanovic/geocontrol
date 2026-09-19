import { useQuery } from '@tanstack/vue-query'
import { getScenes,getScene } from '@/api/sceneApi'

export function useScenesQuery() {
    return useQuery({
        queryKey: ['scenes'],
        queryFn: getScenes
    })
}

export function useSceneQuery(sceneId: string) {
    return useQuery({
        queryKey: ['scenes', sceneId],
        queryFn: () => getScene(sceneId)
    })
}
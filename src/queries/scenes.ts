import { useQuery } from '@tanstack/vue-query'
import { getScenes, getScene, getSceneGeoFeature, getFeatureCollection } from '@/api/sceneApi'

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

export function useScenegeoQuery() {
    return useQuery({
        queryKey: ['scenegeo'],
        queryFn: () => getSceneGeoFeature()
    })
}

// Feature query
export function useSceneFeaturesQuery() {
    return useQuery({
        queryKey: ['scenefeatures'],
        queryFn: getFeatureCollection
    })
}
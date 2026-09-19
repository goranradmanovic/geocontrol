import { useQuery } from "@tanstack/vue-query"
import type { MaybeRef } from 'vue'
import { getDetection, getDetections, getSceneDetections } from '@/api/detectionApi'

export function useDetectionsQuery() {
    return useQuery({
        queryKey: ['detections'],
        queryFn: getDetections
    })
}

export function useSceneDetectionsQuery(sceneId: MaybeRef<string | null>) {
    return useQuery({
        queryKey: ['detections', 'scene', sceneId],
        queryFn: () => {
            const id = typeof sceneId === 'string' ? sceneId : sceneId?.value

            if (!id) throw new Error('Scene ID is required.')

            return getSceneDetections(id)
        },
        enabled: () => {
            const id = typeof sceneId === 'string' ? sceneId : sceneId?.value

            return Boolean(id)
        }
    })
}

export function useDetectionQuery(detectionId: string) {
    return useQuery({
        queryKey: ['detections', detectionId],
        queryFn: () => getDetection(detectionId)
    })
}
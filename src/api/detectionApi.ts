import { ApiClient } from "./ApiClient"
import { detectionSchema, detectionsSchema } from "@/queries/detections_schemas"
import type { Detection } from "@/queries/detections_schemas"

export async function getDetections(): Promise<Detection[]> {
    const response = await ApiClient.get('/detections')

    return detectionsSchema.parse(response.data)
}

export async function getDetection(id: string): Promise<Detection> {
    const response = await ApiClient.get(`/detections/${id}`)

    return detectionSchema.parse(response.data)
}

export async function getSceneDetections(sceneId: string): Promise<Detection[]> {
    const response = await ApiClient.get(`/scenes/${sceneId}/detections`)

    return detectionsSchema.parse(response.data)
}
import { ApiClient } from './ApiClient'
import type { SceneProperties } from '@/types/scene'
import { sceneSchema, scenesSchema } from '@/queries/scenes_schemas'

export async function getScenes(): Promise<SceneProperties[]> {
    const response = await ApiClient.get('/scenes')

    return scenesSchema.parse(response.data)
}

export async function getScene(id: string): Promise<SceneProperties> {
    const response = await ApiClient.get(`/scenes/${id}`)

    return sceneSchema.parse(response.data)
}
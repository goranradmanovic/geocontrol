import { ApiClient } from './ApiClient'
import type { SceneProperties, SceneFeatureCollection, SceneGeos } from '@/types/scene'
import { sceneSchema, scenesSchema, scenegeoSchema, SceneFeatureCollectionSchema } from '@/queries/scenes_schemas'

export async function getScenes(): Promise<SceneProperties[]> {
    const response = await ApiClient.get('/scenes')

    return scenesSchema.parse(response.data)
}

export async function getScene(id: string): Promise<SceneProperties> {
    const response = await ApiClient.get(`/scenes/${id}`)

    return sceneSchema.parse(response.data)
}

export async function getSceneGeoFeature(): Promise<SceneGeos> {
    const response = await ApiClient.get('/scenegeo')

    return scenegeoSchema.parse(response.data)
}

export async function getFeatureCollection(): Promise<SceneFeatureCollection> {
    const propertiesList = await getScenes()
    const featureCollection = await getSceneGeoFeature()

    // Create a Map for fast O(1) lookup by ID
    const propertiesMap = new Map(
        propertiesList.map((props) => [props.id, props])
    )

    const features = featureCollection.features.map((geo) => {
        // Find matching properties or default to empty object
        const properties = propertiesMap.get(geo.id) ?? {}

        return {
            id: geo.id,
            type: "Feature" as const, // Crucial for valid GeoJSON
            geometry: geo.geometry,
            properties: properties
        }
    })

    const featureCollectionMerged = {
        type: "FeatureCollection" as const, // Crucial for valid GeoJSON
        features
    }

    return SceneFeatureCollectionSchema.parse(featureCollectionMerged)
}
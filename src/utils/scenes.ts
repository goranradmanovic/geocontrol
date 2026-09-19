import scenesGeoJson from '../data/scenes.geojson?raw'
import type { SceneProperties } from '../types/scene'
import type { Feature, Polygon } from 'geojson'


export function getScenes(): SceneProperties[] {
    const scenes = JSON.parse(scenesGeoJson)
    return scenes.features.map(
        (feature: object) => feature?.properties as SceneProperties
    )
}

export function getSceneFeature(sceneId: string): Feature<Polygon> | null {
    const feature = scenesGeoJson.find(
        (feature: object) => feature.properties?.id === sceneId
    )

    if (!feature) return null

    return feature as Feature<Polygon>
}
import { ref, type EmitFn } from 'vue'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import type VectorSource from 'ol/source/Vector'
import type { SceneProperties } from '@/type/scene'

export function useOlScenes(sceneSource: VectorSource) {
    const selectedSceneId = ref<string | null>(null)

    const defaultStyle = new Style({
        fill: new Fill({ color: 'rgba(33, 150, 243, 0.2)' }),
        stroke: new Stroke({ color: '#2196f3', width: 2 })
    })

    const selectedStyle = new Style({
        fill: new Fill({ color: 'rgba(255, 193, 7, 0.35)' }),
        stroke: new Stroke({ color: '#ffc107', width: 3 })
    })

    function setScene(geojson: GeoJSON.GeoJSON) {
        const format = new GeoJSON()

        const features = format.readFeatures(geojson, { featureProjection: 'EPSG:3857' })

        features.forEach(feature => feature.setStyle(defaultStyle))

        sceneSource.clear()
        sceneSource.addFeatures(features)
    }

    function selectScene(sceneId: string, emit: EmitFn) {
        if (!sceneId) return null

        console.log('Selecting scene:', sceneId)

        const feature = getSceneFeature(sceneId)

        if (!feature) {
            console.warn('Scene not found:', sceneId)
            return null
        }

        selectedSceneId.value = sceneId

        // Reset all scene styles
        sceneSource.getFeatures().forEach(feature => feature.setStyle(defaultStyle))

        // Select requested scene
        feature.setStyle(selectedStyle)

        // Emit selected scene to parent
        emit('sceneSelected', feature.getProperties() as SceneProperties)

        return feature.getGeometry()
    }

    function clearSelection() {
        selectedSceneId.value = null

        sceneSource.getFeatures().forEach(feature => feature.setStyle(defaultStyle))
    }

    function getSceneFeature(sceneId: string): Feature | undefined {
        return sceneSource.getFeatures().find(feature => feature.get('id') === sceneId)
    }

    function sceneHandleClick(map: any, emit: EmitFn): void {
        // Store the currently selected feature outside the click handler
        let selectedFeature: Feature | null = null

        map.on('singleclick', (event: any) => {
            let hit = false

            map?.forEachFeatureAtPixel(event?.pixel, (feature: Feature) => {
                const properties = feature.getProperties()

                // Check if the clicked feature is a scene
                if (properties.id?.startsWith('scene-')) {
                    hit = true

                    // If clicking a DIFFERENT feature, reset the previous feature's style
                    if (selectedFeature && selectedFeature !== feature) {
                        selectedFeature.setStyle(undefined) // Resets to default layer style
                    }

                    // Apply selected style to the newly clicked feature
                    feature.setStyle(selectedStyle)
                    selectedFeature = feature

                    const scene: SceneProperties = {
                        id: properties.id,
                        name: properties.name,
                        status: properties.status,
                        area: properties.area,
                        description: properties.description,
                        cloudCoverage: properties.cloudCoverage
                    }

                    emit('sceneSelected', scene)
                    return true // Stop iteration over other overlapping features at pixel
                }
            })

            // If click happened on blank space / outside any valid feature
            if (!hit) {
                if (selectedFeature) {
                    selectedFeature.setStyle(undefined)
                    selectedFeature = null
                    clearSelection()
                }

                emit('sceneSelected', null)
            }
        })
    }

    return {
        selectedSceneId,
        setScene,
        selectScene,
        clearSelection,
        getSceneFeature,
        sceneHandleClick
    }
}
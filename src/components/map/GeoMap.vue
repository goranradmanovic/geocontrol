<template>
    <div ref="mapElement" class="map" />
</template>

<script lang="ts" setup>
    import { ref, watch, onMounted, onUnmounted, markRaw } from 'vue'
    import Map from 'ol/Map'
    import View from 'ol/View'
    import GeoJSON from 'ol/format/GeoJSON'
    import TileLayer from 'ol/layer/Tile'
    import VectorLayer from 'ol/layer/Vector'
    import VectorSource from 'ol/source/Vector'
    import OSM from 'ol/source/OSM'
    import { Fill, Stroke, Style, Circle } from 'ol/style'
    import { fromLonLat } from 'ol/proj'
    import type Feature from 'ol/Feature'
    import scenesGeoJson from '@/data/scenes.geojson?raw'
    import detectionsGeoJson from '@/data/detections.geojson?raw'
    import type { SceneProperties } from '@/types/scene'
    import type { LayerState } from '@/types/layer'

    const props = defineProps<{
        layers: LayerState
    }>()

    const emit = defineEmits<{
        sceneSelected: [scene: SceneProperties]
    }>()

    watch(() => props.layers, (layers) => {
        baseLayer?.setVisible(layers.baseMap)
        baseLayer?.setOpacity(parseFloat(layers.baseMapOpacity))

        sceneLayer?.setVisible(layers.scenes)
        scenesOpacity = parseFloat(layers.scenesOpacity)
        sceneLayer?.changed()

        detectionLayer?.setVisible(layers.detections)
    }, { deep: true })

    // Variables section
    const mapElement = ref<HTMLDivElement | null>(null)
    const initialZoom: number = 10
    const detectionColors: Record<string, string> = {
        building: '#E53935', // Red
        vehicle: '#4CAF50', // Green
        default: '#FF9800' // Orange
    }

    let map: Map | null = null
    let baseLayer: TileLayer<OSM> | null = null
    let sceneLayer: VectorLayer<VectorSource> | null = null
    let detectionLayer: VectorLayer<VectorSource> | null = null
    let selectedFeature: Feature | null = null

    let scenesOpacity: number = parseFloat(props.layers.scenesOpacity)
    
    // Method section 
    const initMap = () => {
        if (!mapElement.value) return

        // ** BASE SECTION **
        baseLayer = new TileLayer({ 
            source: new OSM(), 
            opacity: parseFloat(props.layers.baseMapOpacity)
        })
        baseLayer.setVisible(props.layers.baseMap)
        baseLayer.setOpacity(parseFloat(props.layers.baseMapOpacity))
        baseLayer.setZIndex(0)

        const sceneSource = new VectorSource({
            features: new GeoJSON().readFeatures(scenesGeoJson, { featureProjection: 'EPSG:3857' })
        })

        // Default scene style
        const defaultSceneStyleFunction = () => {
            return new Style({
                fill: new Fill({
                    // Dynamically evaluates scenesOpacity every time the map redraws
                    color: `rgba(33, 150, 243, ${scenesOpacity})` 
                }),
                stroke: new Stroke({
                    color: '#1976D2',
                    width: 2
                })
            })
        }

        const selectedSceneStyle = new Style({
            fill: new Fill({
                color: 'rgba(255, 193, 7, 0.35)'
            }),
            stroke: new Stroke({
                color: '#F57C00',
                width: 3
            })
        })
        
        sceneLayer = new VectorLayer({
            source: sceneSource,
            style: defaultSceneStyleFunction
        })
        sceneLayer.setVisible(props.layers.scenes)
        sceneLayer.setOpacity(parseFloat(props.layers.scenesOpacity))
        sceneLayer.setZIndex(10)

        // ** DETECTION SECTION **
        // Detection source
        const detectionSource = new VectorSource({
            features: new GeoJSON().readFeatures(detectionsGeoJson, { featureProjection: 'EPSG:3857' })
        })

        // Detection style
        const detectionStyleFunction = (feature: any) => {
            // If the feature is missing or null, return nothing.
            if (!feature) return null

            // Get properties object from feature
            const properties = feature.getProperties()
            const typeValue = properties.type // Match building, vehicle etc

            // Determine color based on type property
            const fillColor = detectionColors[typeValue] || detectionColors.default

            return new Style({
                image: new Circle({
                    radius: 7,
                    fill: new Fill({ color: fillColor }),
                    stroke: new Stroke({ color: '#FFFFFF', width: 2 })
                })
            })
        }

        detectionLayer = new VectorLayer({
            source: detectionSource,
            style: detectionStyleFunction
        })
        detectionLayer.setVisible(props.layers.detections)
        detectionLayer.setZIndex(20)


        // MAP INSTANCE
        map = markRaw(
            new Map({
                target: mapElement.value,
                layers: [
                    baseLayer,
                    sceneLayer,
                    detectionLayer
                ],
                view: new View({
                    center: fromLonLat([16.95, 45.25]), // Order - [longitude, latitude] | fromLonLat() performs the appropriate transformation for the map's projection. Convert long, lat - EPSG:4326 to the map projection Web Mercator EPSG:3857
                    zoom: initialZoom
                })
            })
        )

        // CLICK EVENT HANDLER
        map.on('singleclick', (event) => {
            let hit = false

            map?.forEachFeatureAtPixel(event.pixel, (feature) => {

                if (selectedFeature) {
                    selectedFeature.setStyle(defaultSceneStyleFunction())
                }

                selectedFeature = feature as Feature
                selectedFeature.setStyle(selectedSceneStyle)

                const properties = feature.getProperties()

                if (!properties.id?.startsWith('scene-')) return

                const scene: SceneProperties = {
                    id: properties.id,
                    name: properties.name,
                    status: properties.status,
                    area: properties.area,
                    description: properties.description
                }

                emit('sceneSelected', scene)
                hit = true
                return true // Stop iterating after finding the first feature
            })

            // If the click lands outside any polygon feature
            if (!hit) {
                if (selectedFeature) {
                    selectedFeature.setStyle(undefined)
                    selectedFeature = null
                }

                // Proactively emit null or a specific clear state
                emit('sceneSelected', null) 
            }
        })
    }

    const destroyMap = () => {
        map?.setTarget(undefined)
        map = null
        baseLayer = null
        sceneLayer = null
        detectionLayer = null
    }

    onMounted(() => {
        initMap()
    })

    onUnmounted(() => {
        destroyMap()
    })
</script>
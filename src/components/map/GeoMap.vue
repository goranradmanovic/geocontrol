<template>
    <div ref="mapElement" class="map" />
</template>

<script lang="ts" setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import Map from 'ol/Map'
    import View from 'ol/View'
    import GeoJSON from 'ol/format/GeoJSON'
    import TileLayer from 'ol/layer/Tile'
    import VectorLayer from 'ol/layer/Vector'
    import VectorSource from 'ol/source/Vector'
    import OSM from 'ol/source/OSM'
    import { Fill, Stroke, Style } from 'ol/style'
    import { fromLonLat } from 'ol/proj'
    import type Feature from 'ol/Feature'
    import scenesGeoJson from '@/data/scenes.geojson?raw'
    import type { SceneProperties } from '@/types/scene'

    const emit = defineEmits<{
        sceneSelected: [scene: SceneProperties]
    }>()

    // Variables section
    const mapElement = ref<HTMLDivElement | null>(null)
    const initialZoom: number = 10

    let map: Map | null = null
    let sceneLayer: VectorLayer<VectorSource>
    let selectedFeature: Feature | null = null
    
    // Method section 
    const initMap = () => {
        if (!mapElement.value) return

        const sceneSource = new VectorSource({
            features: new GeoJSON().readFeatures(scenesGeoJson, { featureProjection: 'EPSG:3857' })
        })

        const defaultSceneStyle = new Style({
            fill: new Fill({
                color: 'rgba(33, 150, 243, 0.25)'
            }),
            stroke: new Stroke({
                color: '#1976D2',
                width: 2
            })
        })

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
            style: defaultSceneStyle
        })

        map = new Map({
            target: mapElement.value,
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                sceneLayer
            ],
            view: new View({
                center: fromLonLat([16.95, 45.25]), // Order - [longitude, latitude] | fromLonLat() performs the appropriate transformation for the map's projection. Convert long, lat - EPSG:4326 to the map projection Web Mercator EPSG:3857
                zoom: initialZoom
            })
        })

        // Click event
        map.on('singleclick', (event) => {
            let hit = false

            map?.forEachFeatureAtPixel(event.pixel, (feature) => {

                if (selectedFeature) {
                    selectedFeature.setStyle(defaultSceneStyle)
                }

                selectedFeature = feature as Feature
                selectedFeature.setStyle(selectedSceneStyle)

                const properties = feature.getProperties()

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
    }

    onMounted(() => {
        initMap()
    })

    onUnmounted(() => {
        destroyMap()
    })
</script>
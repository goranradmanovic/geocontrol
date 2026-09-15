<template>
    <div ref="mapElement" class="map" />
</template>

<script lang="ts" setup>
    import { ref, watch, onMounted, onUnmounted, markRaw } from 'vue'
    import Map from 'ol/Map'
    import View from 'ol/View'
    import GeoJSON from 'ol/format/GeoJSON'
    import Draw from 'ol/interaction/Draw'
    import TileLayer from 'ol/layer/Tile'
    import VectorLayer from 'ol/layer/Vector'
    import VectorSource from 'ol/source/Vector'
    import OSM from 'ol/source/OSM'
    import XYZ from 'ol/source/XYZ'
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
        sceneSelected: [scene: SceneProperties],
        aoiSelected: [geoJson: GeoJSON.Feature],
        aoiCleared: []
    }>()

    watch(() => props.layers, (layers) => {
        // 1. Base Layer
        baseLayer?.setVisible(Boolean(layers.baseMap.visible))
        baseLayer?.setOpacity(Number(layers.baseMap.opacity))

        // 2. Imagery Layer
        imageryLayer?.setVisible(Boolean(layers.imagery.visible))
        imageryLayer?.setOpacity(Number(layers.imagery.opacity))

        // 3. Imagery Source URL update
        if (imageryLayer && layers.imagery.type) {
            const currentUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/${layers.imagery.type}/MapServer/tile/{z}/{y}/{x}`
            const currentSource = imageryLayer.getSource() as XYZ
            const urls = currentSource?.getUrls()

            if (!urls || urls[0] !== currentUrl) {
                imageryLayer.setSource(new XYZ({ url: currentUrl }))
            }
        }

        // 4. Scenes Layer
        sceneLayer?.setVisible(Boolean(layers.scenes.visible))
        scenesOpacity = Number(layers.scenes.opacity)
        sceneLayer?.changed()

        // 5. Detection Layer
        detectionLayer?.setVisible(Boolean(layers.detections.visible))
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
    let imageryLayer: TileLayer<XYZ> | null = null
    let sceneLayer: VectorLayer<VectorSource> | null = null
    let detectionLayer: VectorLayer<VectorSource> | null = null
    let aoiLayer: VectorLayer<VectorSource> | null = null
    let aoiSource: VectorSource | null = null
    let drawInteraction: Draw | null = null
    let selectedFeature: Feature | null = null

    let scenesOpacity: number = 0.5
    
    // Method section 
    const initMap = () => {
        if (!mapElement.value) return

        // ** BASE SECTION **
        baseLayer = new TileLayer({ 
            source: new OSM(), 
            opacity: Number(props.layers.baseMap.opacity)
        })
        baseLayer.setVisible(Boolean(props.layers.baseMap.visible))
        baseLayer.setOpacity(Number(props.layers.baseMap.opacity))
        baseLayer.setZIndex(0)

        // ** IMAGERY SOURCE / SATTELITE SOURCE
        imageryLayer = new TileLayer({
            source: new XYZ({
                url: `https://server.arcgisonline.com/ArcGIS/rest/services/${props.layers.imagery.type}/MapServer/tile/{z}/{y}/{x}`
            }),
            visible: false,
            opacity: Number(props.layers.imagery.opacity)
        })

        imageryLayer.setVisible(Boolean(props.layers.imagery.visible))
        imageryLayer.setZIndex(10)

        // ** SCENE SOURCE
        const sceneSource = new VectorSource({
            features: new GeoJSON().readFeatures(scenesGeoJson, { featureProjection: 'EPSG:3857' })
        })

        scenesOpacity = Number(props.layers.scenes.opacity)

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
        sceneLayer.setVisible(Boolean(props.layers.scenes.visible))
        sceneLayer.setOpacity(Number(props.layers.scenes.opacity))
        sceneLayer.setZIndex(20)

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
        detectionLayer.setVisible(Boolean(props.layers.detections.visible))
        detectionLayer.setZIndex(30)

        // AOI Layer
        aoiSource = new VectorSource()
        aoiLayer = new VectorLayer({
            source: aoiSource,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(33, 150, 243, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#1976d2',
                    width: 2,
                    lineDash: [6, 6]
                })
            })
        })

        // MAP INSTANCE
        map = markRaw(
            new Map({
                target: mapElement.value,
                layers: [
                    baseLayer, // 1
                    imageryLayer, // 3
                    sceneLayer, // 4
                    detectionLayer, // 5
                    aoiLayer, // 2
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

    // Function for drawing API on the map
    function startDrawing() {
        if (!aoiSource || !map) return

        aoiSource.clear()

        if (drawInteraction) {
            map.removeInteraction(drawInteraction)
        }

        // draw a polygon
        drawInteraction = new Draw({
            source: aoiSource,
            type: 'Polygon'
        })

        map.addInteraction(drawInteraction)

        drawInteraction.on('drawend', (event) => {
            const feature = event.feature
            const geometry = feature.getGeometry()

            if (!geometry) return

            // Projection conversion
            const geoJson = new GeoJSON().writeFeatureObject(feature, {
                featureProjection: 'EPSG:3857', // Web Mercator is used for the map projection
                dataProjection: 'EPSG:4326' // GeoJSON geographic coordinates longitude/latitude
            })

            //console.log('Drawn geometry: ', geometry)
            //console.log('GeoJSON: ', geoJson)

            emit('aoiSelected', geoJson)

            if (drawInteraction && map) {
                map.removeInteraction(drawInteraction)
                drawInteraction = null
            }
        })
    }

    function clearAoi() {
        if (!aoiSource) return

        aoiSource.clear()

        if (drawInteraction && map) {
            map.removeInteraction(drawInteraction)
            drawInteraction = null
        }

        emit('aoiCleared')
    }

    defineExpose({
        startDrawing,
        clearAoi
    })

    onMounted(() => {
        initMap()
    })

    onUnmounted(() => {
        destroyMap()
    })
</script>
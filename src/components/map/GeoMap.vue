<template>
    <div ref="mapElement" class="map" />
</template>

<script setup lang="ts">
    import { onMounted, ref, watch, toRef } from 'vue'
    import type { Detection } from '@/queries/detections_schemas'

    // Types
    import type { SceneProperties, SceneGeos } from '@/types/scene'
    import type { LayerState } from '@/types/layer'

    // OL packages
    import XYZ from 'ol/source/XYZ'

    // OL Composables
    import { useOlMap } from '@/composables/ol/useOlMap'
    import { useOlLayers } from '@/composables/ol/useOlLayers'
    import { useOlScenes } from '@/composables/ol/useOlScenes'
    import { useOlDetections } from '@/composables/ol/useOlDetections'
    import { useOlDraw } from '@/composables/ol/useOlDraw'

    const props = defineProps<{
        detections: Detection[],
        layers: LayerState,
        features: SceneGeos,
        sceneId: string,
        detectionConfidence: number
    }>()

    const emit = defineEmits<{
        detectionSelected: [detection: Detection | null],
        sceneSelected: [scene: SceneProperties | null],
        aoiSelected: [geoJson: GeoJSON.Feature]
    }>()

    watch(() => props.features, 
        (features) => {
            setScene(features)

            if (props.sceneId) {
                selectAndZoomScene(props.sceneId)
            }
        },
        { deep: true }
    )
    
    watch(() => props.detections, 
        (detections) => {
            setDetections(detections)
            updateDetectionFeatures(detections)
        },
        { deep: true }
    )
    
    // Watch for changes from Map Control and apply chnages to the layers
    watch(() => props.layers, (layers) => {
        // 1. Base Layer
        setLayerVisibility(baseLayer, Boolean(layers.baseMap.visible))
        setLayerOpacity(baseLayer, Number(layers.baseMap.opacity))

        // 2. Imagery Layer
        setLayerVisibility(imageryLayer, Boolean(layers.imagery.visible))
        setLayerOpacity(imageryLayer, Number(layers.imagery.opacity))

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
        setLayerVisibility(sceneLayer, Boolean(layers.scenes.visible))
        setLayerOpacity(sceneLayer, Number(layers.scenes.opacity))
        sceneLayer?.changed()

        // 5. Detection Layer
        setLayerVisibility(detectionLayer, Boolean(layers.detections.visible))
        setLayerVisibility(detectionPulseLayer, Boolean(layers.detections.visible))
    }, { deep: true })

    watch(() => props.sceneId, (sceneId) => {
        if (!sceneId || !map.value) return

        selectAndZoomScene(sceneId)
    })

    const mapElement = ref<HTMLElement | null>(null)

    const { map, createMap } = useOlMap()

    const {
        baseLayer,
        imageryLayer,
        sceneLayer,
        sceneSource,
        detectionLayer,
        detectionPulseLayer,
        detectionSource,
        aoiLayer,
        aoiSource,
        setLayerVisibility,
        setLayerOpacity
    } = useOlLayers()

    const { setDetections, selectDetection, updateDetectionFeatures, detectionHandleClick } = useOlDetections(detectionSource, detectionLayer, toRef(props, 'detectionConfidence'))

    const { startDrawing, clearAoi, isDrawing } = useOlDraw(map, aoiSource)

    const { setScene, selectScene, sceneHandleClick } = useOlScenes(sceneSource)

    function selectAndZoomScene(sceneId: string) {
        if (!map.value) return

        const geometry = selectScene(sceneId, emit)

        if (!geometry) {
            console.warn('Could not select scene because feature is not available:', sceneId)
            return
        }

        map.value.getView().fit(geometry.getExtent(), {
            padding: [80, 80, 80, 80],
            duration: 2000,
            maxZoom: 15
        })
    }

    function initMap() {
        if (!mapElement.value) return
        
        const olMap = createMap(
            mapElement.value,
            [16.95, 45.25],
            10
        )

        olMap.addLayer(baseLayer)
        olMap.addLayer(imageryLayer)
        olMap.addLayer(sceneLayer)
        olMap.addLayer(detectionPulseLayer)
        olMap.addLayer(detectionLayer)
        olMap.addLayer(aoiLayer)

        setScene(props.features)
        setDetections(props.detections)

        // Event handler
        sceneHandleClick(olMap, emit)
        detectionHandleClick(olMap, emit)

        // Select scene from URL
        if (props.sceneId) {
            selectAndZoomScene(props.sceneId)
        }
    }

    defineExpose({
        startDrawing: () => startDrawing(emit),
        clearAoi
    })

    onMounted(() => initMap())
</script>
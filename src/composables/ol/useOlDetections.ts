import { ref, watch, type EmitFn, type Ref } from 'vue'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import type VectorSource from 'ol/source/Vector'
import type VectorLayer from 'ol/layer/Vector'
import type WebGlVectorLayer from 'ol/layer/WebGLVector'
import { fromLonLat } from 'ol/proj'
import CircleStyle from 'ol/style/Circle'
import { Fill, Stroke, Style } from 'ol/style'
import type { Detection } from '@/queries/detections_schemas'

export function useOlDetections(detectionSource: VectorSource, detectionLayer: VectorLayer | WebGlVectorLayer,  confidence: Ref<number>) {
    const selectedDetectionId = ref<string | null>(null)
    const detectionColors: Record<string, string> = {
        building: '#E53935', // Red
        vehicle: '#4CAF50', // Green
        default: '#FF9800' // Orange
    }

    function setConfidenceFilter(value: number, detectionLayer: VectorLayer | WebGlVectorLayer) {
        if (!detectionLayer) return

        detectionLayer.value?.setStyle({
            filter: [
                '>=',
                ['get', 'confidence'],
                value
            ],

            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', 'confidence'],
                0, 5,
                1, 15
            ],

            'circle.fill-color': [
                'match',
                ['get', 'type'],
                'building', '#e53935',
                'vehicle', '#43a047',
                '#ff9800' // Default color
            ],

            'circle-strok-color': '#ffffff',
            'circle-strok-width': 2
        })
    }

    watch(confidence, value => {
        setConfidenceFilter(value, detectionLayer)
    }, { immediate: true })

    const selectedStyle = new Style({
        image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: '#4292C6' }),
            stroke: new Stroke({ color: '#ffffff', width: 3 })
        })
    })

    function createDefaultStyle(color: string): Style {
        return new Style({
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({ color }),
                stroke: new Stroke({ color: '#ffffff', width: 2 })
            })
        })
    }

    function getDetectionColor(type: string): string {
        return detectionColors[type] || detectionColors.defaults
    }

    function setDetections(detections: Detection[]) {
        const features = detections.map(detection => {
            const feature = new Feature({
                geometry: new Point(fromLonLat(detection.coordinates))
            })

            feature.setProperties({
                id: detection.id,
                sceneId: detection.sceneId,
                type: detection.type,
                confidence: detection.confidence,
                detection
            })
            
            const color = getDetectionColor(detection.type)

            feature.setStyle(createDefaultStyle(color))

            return feature
        })

        detectionSource.clear()
        detectionSource.addFeatures(features)
    }

    function selectDetection(detectionId: string) {
        selectedDetectionId.value = detectionId

        detectionSource.getFeatures().forEach(feature => {
            const id = feature.get('id')

            if (id === detectionId) {
                feature.setStyle(selectedStyle)
            } else {
                const detection = feature.get('detection') as Detection

                feature.setStyle(
                    createDefaultStyle(
                        getDetectionColor(detection.type)
                    )
                )
            }
        })
    }

    function clearSelection() {
        selectedDetectionId.value = null

        detectionSource.getFeatures().forEach(feature => {
            feature.setStyle(
                createDefaultStyle(
                    getDetectionColor(detectionColors.type)
                )
            )
        })
    }

    function getDetectionFeature(detectionId: string): Feature | undefined {
        return detectionSource.getFeatures().find(feature => feature.get('id') === detectionId)
    }

    function updateDetectionFeatures(detections: Detection[]) {
        if (!detectionSource) return

        detectionSource.clear()

        const features = detections.map((detection) => {
            const feature = new Feature({
                geometry: new Point(fromLonLat(detection.coordinates))
            })

            feature.setProperties({
                id: detection.id,
                sceneId: detection.sceneId,
                type: detection.type,
                confidence: detection.confidence,
                detection: detection
            })

            const color = getDetectionColor(detection.type)

            feature.setStyle(createDefaultStyle(color))
            feature.set('id', detection.id)
            feature.set('detection', detection)
            feature.set('type', detection.type)
            feature.set('confidence', detection.confidence)

            return feature
        })

        detectionSource.addFeatures(features)
    }

    function detectionHandleClick(map: any, emit: EmitFn): void {
        // Store the currently selected feature outside the click handler
        let selectedFeature: Feature | null = null

        map.on('singleclick', (event: any) => {
            let hit = false

            map?.forEachFeatureAtPixel(event?.pixel, (feature: Feature) => {
                hit = true

                // If clicking a DIFFERENT feature, reset the previous feature's style
                if (selectedFeature && selectedFeature !== feature) {
                    const detection = selectedFeature.get('detection') as Detection
                    
                    if (detection) {
                        selectedFeature.setStyle(
                            createDefaultStyle(
                                getDetectionColor(detection.type)
                            )
                        )
                    }
                }

                selectedFeature = feature

                const detection = selectedFeature.get('detection') as Detection | undefined
                
                if (detection) {
                    feature.setStyle(selectedStyle)
                    emit('detectionSelected', detection)
                    return true
                }
            })

            // If click happened on blank space / outside any valid feature
            if (!hit) {
                if (selectedFeature) {
                    clearSelection()
                }

                emit('detectionSelected', null)
            }
        })
    }

    return {
        selectedDetectionId,
        setDetections,
        selectDetection,
        clearSelection,
        getDetectionFeature,
        updateDetectionFeatures,
        detectionHandleClick,
        setConfidenceFilter
    }
}

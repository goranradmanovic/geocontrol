import { ref, onBeforeUnmount, onMounted } from 'vue'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import { XYZ } from 'ol/source'
import WebGlVectorLayer from 'ol/layer/WebGLVector'

export function useOlLayers(imageryType: string) {
    let animationFrameId: number | null = null

    const baseLayer = new TileLayer({ source: new OSM(), zIndex: 0 })

    const imageryLayer = new TileLayer({
        source: new XYZ({
            url: `https://server.arcgisonline.com/ArcGIS/rest/services/${imageryType}/MapServer/tile/{z}/{y}/{x}`
        }),
        visible: false,
        opacity: 0.7,
        zIndex: 1
    })

    const sceneSource = new VectorSource()
    const sceneLayer = new VectorLayer({ source: sceneSource, zIndex:2 })

    const detectionSource = new VectorSource()
    //const detectionLayer = new VectorLayer({ source: detectionSource, zIndex: 3 })
    const detectionLayer = new WebGlVectorLayer({
        source: detectionSource,
        style: {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', 'confidence'],
                0, 5,
                1, 15
            ],
            'circle-fill-color': [
                'match',
                ['get', 'type'],
                'building', '#e53935',
                'vehicle', '#43a047',
                '#ff9800' // Default color
            ],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2
        },
        zIndex: 3
    })

    const detectionPulseLayer = new WebGlVectorLayer({
        source: detectionSource,
        style: {
            'circle-radius': [
                '+',
                10,
                [
                    '*',
                    8,
                    [
                        '/',
                            [
                                '+',
                                1,
                                [
                                    'sin',
                                    ['*', ['time'], 3],
                                ],
                            ],
                        2,
                    ],
                ],
            ],
            'circle-fill-color': 'rgba(255, 152, 0 , 0.15)',
            'circle-stroke-color': [
                'match',
                ['get', 'type'],

                'building', 'rgba(229, 57, 53, 0.7)',

                'vehicle', 'rgba(67, 160, 71, 0.7)',

                'rgba(255, 152, 0, 0.7)',
            ],
            'circle-stroke-width': 2
        },
        zIndex: 4
    })

    const aoiSource = new VectorSource()
    const aoiLayer = new VectorLayer({ source: aoiSource, zIndex: 4 })

    const layers = ref({
        base: baseLayer,
        imagery: imageryLayer,
        scenes: sceneLayer,
        detections: detectionLayer,
        detectionsPulse: detectionPulseLayer,
        aoi: aoiLayer
    })

    function setLayerVisibility(layer: TileLayer | VectorLayer | WebGlVectorLayer, visible: boolean) {
        layer.setVisible(visible)
    }

    function setLayerOpacity(layer: TileLayer | VectorLayer, opacity: number) {
        layer.setOpacity(opacity)
    }

    function startDetectionPulseAnimation() {
        const animate = () => {
            detectionPulseLayer.changed()

            animationFrameId = requestAnimationFrame(animate)
        }
    }

    function stopDetectionPulseAnimation() {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId)
            animationFrameId = null
        }
    }

    onMounted(() => {
        startDetectionPulseAnimation()
    })

    onBeforeUnmount(() => {
        stopDetectionPulseAnimation()
    })

    return {
        layers,
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
        setLayerOpacity,
        startDetectionPulseAnimation
    }
}
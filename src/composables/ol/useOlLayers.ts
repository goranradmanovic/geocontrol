import { ref } from 'vue'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import { XYZ } from 'ol/source'

export function useOlLayers(imageryType: string) {
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
    const detectionLayer = new VectorLayer({ source: detectionSource, zIndex: 3 })

    const aoiSource = new VectorSource()
    const aoiLayer = new VectorLayer({ source: aoiSource, zIndex: 4 })

    const layers = ref({
        base: baseLayer,
        imagery: imageryLayer,
        scenes: sceneLayer,
        detections: detectionLayer,
        aoi: aoiLayer
    })

    function setLayerVisibility(layer: TileLayer | VectorLayer, visible: boolean) {
        layer.setVisible(visible)
    }

    function setLayerOpacity(layer: TileLayer | VectorLayer, opacity: number) {
        layer.setOpacity(opacity)
    }

    return {
        layers,
        baseLayer,
        imageryLayer,
        sceneLayer,
        sceneSource,
        detectionLayer,
        detectionSource,
        aoiLayer,
        aoiSource,
        setLayerVisibility,
        setLayerOpacity,
    }
}
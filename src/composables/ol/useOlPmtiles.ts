import { onBeforeUnmount, ref } from "vue"
import Map from 'ol/Map'
import VectorTileLayer from 'ol/layer/VectorTile'

export function useOlPmtiles() {
    const isLoaded = ref<boolean>(false)
    const isVisible = ref<boolean>(false)
    let pmtilesLayer: VectorTileLayer | null = null

    function addPmtilesLayer(map: Map, layer: VectorTileLayer) {
        console.log('PMTiles layer will be added.')

        pmtilesLayer = layer
        map.addLayer(pmtilesLayer)
        isLoaded.value = true
    }

    function removePmtielsLayer(map: Map) {
        if (!pmtilesLayer) {
            console.warn('No PMTiles layer to remove.')
            return
        }

        map.removeLayer(pmtilesLayer)
        pmtilesLayer = null
        isLoaded.value = false
    }

    function setVisible(visible: boolean) {
        pmtilesLayer?.setVisible(visible)
        isVisible.value = visible
    }

    onBeforeUnmount(() => pmtilesLayer = null)

    return {
        isLoaded,
        addPmtilesLayer,
        removePmtielsLayer,
        setVisible
    }
}
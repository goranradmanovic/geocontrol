import { onBeforeUnmount, ref } from "vue"
import Map from 'ol/Map'

export function useOlPmtiles() {
    const isLoaded = ref<boolean>(false)
    const isVisible = ref<boolean>(false)

    function addPmtilesLayer(map: Map) {
        console.log('PMTiles layer will be added.')

        isLoaded.value = true
    }

    function removePmtielsLayer() {
        isLoaded.value = false
    }

    function setVisible(visible: boolean) {
        isVisible.value = visible
    }

    onBeforeUnmount(() => removePmtielsLayer())

    return {
        isLoaded,
        addPmtilesLayer,
        removePmtielsLayer,
        setVisible
    }
}
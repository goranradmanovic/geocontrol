import { onBeforeUnmount, ref } from "vue"
import Map from 'ol/Map'
import View from 'ol/View'
import { fromLonLat } from "ol/proj"

export function useOlMap() {
    const map = ref<Map | null>(null)

    function createMap(target: HTMLElement, center: [number, number], zoom: number) {
        map.value = new Map({
            target,
            view: new View({
                center: fromLonLat(center),
                zoom
            })
        })

        return map.value
    }

    function destroyMap() {
        if (!map.value) return

        map.value.setTarget(undefined)
        map.value = null
    }

    onBeforeUnmount(() => destroyMap())

    return {
        map,
        createMap,
        destroyMap
    }
}
<template>
    <div ref="mapElement" class="map" />
</template>

<script lang="ts" setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import Map from 'ol/Map'
    import View from 'ol/View'
    import TileLayer from 'ol/layer/Tile'
    import OSM from 'ol/source/OSM'
    import { fromLonLat } from 'ol/proj'

    const mapElement = ref<HTMLDivElement | null>(null)
    const initialZoom: number = 12
    let map: Map | null = null
    
    const initMap = () => {
        if (!mapElement.value) return

        map = new Map({
            target: mapElement.value,
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: fromLonLat([16.95, 45.25]), // fromLonLat() performs the appropriate transformation for the map's projection. Convert them to the map projection Web Mercator
                zoom: initialZoom
            })
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
import { ref, onBeforeUnmount, type Ref, type EmitFn } from 'vue'
import Draw from 'ol/interaction/Draw'
import type Map from 'ol/Map'
import type VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'

export function useOlDraw(map: Ref<Map | null>, aoiSource: VectorSource) {
    const isDrawing = ref<boolean>(false)
    let drawInteraction: Draw | null = null

    function startDrawing(emit: EmitFn) {
        if (!map.value) return

        // This code is only for one polygon to be drawed
        aoiSource.clear()

        if (drawInteraction) {
            map.value.removeInteraction(drawInteraction)
        }

        drawInteraction = new Draw({ source: aoiSource, type: 'Polygon' })

        map.value?.addInteraction(drawInteraction)

        isDrawing.value = true

        drawInteraction.on('drawend', event => {
            const feature = event.feature
            feature.set('isAoi', true)
            const format = new GeoJSON()

            const geometry = format.writeGeometryObject(
                feature.getGeometry()!,
                {
                    featureProjection: 'EPSG:3857',
                    dataProjection: 'EPSG:4326'
                }
            )

            console.log('AOI GeoJSON: ', geometry)
            
            emit('aoiSelected', geometry)

            isDrawing.value = false
            stopDrawing()
        })
    }

    function stopDrawing() {
        if (!drawInteraction) {
            isDrawing.value = false
            return
        }

        // Cancel any active sketch
        drawInteraction.abortDrawing()

        // Remove Draw interaction from map
        if (map.value) {
            map.value.removeInteraction(drawInteraction)
        }

        // Clear reference
        drawInteraction = null

        isDrawing.value = false
    }

    function clearAoi() {
        console.log('mali je usao clear aoi')
        stopDrawing()
        aoiSource.clear()
    }

    onBeforeUnmount(() => stopDrawing())

    return {
        isDrawing,
        startDrawing,
        stopDrawing,
        clearAoi
    }
}
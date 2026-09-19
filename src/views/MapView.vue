<template>
  <div class="map-page">
    <v-progress-circular v-if="detectionsLoading" indeterminate />
    <v-alert v-if="detectionsError" type="error">Failed to load detection results.</v-alert>

    <GeoMap
      ref="mapRef"
      :layers="layers ?? []"
      :detections="mapDetections ?? []"
      @scene-selected="handleSceneSelected"
      @aoi-selected="handleAoiSelected"
      @aoi-cleared="handleAoiClared"
      @detection-selected="handleDetectionSelected"
    />

    <MapLayerControl v-model="layers" :scene-id="sceneId" @startDrawing="handleStartDrawing" @clearAoi="handleClearAoi" @activeJobId="handleActveJobId" />

    <!-- Selected AOI Card -->
    <AoiCard v-if="aoiInfo" :aoi-info="aoiInfo" />

    <!-- Selected Scene Card -->
    <SceneCard v-if="selectedScene" :scene="selectedScene"/>

    <!-- Detection Detils Card -->
    <DetectionDetails v-if="selectedDetection" :detection="selectedDetection" />

    <ActiveJobCard v-if="activeJob" :active-job="activeJob" />
  </div>
</template>

<script setup lang="ts">
  // Vue
  import { ref, onMounted, nextTick, computed, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { AoiInfo } from '@/types/aoi.ts'
  import type { Detection } from '@/queries/detections_schemas.ts'
  import type { SceneProperties } from '@/types/scene'
  import type GeoJSON from 'geojson'

  // Utils
  import { calculateAoiInfo } from '@/utils/geo.ts'

  // Plugins
  import { queryClient } from '@/plugins/vue-query'

  // Queries
  import { useDetectionsQuery } from '@/queries/detections.ts'
  import { useActiveJobQuery } from '@/queries/jobs'

  // Components
  import ActiveJobCard from '@/components/map/ActiveJobCard.vue'
  import GeoMap from '@/components/map/GeoMap.vue'
  import MapLayerControl from '@/components/map/MapLayerControl.vue'
  import AoiCard from '@/components/map/AoiCard.vue'
  import DetectionDetails from '@/components/results/DetectionDetails.vue'
  import SceneCard from '@/components/scenes/SceneCard.vue'

  // Variables section
  const route = useRoute()

  const {
    data: detections,
    isLoading: detectionsLoading,
    isError: detectionsError
  } = useDetectionsQuery()

  const activeJobId = ref<string | null>()
  const mapRef = ref<InstanceType<typeof GeoMap> | null>(null)
  const selectedScene = ref<SceneProperties | null>(null)
  const selectedAoi = ref<GeoJSON.Feature | null>(null)
  const selectedDetection = ref<Detection | null>(null)
  const aoiInfo = ref<AoiInfo | null>(null)
  const layers = ref<object>({
    baseMap: {
      visible: true,
      opacity: 1
    },
    imagery: {
      visible: false,
      opacity: 1,
      type: 'World_Imagery' // Default type - World_Imagery, secondary type World_Topo_Map
    },
    scenes: {
      visible: true,
      opacity: 0.5
    },
    detections: {
      visible: true,
      confidence: 0,
      type: ['building'] // Vehicles
    },
  })
  const { data: activeJob } = useActiveJobQuery(activeJobId)

  // Watch
  watch(() => activeJob.value?.status, async (status) => {
    if (status !== 'completed') return

    await queryClient.invalidateQueries({
      queryKey: [
        'detections',
        'scene',
        sceneId.value
      ]
    })
  })

  // Computed
  const sceneId = computed(() => typeof route.query.scene === 'string' ? route.query.scene : null)
  const minConfidence = computed(() => (layers.value?.detections.confidence / 100).toFixed(2))
  const mapDetections = computed(() => {
    return (detections.value ?? []).filter((item: Detection) => {
      const confidenceMatch = item.confidence >= minConfidence.value

      const typeMatch = layers.value?.detections.type.includes(item.type)

      return confidenceMatch && typeMatch
    })
  })

  // Fucntions
  const handleStartDrawing = () => mapRef.value?.startDrawing()
  const handleClearAoi = () => mapRef.value?.clearAoi()
  const handleActveJobId = (paylod: string) => activeJobId.value = paylod
  const handleDetectionSelected = (detection: Detection) => selectedDetection.value = detection
  const handleSceneSelected = (scene: SceneProperties) => selectedScene.value = scene
  const handleAoiSelected = (geoJson: GeoJSON.Feature) => {
    selectedAoi.value = geoJson

    if (geoJson.geometry.type !== 'Polygon') return

    aoiInfo.value = calculateAoiInfo(
      geoJson as GeoJSON.Feature<GeoJSON.Polygon>
    )
  }
  
  function handleAoiClared() {
    selectedAoi.value = null
    aoiInfo.value = null
  }

  //Set scene on map
  async function setSceneOnMap() {
    const sceneId = route.query.scene

    if (typeof sceneId !== 'string') return

    await nextTick()
    mapRef.value?.selectScene(sceneId)
  }

  onMounted(() => {
    setSceneOnMap()
  })
</script>
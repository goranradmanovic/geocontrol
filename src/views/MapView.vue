<template>
  <div class="map-workspace">
    <v-overlay v-model="mapOverlay" contained class="align-center justify-center">
      <v-progress-circular indeterminate class="map-loading" size="32" />
    </v-overlay>
    <v-alert v-if="detectionsError || sceneFeaturesError" type="error">Failed to load nessery data.</v-alert>

    <template v-if="!isDataLoading && !detectionsError && !sceneFeaturesError">
      <GeoMap
        ref="mapRef"
        :layers="layers ?? []"
        :detections="mapDetections ?? []"
        :features="sceneFeatures || []"
        :scene-id="sceneId ?? ''"
        @scene-selected="handleSceneSelected"
        @aoi-selected="handleAoiSelected"
        @detection-selected="handleDetectionSelected"
      />

      <MapLayerControl
        v-model="layers"
        :scene-id="sceneId"
        @start-drawing="handleStartDrawing"
        @clear-aoi="handleClearAoi"
        @activeJobId="handleActveJobId"
      />
    </template>

    <!-- Detection Detils Card -->
    <DetectionDetails v-if="selectedDetection" :detection="selectedDetection" />

    <!-- Selected AOI Card -->
    <AoiDetails v-if="aoiInfo" :aoi-info="aoiInfo" />

    <!-- Selected Scene Card -->
    <SceneDetails v-if="selectedScene" :scene="selectedScene" />

    <ActiveJobDetails v-if="activeJob" :active-job="activeJob" />
  </div>
</template>

<script setup lang="ts">
  // Vue
  import { ref, computed, watch } from 'vue'
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
  import { useDetectionsQuery } from '@/queries/detections'
  import { useActiveJobQuery } from '@/queries/jobs'
  import { useScenegeoQuery, useScenesQuery, useSceneFeaturesQuery } from '@/queries/scenes'

  // Components
  import ActiveJobDetails from '@/components/results/ActiveJobDetails.vue'
  import GeoMap from '@/components/map/GeoMap.vue'
  import MapLayerControl from '@/components/map/MapLayerControl.vue'
  import AoiDetails from '@/components/results/AoiDetails.vue'
  import DetectionDetails from '@/components/results/DetectionDetails.vue'
  import SceneDetails from '@/components/scenes/SceneDetails.vue'

  import { activeJobId } from '@/state/appState'

  // Variables section
  const route = useRoute()

  const {
    data: detections,
    isLoading: detectionsLoading,
    isError: detectionsError
  } = useDetectionsQuery()

  /*const {
    data: scenegeo,
    isLoading: scenegeoLoading,
    isError: scenegeoError
  } = useScenegeoQuery()

  const {
    data: scenesProp,
    isLoading: scenesPropLoading,
    isError: scenesPropError
  } = useScenesQuery()*/

  const {
    data: sceneFeatures,
    isLoading: sceneFeaturesLoading,
    isError: sceneFeaturesError
  } = useSceneFeaturesQuery()

  //const activeJobId = ref<string | null>()
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
  const isDataLoading = computed(() => detectionsLoading.value || sceneFeaturesLoading.value)
  const mapOverlay = computed(() => isDataLoading.value)
  const mapDetections = computed(() => {
    return (detections.value ?? []).filter((item: Detection) => {
      const confidenceMatch = item.confidence >= minConfidence.value

      const typeMatch = layers.value?.detections.type.includes(item.type)

      return confidenceMatch && typeMatch
    })
  })

  // Fucntions
  const handleStartDrawing = () => mapRef.value?.startDrawing()
  const handleActveJobId = (payload: string) => {
    console.log('payload: - ', payload)
    activeJobId.value = payload
    console.log('activeJobId.value: - ', activeJobId.value)
  }
  const handleDetectionSelected = (detection: Detection) => selectedDetection.value = detection
  const handleSceneSelected = (scene: SceneProperties) => selectedScene.value = scene
  const handleAoiSelected = (geoJson: GeoJSON.Feature) => {
    selectedAoi.value = geoJson

    if (geoJson.type !== 'Polygon') return

    aoiInfo.value = calculateAoiInfo(
      geoJson as GeoJSON.Feature<GeoJSON.Polygon>
    )
  }
  
  function handleClearAoi() {
    selectedAoi.value = null
    aoiInfo.value = null
    mapRef.value?.clearAoi()
  }
</script>
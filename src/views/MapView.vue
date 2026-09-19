<template>
  <div class="map-page">
    <v-progress-circular v-if="detectionsLoading" indeterminate />
    <v-alert v-if="detectionsError" type="error">
      Failed to load detection results.
    </v-alert>

    <v-card
      class="map-draw opacity-80 d-flex flex-column ga-4"
      elevation="4"
    >
        <v-card-title>Map Draw</v-card-title>

        <v-card-text>
          <div>
            <v-btn
              v-if="sceneId"
              class="mb-3"
              color="primary"
              prepend-icon="mdi-arrow-left"
              variant="elevated"
              @click="router.push('/scenes')"
            >
              Back to scenes
            </v-btn>
          </div>
          <div class="d-flex ga-2">
            <v-btn prepend-icon="mdi-vector-polygon" color="primary" @click="startDrawing">Draw AOI</v-btn>
            <v-btn prepend-icon="mdi-delete-outline" variant="outlined" @click="clearAoi">Clear AOI</v-btn>
          </div>
      </v-card-text>
    </v-card>

    <GeoMap
      ref="mapRef"
      :layers="layers ?? []"
      :detections="mapDetections ?? []"
      @scene-selected="handleSceneSelected"
      @aoi-selected="handleAoiSelected"
      @aoi-cleared="handleAoiClared"
      @detection-selected="handleDetectionSelected"
    />

    <div class="layers-control">
      <MapLayerControl v-model="layers" />
    </div>

    <!-- Selected AOI Card -->
    <AoiCard v-if="aoiInfo" :aoi-info="aoiInfo" />

    <!-- Selected Scene Card -->
    <SceneCard v-if="selectedScene" :scene="selectedScene"/>

    <!-- Detection Detils Card -->
    <DetectionDetails v-if="selectedDetection" :detection="selectedDetection" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, nextTick, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import type { SceneProperties } from '@/types/scene'
  import type GeoJSON from 'geojson'
  import GeoMap from '@/components/map/GeoMap.vue'
  import MapLayerControl from '@/components/map/MapLayerControl.vue'
  import AoiCard from '@/components/map/AoiCard.vue'
  import { useSceneDetectionsQuery, useDetectionsQuery } from '@/queries/detections.ts'
  import SceneCard from '@/components/scenes/SceneCard.vue'
  import { calculateAoiInfo } from '@/utils/geo.ts'
  import type { AoiInfo } from '@/types/aoi.ts'
  import type { Detection } from '@/queries/detections_schemas.ts'
  import DetectionDetails from '@/components/results/DetectionDetails.vue'

  // Variables section
  const {
    data: detections,
    isLoading: detectionsLoading,
    isError: detectionsError
  } = useDetectionsQuery()
  const route = useRoute()
  const router = useRouter()
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

  const sceneId = computed(() => typeof route.query.scene === 'string' ? route.query.scene : null)
  const minConfidence = computed(() => (layers.value?.detections.confidence / 100).toFixed(2))

  const mapDetections = computed(() => {
    return (detections.value ?? []).filter((item: Detection) => {
      const confidenceMatch = item.confidence >= minConfidence.value

      const typeMatch = layers.value.detections.type.includes(item.type)

      return confidenceMatch && typeMatch
    })
  })

  const handleDetectionSelected = (detection: Detection) => selectedDetection.value = detection
  const handleSceneSelected = (scene: SceneProperties) => selectedScene.value = scene
  const handleAoiSelected = (geoJson: GeoJSON.Feature) => {
    selectedAoi.value = geoJson

    if (geoJson.geometry.type !== 'Polygon') return

    aoiInfo.value = calculateAoiInfo(
      geoJson as GeoJSON.Feature<GeoJSON.Polygon>
    )
  }

  function startDrawing() {
    mapRef.value?.startDrawing()
  }

  function clearAoi() {
    mapRef.value?.clearAoi()
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
<template>
  <div class="map-page">
    <v-card
      class="map-draw opacity-80 d-flex flex-column ga-4"
      elevation="4"
    >
        <v-card-title>Map Draw</v-card-title>

        <v-card-text>
          <div class="d-flex ga-2">
            <v-btn prepend-icon="mdi-vector-polygon" color="primary" @click="startDrawing">Draw AOI</v-btn>
            <v-btn prepend-icon="mdi-delete-outline" variant="outlined" @click="clearAoi">Clear AOI</v-btn>
          </div>
      </v-card-text>
    </v-card>

    <GeoMap
      ref="mapRef"
      :layers="layers"
      @scene-selected="handleSceneSelected"
      @aoi-selected="handleAoiSelected"
      @aoi-cleared="handleAoiClared"  
    />

    <div class="layers-control">
      <MapLayerControl v-model="layers" />
    </div>

    <!-- Selected AOI Card -->
    <AoiCard v-if="selectedAoi" :selected-aoi="selectedAoi" />

    <!-- Selected Scene Card -->
    <SceneCard v-if="selectedScene" :selected-scene="selectedScene"/>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { SceneProperties } from '../types/scene'
  import type GeoJSON from 'geojson'
  import GeoMap from '@/components/map/GeoMap.vue'
  import MapLayerControl from '@/components/map/MapLayerControl.vue'
  import AoiCard from '../components/map/AoiCard.vue'
  import SceneCard from '../components/map/SceneCard .vue'

  // Variables section
  const mapRef = ref<InstanceType<typeof GeoMap> | null>(null)
  const selectedScene = ref<SceneProperties | null>(null)
  const selectedAoi = ref<GeoJSON.Feature | null>(null)
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
      //opacity: 0.7
    },
  })

  const handleSceneSelected = (scene: SceneProperties) => selectedScene.value = scene
  const handleAoiSelected = (geoJson: GeoJSON.Feature) => selectedAoi.value = geoJson

  function startDrawing() {
    mapRef.value?.startDrawing()
  }

  function clearAoi() {
    mapRef.value?.clearAoi()
  }

  function handleAoiClared() {
    selectedAoi.value = null
  }
</script>
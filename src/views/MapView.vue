<template>
  <div class="map-page">
    <GeoMap :layers="layers" @scene-selected="handleSceneSelected" />

    <div class="layers-control">
      <MapLayerControl v-model="layers" />
    </div>

    <v-card
      v-if="selectedScene"
      class="scene-panel"
      elevation="4"  
    >
      <v-card-title>{{ selectedScene.name }}</v-card-title>
      <v-card-text>
        <div>
          <strong>ID:</strong>
          {{ selectedScene.id }}
        </div>
        <div class="status">
          <strong>Status: </strong>
          <v-chip 
              size="x-small"
              variant="tonal"
              :color="setStatusColor(selectedScene.status)"
          >
            <v-icon icon="mdi-circle" size="x-small" start />
            {{ selectedScene.status }}
          </v-chip>
        </div>
        <div>
          <strong>Area:</strong>
          {{ selectedScene.area }} km²
        </div>
        <div>
          <strong>Descritpion:</strong>
          {{ selectedScene.description }}
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { SceneProperties } from '../types/scene'
  import GeoMap from '@/components/map/GeoMap.vue'
  import MapLayerControl from '@/components/map/MapLayerControl.vue'

  // Variables section
  const selectedScene = ref<SceneProperties | null>(null)
  const layers = ref({
    baseMap: true,
    baseMapOpacity: 1,
    scenes: true,
    scenesOpacity: 0.5,
    detections: true
  })

  const handleSceneSelected = (scene: SceneProperties) => selectedScene.value = scene

  const setStatusColor = (status: string) => {
    switch(status) {
      case 'ready':
        return 'success'

      case 'processing':
        return 'warning'

      case 'failed':
        return 'error'
    }
  }
</script>
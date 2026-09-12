<template>
  <div class="map-page">
    <GeoMap @scene-selected="handleSceneSelected" />

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
          <span :class="setStatusColor(selectedScene.status)"> {{ selectedScene.status }}</span>
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

  // Variables section
  const selectedScene = ref<SceneProperties | null>(null)

  const handleSceneSelected = (scene: SceneProperties) => selectedScene.value = scene

  const setStatusColor = (status: string) => {
    switch(status) {
      case 'ready':
        return 'text-green'

      case 'processing':
        return 'text-orange'

      case 'failed':
        return 'text-red'
    }
  }
</script>
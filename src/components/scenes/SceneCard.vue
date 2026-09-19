<template>
    <v-card class="scene-panel" elevation="4">
      <v-card-item>
        <v-card-title>{{ props.scene.name }}</v-card-title>
        <v-card-subtitle>{{ props.scene.id }}</v-card-subtitle>
      </v-card-item>
      
      <v-card-text>
        <p>{{ props.scene.description }}</p>
        <div class="mt-3">
          <strong>Area:</strong>
          {{ props.scene.area }} km²
        </div>
        <div class="status">
          <v-chip 
              size="x-small"
              variant="tonal"
              :color="getStatusColor(props.scene.status)"
          >
            <v-icon icon="mdi-circle" size="x-small" start />
            {{ props.scene.status }}
          </v-chip>
        </div>
        <div class="mt-3">
          <strong>Cloud Coverage:</strong>
          {{ props.scene.cloudCoverage }}%
        </div>
      </v-card-text>

      <v-card-actions v-if="isScenesView">
        <v-btn color="primary" variant="text" @click="emit('view', scene)">
          View on map
        </v-btn>
      </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import type { SceneProperties, SceneStatus } from '../types/scene'

  const props = defineProps<{
    scene: SceneProperties
  }>()

  const emit = defineEmits<{
    view: [scene: SceneProperties]
  }>()

  const route = useRoute()

  const isScenesView = computed(() => route.name === 'scenes')
  const getStatusColor = (status: SceneStatus) => {
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
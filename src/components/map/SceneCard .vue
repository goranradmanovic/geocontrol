<template>
    <v-card class="scene-panel" elevation="4">
      <v-card-title>{{ props.selectedScene.name }}</v-card-title>
      <v-card-text>
        <div>
          <strong>ID:</strong>
          {{ props.selectedScene.id }}
        </div>
        
        <div class="status">
          <strong>Status: </strong>
          <v-chip 
              size="x-small"
              variant="tonal"
              :color="setStatusColor(props.selectedScene.status)"
          >
            <v-icon icon="mdi-circle" size="x-small" start />
            {{ props.selectedScene.status }}
          </v-chip>
        </div>

        <div>
          <strong>Area:</strong>
          {{ props.selectedScene.area }} km²
        </div>

        <div>
          <strong>Descritpion:</strong>
          {{ props.selectedScene.description }}
        </div>
      </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
    import type { SceneProperties } from '../types/scene'

    const props = defineProps<{
        selectedScene: SceneProperties
    }>()

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
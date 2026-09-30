<template>
  <v-card elevation="4" class="results-panel">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2" size="x-small">mdi-target</v-icon>
      Detection
    </v-card-title>

    <v-divider />

    <v-card-text>
      <div class="detail-row">
        <strong class="label">ID:</strong>
        <span>#{{ detection.id }}</span>
      </div>

      <div class="detail-row">
        <strong class="label">Type:</strong>
        <v-chip size="small" variant="tonal">
          <v-icon class="mr-1">{{ detection.type === 'building' ? 'mdi-office-building-outline' : 'mdi-car-outline' }}</v-icon>
          {{ detection.type }}
        </v-chip>
      </div>

      <div class="detail-row">
        <strong class="label">Confidence:</strong>
        <span>{{ Math.round(detection.confidence * 100) }}%</span>
      </div>

      <div class="detail-row">
        <strong class="label">Scene:</strong>
        <span>#{{ detection.sceneId }}</span>
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions>
      <v-btn variant="text" prepend-icon="mdi-information-outline">
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
    import type { Detection } from '@/queries/detections_schemas'

    defineProps<{
      detection: Detection
    }>()
</script>
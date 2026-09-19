<template>
    <v-card class="detection-info" elevation="4">
        <v-card-title>Detection Details</v-card-title>

        <v-card-text>
            <div class="mb-2">
                <strong>ID:</strong>
                {{ detection.id }}
            </div>

            <div class="mb-2">
                <strong>Type:</strong>
                {{ detection.type }}
            </div>

            <div class="mb-2">
                <strong>Confidence:</strong>
                {{ (detection.confidence * 100).toFixed(1) }}%
            </div>

            <div class="mb-2">
                <strong>Scene:</strong>
                {{ detection.sceneId }}
            </div>

            <div>
                <strong>Coordinates:</strong>
                {{ detection.coordinates.join(', ') }}
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
    import type { Detection } from '@/queries/detections_schemas'

    defineProps<{
        detection: Detection
    }>()
</script>
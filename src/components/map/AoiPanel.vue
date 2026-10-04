<template>
    <v-card v-if="activeAoi" width="300" elevation="4">
        <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-vector-polygon</v-icon>

            Selected Area
        </v-card-title>

        <v-card-text>
            <div class="detail-row">
                <span>Scene</span>
                <strong>{{ activeAoi.sceneId }}</strong>
            </div>
            <div class="detail-row">
                <span>Area</span>
                <strong>{{ activeAoi.areaKm2.toFixed(2) }} km²</strong>
            </div>
        </v-card-text>

        <v-card-actions>
            <v-btn variant="text" color="error" @click="emit('clear')">Clear</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
    import { activeAoi } from '@/state/appState'

    const emit = defineEmits<{
        clear: []
    }>()
</script>
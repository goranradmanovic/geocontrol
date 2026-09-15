<template>
    <v-card class="aoi-info" elevation="4">
      <v-card-title>Selected AOI</v-card-title>
      <v-card-text>
        <div>Type: {{ props.selectedAoi.geometry?.type }}</div>

        <div class="mt-2">Coordinates: {{ props.selectedAoi.geometry?.coordinates.length }}</div>
      </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
    import type GeoJSON from 'geojson'

    const props = defineProps<{
        selectedAoi: GeoJSON.Feature
    }>()
</script>
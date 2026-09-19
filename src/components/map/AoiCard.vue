<template>
    <v-card class="aoi-info" elevation="4">
      <v-card-title>Selected AOI</v-card-title>
      <v-card-text>
        <v-alert
          :color="isAreaToLarge ? 'warning' : 'success'"
          :icon="isAreaToLarge ? 'mdi mdi-alert' : 'mdi mdi-check-circle-outline'"
          :title="isAreaToLarge ? 'Area Warning' : 'Area Success'"
          :text="isAreaToLarge ? 'AOI is too large' : 'AOI size is valid'"
        />

        <div class="mt-2">
          <strong>Area:</strong>
          {{ props.aoiInfo.areaKm2.toFixed(2) }} km²
        </div>

        <div class="mt-2">
          <strong>Center:</strong>
          Lng: {{ props.aoiInfo.center[0].toFixed(5) }}
          Lat: {{ props.aoiInfo.center[1].toFixed(5) }}
        </div>

        <div class="mt-2">
          <strong>Bounding Box:</strong>
        </div>

        <div class="text-caption">
          {{ aoiInfo.bbox[0].toFixed(5) }}
          {{ aoiInfo.bbox[1].toFixed(5) }}
          
          <v-icon>mdi mdi-arrow-right-thin</v-icon>

          {{ aoiInfo.bbox[2].toFixed(5) }}
          {{ aoiInfo.bbox[3].toFixed(5) }}
        </div>
      </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { AoiInfo } from '../../types/aoi';

  const props = defineProps<{
    aoiInfo: AoiInfo
  }>()

  const isAreaToLarge = computed(() => Number(props.aoiInfo.areaKm2.toFixed(2)) > 50)
</script>
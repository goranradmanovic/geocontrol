<template>
  <v-card>Satellite Map</v-card>
  <div class="map-page">
    <GeoMap />
  </div>
</template>

<script setup lang="ts">
  import GeoMap from '../components/map/GeoMap.vue';
</script>
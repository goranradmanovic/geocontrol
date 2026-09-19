<template>
  <div>
    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h4">Scenes</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Manage available geospatial scenes.
        </p>
      </div>

      <v-spacer />

      <v-chip v-if="!isLoading">{{ scenes?.length }} Scenes</v-chip>
      
      <p v-if="scenes?.length === 0" class="text-body-2 text-medium-emphasis mt-1">
        No scenes available.
      </p>
    </div>

    <div v-if="isLoading" class="d-flex justify-center py-10">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-alert v-if="isError" type="error" variant="tonal">
      {{ error }}
      <v-btn
        prepend-icon="mdi-refresh"
        variant="outlined"
        :loading="isLoading"
        @click="refetch"
      >
        Refresh
      </v-btn>
    </v-alert>

    <v-row v-if="scenes">
      <v-col
        v-for="scene in scenes"
        :key="scene.id"
        cols="12"
        md="6"
        lg="4"
      >
        <SceneCard :scene="scene" @view="viewScene" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import SceneCard from '@/components/scenes/SceneCard.vue'
  import { useScenesQuery } from '@/queries/scenes'
  import type { SceneProperties } from '@/types/scene'

  const router = useRouter()

  const {
    data: scenes,
    isLoading,
    isError,
    error,
    refetch
  } = useScenesQuery()

  function viewScene(scene: SceneProperties) {
    router.push({
      name: 'map',
      query: {
        scene: scene.id,
      },
    })
  }
</script>
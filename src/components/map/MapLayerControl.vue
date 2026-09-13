<template>
    <v-card
        class="layer-control"
        elevation="4"
    >
        <v-card-title>Map Layers</v-card-title>

        <v-card-text>
            <div>
                <v-checkbox 
                    v-model="model.baseMap"
                    label="Base Map"
                    density="compact"
                    hide-details
                />
                <v-slider
                    v-model="model.baseMapOpacity"
                    :max="max"
                    :min="min"
                    :step="step"
                    thumb-label="hover"
                    hide-details
                    prepend-icon="mdi-opacity"
                />
            </div>

            <v-divider />

            <div>
                <v-checkbox 
                    v-model="model.scenes"
                    label="Scene Boundaries"
                    density="compact"
                    hide-details
                />

                <v-slider
                    v-model="model.scenesOpacity"
                    :max="max"
                    :min="min"
                    :step="step"
                    thumb-label="hover"
                    hide-details
                    prepend-icon="mdi-opacity"
                />
            </div>

            <v-divider />

            <div>
                <v-checkbox 
                    v-model="model.detections"
                    label="Detection Areas"
                    density="compact"
                    hide-details
                />
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import type { LayerState } from '@/types/layer'

    const model = defineModel<LayerState>({ required: true })
    const min = ref<number>(0)
    const max = ref<number>(1)
    const step = ref<number>(0.1)
</script>
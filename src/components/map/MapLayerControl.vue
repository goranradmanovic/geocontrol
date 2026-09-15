<template>
    <v-card
        class="layer-control opacity-80"
        elevation="4"
    >
        <v-card-title>Map Layers</v-card-title>

        <v-card-text>
            <div>
                <v-radio-group
                    :model-value="model.baseMap.visible ? 'baseMap' : model.imagery.visible ? 'imagery' : null"
                    @update:model-value="(val) => {
                        model.baseMap.visible = val === 'baseMap'
                        model.imagery.visible = val === 'imagery'
                    }"
                    hide-details
                >
                    <div class="py-2">
                        <v-radio label="Base Map" value="baseMap" density="compact" />
                        <v-slider
                            v-model="model.baseMap.opacity"
                            :max="max"
                            :min="min"
                            :step="step"
                            thumb-label="hover"
                            hide-details
                            prepend-icon="mdi-opacity"
                            :disabled="model.imagery.visible"
                        />
                    </div>

                    <v-divider />

                    <div class="py-1">
                        <v-radio label="Imagery" value="imagery" density="compact" />
                        <v-slider
                            v-model="model.imagery.opacity"
                            :max="max"
                            :min="min"
                            :step="step"
                            thumb-label="hover"
                            hide-details
                            prepend-icon="mdi-opacity"
                            :disabled="!model.imagery.visible"
                        />
                        <div class="d-flex align-center ga-1">
                            <v-icon icon="mdi mdi-layers" />
                            <v-btn-toggle v-model="model.imagery.type" :disabled="!model.imagery.visible">
                                <v-btn size="small" value="World_Imagery">
                                    Satellite Mpa
                                </v-btn>
                                <v-btn size="small" value="World_Topo_Map">
                                    Topograpy Map
                                </v-btn>
                            </v-btn-toggle>
                        </div>
                    </div>
                </v-radio-group>
            </div>

            <v-divider />

            <div>
                <v-checkbox 
                    v-model="model.scenes.visible"
                    label="Scene Boundaries"
                    density="compact"
                    hide-details
                />

                <v-slider
                    v-model="model.scenes.opacity"
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
                    v-model="model.detections.visible"
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
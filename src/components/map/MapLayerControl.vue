<template>
    <div class="layers-control">
        <v-card class="layer-control opacity-80" elevation="4">
            <v-card-title>Map Settings</v-card-title>
            <v-card-text>
                <div v-if="sceneId">
                    <h3 class="mb-1">AI Detection</h3>

                    <v-btn
                        color="primary"
                        prepend-icon="mdi-brain"
                        :disabled="!sceneId"
                        class="mb-3"
                        @click="startDetection"
                    >
                        Start
                    </v-btn>
                </div>

                <v-divider />

                <div>
                    <h3 class="mb-0 mt-0">Draw</h3>
                    <v-btn
                        v-if="sceneId"
                        class="mb-3"
                        color="primary"
                        prepend-icon="mdi-arrow-left"
                        variant="elevated"
                        @click="router.push('/scenes')"
                    >
                        Back to scenes
                    </v-btn>
                    
                    <div class="d-flex ga-2 mb-3">
                        <v-btn prepend-icon="mdi-vector-polygon" color="primary" @click="emit('startDrawing')">Draw AOI</v-btn>
                        <v-btn prepend-icon="mdi-delete-outline" variant="outlined" @click="emit('clearAoi')">Clear AOI</v-btn>
                    </div>

                    <v-divider />
                </div>

                <div>
                    <h3 class="mb-0">Layers</h3>

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
                            <div class="d-flex flex-column ga-1">
                                <div class="text-body-small">Map Type</div>

                                <div class="d-flex align-center ga-1">
                                    <v-icon icon="mdi mdi-layers" />
                                    <v-btn-toggle v-model="model.imagery.type" :disabled="!model.imagery.visible" class="mx-auto">
                                        <v-btn value="World_Imagery" title="Satellite Map" icon="mdi-satellite-variant" size="x-large" />
                                        <v-btn value="World_Topo_Map" title="Topograpy Map" icon="mdi-map-legend" size="x-large" />
                                    </v-btn-toggle>
                                </div>
                            </div>
                        </div>
                    </v-radio-group>

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

                        <div class="mt-1">
                            <div class="text-body-small">Detections Confidence</div>
                            <v-slider
                                v-model="model.detections.confidence"
                                :max="maxConfidence"
                                :min="min"
                                :step="step"
                                thumb-label="hover"
                                hide-details
                                prepend-icon="mdi-shield-check"
                                title="Detections Confidence"
                            />
                        </div>

                        <div class="mt-1">
                            <div class="text-body-small">Detections Type</div>
                            <v-checkbox 
                                v-model="model.detections.type"
                                label="Buildings"
                                density="compact"
                                hide-details
                                value="building"
                            />

                            <v-checkbox 
                                v-model="model.detections.type"
                                label="Vehicles"
                                density="compact"
                                hide-details
                                value="vehicle"
                            />
                        </div>
                    </div>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import type { LayerState } from '@/types/layer'
    import { useCreateJobMutation } from '@/queries/jobs'

    const emit = defineEmits(['startDrawing', 'clearAoi', 'activeJobId'])

    const props = defineProps<{
        sceneId: string
        activeJobId: number
    }>()

    const router = useRouter()
    const createJobMutation = useCreateJobMutation()

    const model = defineModel<LayerState>({ required: true })
    const min = ref<number>(0)
    const max = ref<number>(1)
    const maxConfidence = ref<number>(100)
    const step = ref<number>(0.1)

    function startDetection() {
        if (!props.sceneId) return

        createJobMutation.mutate(
            props.sceneId,
            {
                onSuccess: (job: object) => emit('activeJobId', job.id)
            }
        )
    }
</script>
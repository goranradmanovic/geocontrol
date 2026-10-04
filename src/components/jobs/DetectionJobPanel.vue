<template>
    <v-card width="320" elevation="4">
        <v-card-title>AI Detection</v-card-title>

        <v-card-text>
            <div class="text-body-2 mb-4">
                Run object detection on the selected area
            </div>

            <div class="text-caption">Minimum confidence</div>

            <v-slider
                v-model="confidence"
                :min="0.5"
                :max="1"
                :step="0.05"
                thumb-label
            />

            <div class="text-caption text-medium-emphasis">
                {{ Math.round(confidence * 100) }}%
            </div>
        </v-card-text>

        <v-card-actions>
            <v-btn
                color="primary"
                block
                prepend-icon="mdi-brain"
                :disabled="!activeAoi"
                :loading="createJobMutation.isPending"
                @click="startDetection"
            >
                Start Detection
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    import { activeAoi } from '@/state/appState'
    import { useCreateJobMutation } from '@/queries/jobs'

    const emit = defineEmits<{
        created: [jobId: string]
    }>()

    const confidence = ref<number>(0.7)

    const createJobMutation = useCreateJobMutation()

    function startDetection() {
        if (!activeAoi.value) return

        createJobMutation.mutate(
            activeAoi.value.sceneId,
            {
                onSuccess: (job: string) => emit('created', job.id)
            }
        )
    }
</script>
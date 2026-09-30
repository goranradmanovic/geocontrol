<template>
    <v-card elevation="4">
        <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">
                mdi-brain
            </v-icon>

            AI Processing
        </v-card-title>

        <v-card-text>
            <div class="d-flex justify-space-between mb-2">
                <span>
                    {{ job.status }}
                </span>

                <span>
                    {{ job.progress }}%
                </span>
            </div>

            <v-progress-linear
                :model-value="job.progress"
                height="8"
                rounded
            />

            <div class="text-caption text-medium-emphasis mt-3">
                Job: {{ job.id }}
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
    import type { Job } from '@/queries/jobs_schemas'

    defineProps<{
        job: Job
    }>()
</script>
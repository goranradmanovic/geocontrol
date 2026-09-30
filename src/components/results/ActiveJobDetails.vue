<template>
    <v-card class="mt-4">
        <v-card-title>AI Processing</v-card-title>

        <v-card-text>
            <div class="d-flex justify-space-between mb-2">
                <span>{{ activeJob.status }}</span>
                <span>{{ activeJob.progress }}%</span>
            </div>

            <v-progress-linear
                :model-value="activeJob.progress"
                height="8"
                rounded
            />
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
    const props = defineProps<{
        activeJob: object
    }>()
</script>
<template>
    <v-row>
        <v-col>
            <v-alert v-if="isError" type="error" variant="tonal">
                {{ error }}
                <v-btn
                    class="ml-3"
                    prepend-icon="mdi-refresh"
                    variant="outlined"
                    :loading="isLoading"
                    @click="refetch"
                >
                    Refresh
                </v-btn>
            </v-alert>

            <v-card :loading="isLoading">
                <template v-if="scene">
                    <v-card-item>
                        <v-card-title>{{ scene.name }}</v-card-title>
                        <v-card-subtitle>{{ scene.id }}</v-card-subtitle>
                    </v-card-item>

                    <v-card-text>
                        <v-chip 
                            size="x-small"
                            variant="tonal"
                            :color="getStatusColor(scene.status)"
                        >
                            <v-icon icon="mdi-circle" size="x-small" start />
                            {{ scene.status }}
                        </v-chip>

                        <div class="mt-2">
                            <strong>Status</strong>
                            {{ scene.area }} km²
                        </div>

                        <div class="mt-2">
                            <strong>Cloud Coverage:</strong>
                            {{ scene.cloudCoverage }}%
                        </div>

                        <p>{{ scene.description }}</p>
                    </v-card-text>
                </template>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
    import { computed } from 'vue'
    import { useSceneQuery } from '@/queries/scenes'
    import { useRoute } from 'vue-router'
    import type { SceneStatus } from '@/types/scene'

    const route = useRoute()
    const sceneId = computed(() => {
        return typeof route.params.id === 'string' ? route.params.id : null
    })


    const {
        data: scene,
        isLoading,
        isError,
        error,
        refetch
    } = useSceneQuery(sceneId.value)

    const getStatusColor = (status: SceneStatus) => {
        switch(status) {
            case 'ready':
                return 'success'

            case 'processing':
                return 'warning'

            case 'failed':
                return 'error'
        }
    }
</script>
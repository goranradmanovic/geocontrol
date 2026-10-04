<template>
    <v-card elevation="3" class="scene-header">
        <v-card-text>
            <v-btn 
                icon="mdi-arrow-left"
                variant="text"
                class="mr-2"
                @click="emit('back')"
            />

            <div>
                <div class="text-subtitle-1 font-weight-bold">{{ props.scene.name }}</div>

                <div class="text-caption text-medium-emphasis">{{ props.scene.description }}</div>
            </div>

            <v-spacer />

            <v-chip size="small" variant="tonal">{{ props.scene.status }}</v-chip>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
    import type { SceneProperties } from '@/types/scene'

    const props = defineProps<{
        scene: SceneProperties
    }>()

    const emit = defineEmits<{
        back: []
    }>()
</script>
<template>
    <v-footer elevation="1" density="comfortable">
        <div class="status-bar">
            <div class="status-item">
                <v-icon size="16" class="mr-1">mdi-server-outline</v-icon>
                API Connected
            </div>
            <div class="status-item">
                <v-icon size="16" class="mr-1">mdi-map-outline</v-icon>
                Map Ready
            </div>
            <div v-if="activeJobId" class="status-item">
                <v-icon size="16" class="mr-1">mdi-progress-clock</v-icon>
                Job {{ activeJobId }}
            </div>

            <div class="text-caption">GeoControl</div>
        </div>
    </v-footer>
</template>

<script setup lang="ts">
    import { activeJobId } from '@/state/appState';
</script>
<template>
    <v-app-bar elevation="1" density="comfortable">
        <v-btn
            icon
            variant="text"
            @click="isSidebarOpen = !isSidebarOpen"
        >
            <v-icon>mdi-menu</v-icon>
        </v-btn>

        <v-app-bar-title>
            GeoControl
        </v-app-bar-title>
        
        <template #append>
            <v-chip 
                class="mr-2"
                prepend-icon="mdi-circle"
                size="small"
                variant="tonal"
                color="success"
            >
                Online
            </v-chip>

            <v-btn icon>
                <v-icon>mdi-account-circle</v-icon>
            </v-btn>
        </template>
    </v-app-bar>
</template>

<script setup lang="ts">
    import { isSidebarOpen } from '@/state/appState';
</script>
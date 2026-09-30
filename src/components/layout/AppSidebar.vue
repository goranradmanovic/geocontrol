<template>
    <v-navigation-drawer v-model="isSidebarOpen" width="240">
        <v-list-item
            class="py-4"
            prepend-icon="mdi-earth"
            title="GeoControl"
            subtitle="Geospatial AI Platform"
        />

        <v-divider />

        <v-list nav density="comfortable">
            <v-list-item
                v-for="item in navigationItems"
                :key="item.title"
                :prepend-icon="item.icon"
                :title="item.title"
                :to="item.to"
            />
        </v-list>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
    import { isSidebarOpen } from '@/state/appState'

    const navigationItems = [
        {
            title: 'Dashboard',
            icon: 'mdi-view-dashboard',
            to: '/'
        },
        {
            title: 'Scenes',
            icon: 'mdi-satellite-variant',
            to: '/scenes'
        },
        {
            title: 'Models',
            icon: 'mdi-brain',
            to: '/models'
        },
        {
            title: 'Jobs',
            icon: 'mdi-cog-sync',
            to: '/jobs'
        },
        {
            title: 'Results',
            icon: 'mdi-map-marker-multiple',
            to: '/results'
        },
        {
            title: 'Imports',
            icon: 'mdi-upload',
            to: '/imports'
        },
        {
            title: 'Map',
            icon: 'mdi-map',
            to: '/map'
        },
    ]
</script>
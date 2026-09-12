<template>
    <v-app>
        <v-navigation-drawer>
            <v-list-item
                class="py-4"
                prepend-icon="mdi-earth"
                title="GeoControl Platform"
                subtitle="Geospatial Platform"
            />

            <v-divider />

            <v-list nav>
                <v-list-item
                    v-for="item in navigationItems"
                    :key="item.title"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    :to="item.to"
                />
            </v-list>
        </v-navigation-drawer>

        <v-app-bar elevation="1" class="px-4">
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

        <v-main>
            <v-container fluid class="pa-6">
                <v-row>
                    <v-col>
                        <router-view />
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
    import { RouterView } from 'vue-router';

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
    ]
</script>
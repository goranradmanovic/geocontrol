<template>
    <v-app>
        <AppHeader />
        <AppSidebar />
        <v-main>
            <v-container fluid>
                <v-row>
                    <v-col>
                        <div class="app-content">
                            <router-view />
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <AppStatusBar />
    </v-app>
</template>

<script lang="ts" setup>
    import { RouterView } from 'vue-router';
    import AppHeader from './AppHeader.vue';
    import AppSidebar from './AppSidebar.vue';
    import AppStatusBar from './AppStatusBar.vue';
</script>
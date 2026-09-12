import {
    createRouter,
    createWebHistory,
    type RouterRecordRaw
} from 'vue-router'

const routes: RouterRecordRaw[] = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue')
    },
    {
        path: '/scenes',
        name: 'scenes',
        component: () => import('../views/ScenesView.vue')
    },
    {
        path: '/models',
        name: 'models',
        component: () => import('../views/ModelsView.vue')
    },
    {
        path: '/jobs',
        name: 'jobs',
        component: () => import('../views/JobsView.vue')
    },
    {
        path: '/results',
        name: 'results',
        component: () => import('../views/ResultsView.vue')
    },
    {
        path: '/imports',
        name: 'imports',
        component: () => import('../views/ImportsView.vue')
    },
        {
        path: '/map',
        name: 'map',
        component: () => import('../views/MapView.vue')
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})
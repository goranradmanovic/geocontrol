<template>
    <v-card>
        <v-card-title>Detection by Type</v-card-title>

        <v-card-text>
            <apexchart type="bar" height="300" :options="chartOptions" :series="series"/>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    const series = ref<[{}]>([
        {
            name: 'Detections',
            data: [42, 27]
        }
    ])

    const chartOptions = ref({
        chart: {
            type: 'pie',
            toolbar: {
                show: false
            }
        },

        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false
            }
        },

        xaxis: {
            categories: ['Building', 'Vehicle']
        },

        grid: {
            strokeDashArray: 4
        },

        legend: {
            show: false
        }
    })
</script>
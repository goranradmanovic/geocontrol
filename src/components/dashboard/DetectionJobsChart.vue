<template>
  <v-card>
    <v-card-title>
      Detection Jobs
    </v-card-title>

    <v-card-text>
      <apexchart
        type="line"
        height="300"
        :options="chartOptions"
        :series="series"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    const series = ref([
        {
            name: 'Jobs',
            data: [12, 18, 15, 24, 21, 30, 27],
        },
    ])

    const chartOptions = ref({
        chart: {
            type: 'line',
            toolbar: {
            show: false,
            },
        },

        stroke: {
            curve: 'smooth',
            width: 3,
        },

        xaxis: {
            categories: [
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
            'Sun',
            ],
        },

        yaxis: {
            title: {
            text: 'Jobs',
            },
        },

        dataLabels: {
            enabled: false,
        },

        grid: {
            strokeDashArray: 4,
        },

        tooltip: {
            enabled: true,
        },

        legend: {
            show: true,
        },
    })
</script>
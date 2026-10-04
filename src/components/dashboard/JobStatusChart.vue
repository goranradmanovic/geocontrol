<template>
  <v-card>
    <v-card-title>
      Job Status
    </v-card-title>

    <v-card-text>
      <apexchart
        type="donut"
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
        18,
        7,
        3,
        2,
    ])

    const chartOptions = ref({
        chart: {
            type: 'donut',
        },

        labels: [
            'Completed',
            'Processing',
            'Queued',
            'Failed',
        ],

        legend: {
            position: 'bottom',
        },

        dataLabels: {
            enabled: true,
        },

        plotOptions: {
            pie: {
            donut: {
                size: '65%',
            },
            },
        },

        responsive: [
            {
            breakpoint: 600,

            options: {
                chart: {
                height: 280,
                },

                legend: {
                position: 'bottom',
                },
            },
            },
        ],
    })
</script>
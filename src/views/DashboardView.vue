<template>
  <v-container fluid class="dashboard-view">
    <div class="mb-6">
      <h1 class="text-h4">Dashboard</h1>
      <p class="text-body-1 text-medium-emphasis"> Welcome to GeoControl.</p>
    </div>

    <!-- KPI cards -->
    <v-row class="mb-2">
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-body-2 text-medium-emphasis">Scenes</div>
            <div class="text-h4 mt-2">4</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-body-2 text-medium-emphasis">Detections</div>
            <div class="text-h4 mt-2">69</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-body-2 text-medium-emphasis">Completed Jobs</div>
            <div class="text-h4 mt-2">18</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-body-2 text-medium-emphasis">Success Rate</div>
            <div class="text-h4 mt-2">90%</div>          
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Chart -->
    <v-row>
      <v-col cols="12">
        <DetectionJobsChart />
      </v-col>
    </v-row>

    <!-- Secondary Chart -->
    <v-row>
      <v-col cols="12" md="6">
        <DetectionsByTypeChart />
      </v-col>

      <v-col cols="12" md="6">
        <JobStatusChart />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import DetectionJobsChart from '@/components/dashboard/DetectionJobsChart.vue'
  import DetectionsByTypeChart from '@/components/dashboard/DetectionsByTypeChart.vue'
  import JobStatusChart from '@/components/dashboard/JobStatusChart.vue'
</script>
<template>
  <div>
    <h1 class="text-h4 mb-4">
      Jobs
    </h1>

    <v-progress-linear
      v-if="isLoading"
      indeterminate
      class="mb-4"
    />

    <v-alert
      v-if="isError"
      type="error"
      class="mb-4"
    >
      Failed to load jobs.
    </v-alert>

    <v-card
      v-for="job in jobs"
      :key="job.id"
      class="mb-3"
    >
      <v-card-title>{{ job.id }}</v-card-title>
      <v-card-text>
        <div>
          Status: 
          <v-chip 
              class="ml-2 text-capitalize"
              prepend-icon="mdi-circle"
              size="small"
              variant="flat"
              :color="setStatusColor(job.status)"
          >
            {{ job.status }}
          </v-chip>
        </div>
        <v-progress-linear :model-value="job.progress" class="mb-4 mt-4" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import { useJobsQuery } from '@/queries/jobs'

  const {
    data: jobs,
    isLoading,
    isError
  } = useJobsQuery()

  const setStatusColor = (status: string) => {
    switch(status) {
      case 'queued':
        return 'secondary'

      case 'processing':
        return 'primary'

      case 'completed':
        return 'green'

      case 'failed':
        return 'red'

      default:
        return 'secondary'
    }
  }
</script>
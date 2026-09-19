import { useMutation, useQuery } from "@tanstack/vue-query"
import { createJob, getJob, getJobs } from "@/api/jobApi"
import { computed, type MaybeRef, unref } from 'vue'

export function useJobsQuery() {
    return useQuery({
        queryKey: ['jobs'],
        queryFn: getJobs
    })
}

export function useJobQuery(jobId: string) {
    return useQuery({
        queryKey: ['job', jobId],
        queryFn: () => getJob(jobId)
    })
}

export function useCreateJobMutation() {
    return useMutation({
        mutationFn: createJob
    })
}

export function useActiveJobQuery(jobId: MaybeRef<string | null>) {
    return useQuery({
        queryKey: computed(() => ['jobs', unref(jobId)]),
        queryFn: () => {
            const id = unref(jobId)

            if (!id) throw new Error('Job ID is required')
        },
        enabled: computed(() => Boolean(unref(jobId))),
        refetchInterval: (query) => {
            const job = query?.state?.data

            if (!job) return 1000

            if (job.status === 'completed' || job.status === 'failed') return false

            return 1000
        }
    })
}
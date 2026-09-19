import { ApiClient } from "./ApiClient"
import { jobSchema, jobsSchema } from "@/queries/jobs_schemas"
import type { Job } from '@/queries/jobs_schemas'

export async function getJobs(): Promise<Job[]> {
    const response = await ApiClient.get('/jobs')
    return jobsSchema.parse(response.data)
}

export async function getJob(id: string): Promise<Job> {
    const response = await ApiClient.get(`/jobs/${id}`)
    return jobSchema.parse(response.data)
}

export async function createJob(sceneId: string): Promise<Job> {
    const response = await ApiClient.post('/jobs', { sceneId })
    return jobsSchema.parse(response.data)
}
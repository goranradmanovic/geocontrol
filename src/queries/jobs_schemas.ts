import { z } from 'zod'

export const jobStatusSchema = z.enum([
    'queued',
    'processing',
    'completed',
    'failed'
])

export const jobSchema = z.object({
    id: z.string(),
    sceneId: z.string(),
    status: jobStatusSchema,
    progress: z.number().min(0).max(100),
    createdAt: z.string(),
    updatedAt: z.string()
})

export const jobsSchema = z.array(jobSchema)

export type jobStatus = z.infer<typeof jobStatusSchema>
export type Job = z.infer<typeof jobSchema>
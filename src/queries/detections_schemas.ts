import { z } from 'zod'

export const detectionTypeSchema = z.enum(['building', 'vehicle'])

export const detectionSchema = z.object({
    id: z.string(),
    sceneId: z.string(),
    type: detectionTypeSchema,
    confidence: z.number().min(0).max(1),
    coordinates: z.tuple([z.number(), z.number()]) // [longitude, latitude]
})

export const detectionsSchema = z.array(detectionSchema)

export type DetectionType = z.infer<typeof detectionTypeSchema>

export type Detection = z.infer<typeof detectionSchema>
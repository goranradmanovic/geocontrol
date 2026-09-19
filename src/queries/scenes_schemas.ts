import { z } from 'zod'

export const sceneStatusSchema = z.enum(['ready', 'processing', 'failed'])

export const sceneSchema = z.object({
    id: z.string(),
    name: z.string(),
    status: sceneStatusSchema,
    area: z.number(),
    description: z.string(),
    cloudCoverage: z.number()
})

export const scenesSchema = z.array(sceneSchema)

// Zod provides inferred TypeScript types.
// Generate the TypeScript type from the Zod schema.
export type SceneStatus = z.infer<typeof sceneStatusSchema>

export type SceneProperties = z.infer<typeof sceneSchema>
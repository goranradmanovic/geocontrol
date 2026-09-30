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

// Schema for an individual scene object
export const scenegeoSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(
    z.object({
      id: z.string(),
      type: z.literal("Feature"),
      geometry: z.object({
        type: z.literal("Polygon"),
        // Tuple enforces exact [longitude, latitude] pairs
        coordinates: z.array(z.array(z.tuple([z.number(), z.number()])))
      })
    })
  )
})

// Schema for your entire scenegeo.json file (Array of scenes)
export const scenesgeoSchema = z.array(scenegeoSchema)

// 1. Schema for your specific API properties
export const ScenePropertiesSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["ready", "processing", "failed"]), // Add other statuses if needed
  area: z.number(),
  description: z.string(),
  cloudCoverage: z.number()
})

// 2. Schema for a single Feature with typed properties
export const SceneFeatureSchema = z.object({
  id: z.string(),
  type: z.literal("Feature"),
  geometry: z.object({
    type: z.literal("Polygon"),
    coordinates: z.array(z.array(z.tuple([z.number(), z.number()])))
  }),
  properties: ScenePropertiesSchema
})

// 3. Schema for the whole FeatureCollection
export const SceneFeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(SceneFeatureSchema)
})


// Zod provides inferred TypeScript types.
// Generate the TypeScript type from the Zod schema.
export type SceneStatus = z.infer<typeof sceneStatusSchema>

//export type SceneProperties = z.infer<typeof sceneSchema>

export type SceneProperties = z.infer<typeof ScenePropertiesSchema>

export type SceneFeatureCollection = z.infer<typeof SceneFeatureCollectionSchema>

export type SceneGeos = z.infer<typeof scenesgeoSchema>
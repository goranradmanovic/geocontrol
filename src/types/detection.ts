export type DetectionType = 'building' | 'vehicle'

export interface DetectionProperties {
    id: string,
    type: DetectionType,
    confidence: number
}
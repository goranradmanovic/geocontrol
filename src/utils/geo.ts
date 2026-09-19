import { area, center, bbox, distance, point } from '@turf/turf'
import type { Feature, Polygon } from 'geojson'
import type { AoiInfo } from '../types/aoi'

export function calculateAreaKm2(feature: Feature<Polygon>): number {
    const areaM2 = area(feature)

    return areaM2 / 1_000_000
}

export function calculateCenter(feature: Feature<Polygon>): [number, number] {
    const centerPoint = center(feature)

    const coordinates = centerPoint.geometry.coordinates

    return [coordinates[0], coordinates[1]] // [longitude, latitude]
}

export function calculateBbox(feature: Feature<Polygon>): [number, number, number, number] {
    return bbox(feature) // [minLongitude, minLatitude, maxLongitude, maxLatitude]
}

export function calculateDisstanceKm(first: [number,number], second: [number,number]): number {
    const firstPoint = point(first)
    const secondPoint = point(second)

    return distance(firstPoint, secondPoint, { units: 'kilometers' })
}

export function calculateAoiInfo(feature: Feature<Polygon>): AoiInfo {
    return {
        areaKm2: calculateAreaKm2(feature),
        center: calculateCenter(feature),
        bbox: calculateBbox(feature)
    }
}
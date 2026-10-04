import { ref } from 'vue'
import type { SceneAoi } from '@/types/sceneAoi.ts'

export const isSidebarOpen = ref<boolean>(true)

export const activeSceneId = ref<string | null>(null)

export const activeJobId = ref<string | null>(null)

export const imageryVisible = ref<boolean>(false)

export const imageryOpacity = ref<number>(0.7)

export const activeAoi = ref<SceneAoi | null>(null)

export const detectionConfidence = ref<number>(0.5) // Show detections with confidence of 50% or higher
import express from 'express'
import cors from 'cors'
import scenes from './data/scenes.json' with { type: 'json' }
import detections from './data/detections.json' with { type: 'json' }

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/api/scenes', async (req, res) => {
    res.json(scenes)
})

app.get('/api/scenes/:sceneId',(req, res) => {
    const scene = scenes.find(item => item.id === req.params.sceneId)

    if (!scene) {
        res.status(404).json({ message: 'Scene not found.' })
        return
    }

    res.json(scene)
})

app.get('/api/scenes/:sceneId/detections', (req, res) => {
    const sceneDetections = detections.filter(item => item.sceneId === req.params.sceneId)

    res.json(sceneDetections)
})

app.get('/api/detections', (req, res) => {
    res.json(detections)
})

app.get('/app/detections/:id', (req, res) => {
    const detection = detections.find(item => item.id === req.params.id)

    if (!detection) {
        res.status(404).json({ message: 'Detection not found.' })
        return
    }

    res.json(detection)
})


app.listen(PORT, () => console.log(`Mock API running on http://localhost:${PORT}`))
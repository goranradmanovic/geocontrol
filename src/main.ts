import { createApp } from 'vue'
import App from './App.vue'
import { router } from './plugins/router'
import { vuetify } from './plugins/vuetify'
import { installVueQuery } from './plugins/vue-query.ts'

import 'ol/ol.css' // Import the core OpenLayers CSS from the ol package
import './assets/css/style.css'

const app = createApp(App)

app.use(router)
app.use(vuetify)

installVueQuery(app) // register and install TanStack Vue Query throughout the application.

app.mount('#app')
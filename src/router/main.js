import { createRouter, createWebHashHistory } from 'vue-router'
import Create from '../pages/Create.vue'
import Show from '../pages/Show.vue'

const routes = [
    { path: '/', component: Create },
    { path: '/:hash', component: Show }
]

const defaultRouter = createRouter({
    history: createWebHashHistory(),
    routes
})

export default defaultRouter
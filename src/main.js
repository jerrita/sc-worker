import { createApp } from 'vue'
// import './style.css'
import axios from 'axios';
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import defaultRouter from './router/main'
import glb from './global'

import 'highlight.js/styles/stackoverflow-light.css';
import hljsCommon from 'highlight.js/lib/common';
import hljsVuePlugin from "@highlightjs/vue-plugin";

const app = createApp(App)

app.config.globalProperties.$axios = axios.create({
    baseURL: glb.site_prefix + "api",
})
app.config.globalProperties.$glb = glb

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 注意：解决 Vue 使用 highlight.js build 打包发布后样式消失问题
// 原因是 webpack 在打包的时候没有把未被使用的代码打包进去，因此，在此处引用一下，看似无意义实则有用
hljsCommon.highlightAuto('<h1>Highlight.js has been registered successfully!</h1>').value

app.use(defaultRouter).use(hljsVuePlugin).mount('#app')

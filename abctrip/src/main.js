import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'


// boot strap css import
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import "@/assets/css/font.css"; // 폰트 CSS 파일 포함

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

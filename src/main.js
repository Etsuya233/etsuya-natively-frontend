import './assets/main.css'
import {createApp} from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css'
import nativelyTheme from "@/assets/nativelyTheme.js";
import router from './router/router.js';
import pinia from "@/stores/pinia.js";

const app = createApp(App)
app.use(router);
app.use(pinia);
app.use(PrimeVue, {
    theme: {
        preset: nativelyTheme
    }
});

app.mount('#app')
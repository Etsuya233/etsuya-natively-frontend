import './assets/main.css'
import {createApp} from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css'
import nativelyTheme from "@/assets/nativelyTheme.js";
import router from './router/router.js';
import pinia from "@/stores/pinia.js";
import i18n from '@/lang/i18n.js';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import Vue3Toastify, {toast} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const app = createApp(App)

app.use(i18n);
app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: nativelyTheme,
        options: {
            darkModeSelector: '.dark'
        },
    }
});
app.use(ToastService);
app.use(
    Vue3Toastify,
    {
        limit: 3,
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
        transition: toast.TRANSITIONS.SLIDE,
        clearOnUrlChange: false
    }
);
app.directive('tooltip', Tooltip);

app.mount('#app')
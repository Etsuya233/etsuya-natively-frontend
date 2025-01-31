import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import { definePreset } from '@primevue/themes';

const nativelyTheme = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{teal.50}',
            100: '{teal.100}',
            200: '{teal.200}',
            300: '{teal.300}',
            400: '{teal.400}',
            500: '{teal.500}',
            600: '{teal.600}',
            700: '{teal.700}',
            800: '{teal.800}',
            900: '{teal.900}',
            950: '{teal.950}',
        }
    }
})

export default nativelyTheme;
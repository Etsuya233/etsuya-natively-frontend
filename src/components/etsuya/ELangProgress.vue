<template>
    <Tag :value="`${t('lang.' + props.lang + 'Abbr')}` + (props.proficiency? ` · ${props.proficiency}`: '')" :severity="severity" class="h-5 !rounded-full" pt:label:class="!text-xs"/>
</template>

<script setup>
import Tag from 'primevue/tag';
import {useI18n} from "vue-i18n";
import {computed} from "vue";

const { t, locale, availableLocales } = useI18n();

const props = defineProps({
    lang: {
        default: 'en',
    },
    proficiency: {
        default: null
    }
})

const severity = computed(() => {
    if(props.proficiency === 3) return 'warn';
    else if(props.proficiency === 4) return 'info';
    else if(props.proficiency === 5) 'success';
    else return 'secondary';
})
</script>

<style scoped>

</style>
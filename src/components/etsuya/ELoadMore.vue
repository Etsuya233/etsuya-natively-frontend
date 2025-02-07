<template>
    <div class="h-12 flex justify-center items-center select-none">
        <div v-if="!loading" class="text-slate-600">
            {{ t('loadMore.clickPrompt') }}
        </div>
        <div v-else class="pi pi-spin pi-spinner-dotted !text-2xl text-slate-700"></div>
    </div>
</template>

<script setup>
import {useI18n} from "vue-i18n";

const { t, locale, availableLocales } = useI18n();

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>

</style>
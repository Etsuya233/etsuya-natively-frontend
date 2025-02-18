<template>
    <div class="h-12 flex justify-center items-center select-none">
        <div v-if="!loading" class="text-surface-600 dark:text-surface-400 select-none">
            {{ t('loadMore.clickPrompt') }}
        </div>
        <div v-else class="pi pi-spin pi-spinner-dotted !text-2xl text-primary"></div>
    </div>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import ETransition from "@/components/etsuya/ETransition.vue";

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
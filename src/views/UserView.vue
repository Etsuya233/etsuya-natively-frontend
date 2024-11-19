<template>
    <div>
        <EHeader class='sticky top-0 z-10 transition-opacity transform-gpu hover:!opacity-100' :title="t('user.post')"/>
        
    </div>
</template>

<script setup>
import EHeader from "@/components/logo/EHeader.vue";
import {useI18n} from "vue-i18n";
import {ref} from "vue";

const { t, locale, availableLocales } = useI18n();
let id = ref();



</script>

<style scoped>

</style>
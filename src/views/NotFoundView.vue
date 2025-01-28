<template>
    <div class="bg-red-50 h-dvh w-dvw">
        <div class="flex flex-col p-4 gap-4">
            <div class="flex flex-col gap-4 mt-8 md:items-center md:mt-12">
                <Logo size="lg" />
                <div class="text-5xl font-bold text-red-600 mt-2 md:mt-4">
                    404 Not Found
                </div>
                <Button class="mt-4 md:mt-8" :label="t('login.goToHome')" @click="router.push({name: 'Home'})" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Logo from "@/components/natively/Logo.vue";
import {useI18n} from "vue-i18n";
import Button from "primevue/button";
import {useRouter} from "vue-router";

const { t, locale, availableLocales } = useI18n();

const router = useRouter();
</script>

<style scoped>

</style>
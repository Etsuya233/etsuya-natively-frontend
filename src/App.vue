<template>
    <Toast position="top-center" class="!w-full !top-0 !max-w-screen-sm" pt:root:class="*:!m-4" />
    <router-view class="selection:bg-primary-100 selection:text-primary-600 dark:selection:bg-primary-800"/>
</template>

<script setup>
import {themeChange, detectTheme} from "@/utils/theme.js";
import Toast from 'primevue/toast';

let currentTheme = detectTheme();
themeChange(currentTheme);

</script>

<style>
* {
    font-family: 'Inter', sans-serif;
    user-select: none;
}
</style>

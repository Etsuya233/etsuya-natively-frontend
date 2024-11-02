<template>
    <Toast position="top-center" class="!w-full !p-4 !top-0 !max-w-screen-sm" />
    <router-view />
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

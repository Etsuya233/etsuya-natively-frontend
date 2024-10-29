<template>
    <router-view />
</template>

<script setup>
import {themeChange, detectTheme} from "@/utils/theme.js";

let currentTheme = detectTheme();
themeChange(currentTheme);

</script>

<style>
* {
    font-family: 'Inter', sans-serif;
    user-select: none;
}
</style>

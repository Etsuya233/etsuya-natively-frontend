<template>
    <div class="w-full">
        <EHeader class='sticky top-0 z-10 transition-opacity transform-gpu hover:!opacity-100'  />
        <div class="text-2xl font-bold">
            {{ route.fullPath }}
        </div>
    </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import EHeader from "@/components/logo/EHeader.vue";

const route = useRoute();
</script>

<style scoped>

</style>
<template>
    <div class="w-full">
        <RouterView />
    </div>
</template>

<script setup>
import {useRoute} from "vue-router";

const route = useRoute();

</script>

<style scoped>

</style>
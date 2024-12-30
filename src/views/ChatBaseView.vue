<template>
    <div class="w-full">
        <RouterView />
    </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import {watch} from "vue";

const route = useRoute();



</script>

<style scoped>

</style>
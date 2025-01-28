<template>
    <div class="w-full">
        <div>{{ props.title }}</div>
        <ProgressBar v-if="props.loading" mode="indeterminate" class="!h-2 mt-2" />
    </div>
</template>

<script setup>
import ProgressBar from "primevue/progressbar";
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: true
    }
})
</script>

<style scoped>

</style>
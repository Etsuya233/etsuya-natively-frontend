<template>
    <div class="h-12 flex justify-center items-center select-none">
        <div v-if="loading" class="pi pi-spin pi-spinner-dotted !text-2xl text-slate-700"></div>
    </div>
</template>

<script setup>
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>

</style>
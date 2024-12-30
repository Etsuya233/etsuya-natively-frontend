<template>
    <div class="active:bg-slate-300
        flex items-center py-3 px-4 hover:bg-slate-200 transition-colors transform-gpu text-slate-800">
        <div v-if="icon" :class="`pi !text-xl pr-3 ${props.icon}`"></div>
        <div class="min-w-0 flex-1">{{props.title}}</div>
        <div v-if="props.selected" class="text-slate-800 flex items-center">
            <div class="pi pi-check !font-bold"></div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    icon: {
        default: ''
    },
    title: {
        default: ''
    },
    selected: {
        default: false
    }
})


</script>

<style scoped>

</style>
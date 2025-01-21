<template>
    <div class="py-3 px-4 bg-slate-100 transition-colors transform-gpu text-slate-800"
         :class="{ 'bg-red-700': props.danger, 'hover:bg-red-800': props.danger, 'active:bg-red-900': props.danger,
          'text-white': props.danger, 'flex': !props.enableSlot, 'items-center': !props.enableSlot,
          'hover:bg-slate-200': interactive, 'active:bg-slate-300': interactive }">
        <div v-if="props.icon" :class="`pi !text-xl pr-3 ${props.icon}`"></div>
        <div v-if="props.title" class="min-w-0 flex-1">{{props.title}}</div>
        <div v-if="props.selected" class="text-slate-800 flex items-center">
            <div class="pi pi-check !font-bold"></div>
        </div>
        <slot></slot>
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
    },
    danger: {
        default: false
    },
    enableSlot: {
        default: false
    },
    interactive: {
        default: true
    }
})


</script>

<style scoped>

</style>
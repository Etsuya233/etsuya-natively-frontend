<template>
    <div class="py-3 px-4 bg-surface-100 dark:bg-surface-800 transition-colors transform-gpu text-surface-800 dark:text-surface-100"
         :class="{ '!bg-red-700': props.danger, 'hover:!bg-red-800': props.danger, 'active:!bg-red-900': props.danger,
          'text-white': props.danger, 'flex': !props.enableSlot, 'items-center': !props.enableSlot,
          'hover:bg-surface-200 hover:dark:bg-surface-700': interactive, 'active:bg-surface-300 active:dark:bg-surface-600': interactive, 'rounded-2xl': rounded, 'animate-pulse': props.loading }">
        <div v-if="props.icon" :class="`pi !text-xl pr-3 ${props.icon}`"></div>
        <div v-if="props.title" class="min-w-0 flex-1">{{props.title}}</div>
        <div v-if="props.selected" class="text-surface-800 dark:text-surface-100 flex items-center">
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
        default: false,
    },
    danger: {
        default: false,
        type: Boolean
    },
    enableSlot: {
        default: false,
        type: Boolean
    },
    interactive: {
        default: true,
    },
    rounded: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
})


</script>

<style scoped>

</style>
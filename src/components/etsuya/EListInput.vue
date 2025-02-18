<template>
    <div class="py-2 px-4 bg-surface-100 dark:bg-surface-800 transition-colors transform-gpu flex flex-col
    text-surface-800 dark:text-surface-100 hover:bg-surface-200 hover:dark:bg-surface-700 active:bg-surface-300 active:dark:bg-surface-600">
        <div v-if="props.icon" :class="`pi !text-xl pr-3 ${props.icon}`"></div>
        <div v-if="props.title" class="min-w-0 flex-1 text-xs text-slate-600 dark:text-surface-400">{{props.title}}</div>
        <div>
            <input v-bind="props.attr" class="outline-none bg-transparent w-full" v-model="value" />
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
    danger: {
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
    validation: {
    
    },
    attr: {
        default: {

        }
    }
})
const value = defineModel();

</script>

<style scoped>

</style>
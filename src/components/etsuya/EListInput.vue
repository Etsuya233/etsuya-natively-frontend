<template>
    <div class="py-2 px-4 bg-slate-100 transition-colors transform-gpu text-slate-800 flex flex-col hover:bg-slate-200 active:bg-slate-300">
        <div v-if="props.icon" :class="`pi !text-xl pr-3 ${props.icon}`"></div>
        <div v-if="props.title" class="min-w-0 flex-1 text-xs text-slate-600">{{props.title}}</div>
        <div>
            <input class="outline-none bg-transparent w-full" v-model="value" />
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
    
    }
})
const value = defineModel();

</script>

<style scoped>

</style>
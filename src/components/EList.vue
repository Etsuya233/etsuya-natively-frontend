<template>
    <div class="w-full">
        <div class="text-xl font-bold pl-2 mb-2" v-if="props.title || props.icon">
            <span :class="props.icon"></span><span>&nbsp;{{ props.title }}</span>
        </div>
        <div class="rounded-2xl divide-y overflow-hidden">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        default: '',
    },
    icon: {
        default: '',
    }
})
</script>

<style scoped>

</style>
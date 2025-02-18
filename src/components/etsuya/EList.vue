<template>
    <div class="w-full">
        <div class="text-xl font-bold pl-2 mb-2" v-if="props.title || props.icon">
            <span :class="props.icon"></span><span>&nbsp;&nbsp;{{ props.title }}</span>
        </div>
        <div class="overflow-hidden" :class="{ 'rounded-2xl': !props.customSlot, 'divide-y *:border-surface': !props.customSlot }">
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
    },
    customSlot: {
        default: false,
        type: Boolean
    }
})
</script>

<style scoped>

</style>
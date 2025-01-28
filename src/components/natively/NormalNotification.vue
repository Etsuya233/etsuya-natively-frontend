<template>
    <div>
        <div class="font-bold">{{props.title}}</div>
        <div>{{props.content}}</div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    }
})
</script>

<style scoped>

</style>
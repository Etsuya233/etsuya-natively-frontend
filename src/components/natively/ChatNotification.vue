<template>
    <div class="flex w-full">
        <div class="flex-shrink-0 pt-1 pr-2">
            <div class="h-10 w-10">
                <img :src="props.avatar" class="object-cover w-full h-full rounded-full"  alt="avatar"/>
            </div>
        </div>
        <div class="flex-1 min-w-0 overflow-hidden">
            <div class="font-bold w-full whitespace-nowrap text-ellipsis overflow-hidden">{{props.nickname}}</div>
            <div class="w-full whitespace-nowrap overflow-hidden text-ellipsis">{{props.content}}</div>
        </div>
        <div class="flex-shrink-0">
            <div class="pi pi-times"></div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    nickname: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    }
})
</script>

<style scoped>

</style>
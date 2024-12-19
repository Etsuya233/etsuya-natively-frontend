<template>
    <div class="p-2 flex gap-[2px]">
        <div class="inline-block border-slate-700 border-y rounded-3xl border-[1.5px] h-4" v-for="i in 3"></div>
        <div class="inline-block border-slate-400 border-y rounded-3xl border-[1.5px] h-4" v-for="i in 2"></div>
    </div>
    <div class="p-2 flex gap-1">
        <Tag value="英 · 2" class="h-4 !rounded-full" pt:label:class="!text-xs"/>
        <Tag value="ENG · 2" class="h-4 !rounded-full" pt:label:class="!text-xs"/>
        <Tag value="ENG · 2" class="h-4 !rounded-full" pt:label:class="!text-xs"/>
    </div>
</template>

<script setup>
import Tag from 'primevue/tag';
</script>

<style scoped>

</style>
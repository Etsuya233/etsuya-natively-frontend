<template>
    <div class="w-full flex flex-col gap-2">
        <div v-for="(item, index) in props.content"
             class="*:select-text">
            <div v-if="item.type === 1" class="whitespace-pre-line">
                {{ item.value }}
            </div>
            <div class="w-full" v-else-if="item.type === 3">
                <div class="w-full rounded-lg border mt-1 overflow-hidden">
                    <img :src="item.name"
                         class="h-full w-full max-h-[20rem] object-contain cursor-pointer"
                         alt="image"/>
                </div>
                <div class="text-sm text-center text-slate-600 mt-1 select-text">
                    {{ item.caption }}
                </div>
            </div>
            <div v-else-if="item.type === 2" class="flex flex-col gap-1">
                <div>
                    <span v-for="d in item.change"
                          class="font-bold rounded select-text"
                          :class="{ 'bg-red-200': d.removed, 'text-red-500': d.removed, 'bg-primary-100': d.added, 'text-primary-700': d.added }">
                        {{ d.value }}
                    </span>
                </div>
            </div>
            <div v-else-if="item.type === 5">
                <div class="w-full">
                    <MdRender :dynamic="true" :markdown="item.value"/>
                </div>
            </div>
            <div v-else>
                <div class="flex justify-center">
                    <audio :src="item.name" controls/>
                </div>
                <div class="text-sm text-center text-slate-600 mt-1 select-text">
                    {{ item.caption }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import MdRender from "@/components/logo/MdRender.vue";

const props = defineProps({
    content: {
        default: []
    }
})

</script>

<style scoped>

</style>
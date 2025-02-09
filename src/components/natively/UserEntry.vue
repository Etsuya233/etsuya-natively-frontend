<template>
    <div class="flex cursor-pointer">
        <div class="w-12 flex-shrink-0 flex items-center">
            <div class="w-12 h-12">
                <Avatar class="!w-full !h-full" shape="circle" :image="props.value.avatar" />
            </div>
        </div>
        <div class="pl-5 flex-1 min-w-0 overflow-hidden">
            <div class="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{{props.value.nickname}}</div>
            <div class="text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis">@{{props.value.username}}</div>
            <div>
                <ELangProgress class="mr-2" v-for="(lang, index) in props.value.languages" :lang="lang.language" :proficiency="lang.proficiency" />
            </div>
        </div>
    </div>
</template>

<script setup>
import ELangProgress from "@/components/etsuya/ELangProgress.vue";
import Avatar from "primevue/avatar";
import {useRouter} from "vue-router";

const props = defineProps({
    value: {
        type: Object,
        required: true
    }
})

const router = useRouter();
</script>

<style scoped>

</style>
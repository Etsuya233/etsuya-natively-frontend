<template>
    <div class="w-full">
        <EHeader class="sticky top-0 z-10" :title="t('user.followers')" />
        <div class="w-full">
            <div class="flex flex-col divide-y">
                <div class="p-4 flex cursor-pointer hover:bg-slate-100 transition-colors transform-gpu"
                     v-for="(item, index) in followings" :key="index" @click="router.push({ name: 'User', params: { id: item.id } })">
                    <div class="w-12 h-12 flex-shrink-0">
                        <Avatar class="!w-full !h-full" shape="circle" :image="item.avatar" />
                    </div>
                    <div class="pl-5 flex-1 min-w-0 overflow-hidden">
                        <div class="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{{item.nickname}}</div>
                        <div class="text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis">@{{item.username}}</div>
                    </div>
                </div>
                <div></div>
            </div>
            <div class="w-full select-none">
                <ELoading :loading="loading" />
            </div>
        </div>
    </div>
</template>

<script setup>
import EHeader from "@/components/etsuya/EHeader.vue";
import {useI18n} from "vue-i18n";
import {onBeforeMount, ref, watch} from "vue";
import {apiUserFollowers} from "@/api/user.js";
import {useRoute, useRouter} from "vue-router";
import Avatar from "primevue/avatar";
import {useScroll} from "@/utils/scroll.js";
import ELoading from "@/components/etsuya/ELoading.vue";

const { t, locale, availableLocales } = useI18n();
const route = useRoute();
const router = useRouter();
const { isAtBottom } = useScroll();

const userId = ref(null);
const loading = ref(true);
const followings = ref([]);

watch(isAtBottom, async (newVal, oldVal) => {
    if(loading.value){
        return;
    }
    if(newVal && !oldVal){
        try {
            let lastId = followings.value[followings.value.length - 1].id;
            let res = await apiUserFollowers(userId.value, lastId);
            followings.value.push(... res);
        } catch (e) {
            console.log(e);
        } finally {
            loading.value = false;
        }
    }
})

onBeforeMount(async () => {
    userId.value = route.params.id;
    let res = await apiUserFollowers(userId.value, null);
    followings.value.push(... res);
    loading.value = false;
})
</script>

<style scoped>

</style>
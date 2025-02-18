<template>
    <div class="w-full">
        <EHeader class="sticky top-0 z-10" :title="t('user.followers')" />
        <div class="w-full">
            <div class="flex flex-col divide-y *:border-surface">
                <UserEntry v-for="item in followings" @click="router.push({ name: 'User', params: { id: item.id }})" class="px-4 py-2" :value="item" />
                <div></div>
            </div>
            <div class="w-full select-none">
                <ELoadMore :loading="loading" />
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
import ELoadMore from "@/components/etsuya/ELoadMore.vue";
import UserEntry from "@/components/natively/UserEntry.vue";

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
<template>
    <div class="w-full">
        <EHeader class='sticky top-0 z-10 transition-opacity transform-gpu hover:!opacity-100' :title="t('chat.contact')" />
        <div class="w-full">
            <div class="flex flex-col divide-y">
                <div class="p-4 flex cursor-pointer hover:bg-slate-100 transition-colors transform-gpu"
                     v-for="(item, index) in contacts" :key="index" @click="router.push({ name: 'Chat', params: { id: item.id } })">
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
        </div>
    </div>
</template>

<script setup>
import EHeader from "@/components/logo/EHeader.vue";
import {useI18n} from "vue-i18n";
import {onMounted, ref} from "vue";
import {apiGetContact} from "@/api/user.js";
import Avatar from "primevue/avatar";
import {useRouter} from "vue-router";

const router = useRouter();
const { t, locale, availableLocales } = useI18n();

// mounted
const pageLoading = ref(false);
const contacts = ref([]);

// lifespan
onMounted(() => {
    pageLoading.value = true;
    apiGetContact().then((res) => {
        contacts.value.push(... res);
        pageLoading.value = false;
    });
})

</script>

<style scoped>

</style>
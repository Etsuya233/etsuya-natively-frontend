<template>
    <div class="w-full">
        <EHeader class='sticky top-0 z-10 transition-opacity transform-gpu hover:!opacity-100' :title="t('chat.chat')"
                 :class="{'opacity-30': isScrollDown}" :show-back="false" />
        <div class="flex flex-col divide-y min-h-[calc(100dvh-11rem)] md:min-h-[100vh]">
            <div class="p-4 flex cursor-pointer hover:bg-slate-100 transition-colors transform-gpu"
                 v-for="[key, item] in conversations" :key="key"
                 @click="router.push({ name: 'Chat', params: {id: key}})">
                <div class="w-12 h-12 flex-shrink-0">
                    <OverlayBadge :value="item.unread" severity="danger" size="small"
                                  :pt:pcbadge:root:class="(item.unread === 0)? '!hidden !translate-x-0 !translate-y-0': '!translate-x-1 !-translate-y-1'">
                        <Avatar class="!w-full !h-full" shape="circle" :image="item.avatar" />
                    </OverlayBadge>
                </div>
                <div class="pl-5 flex-1 w-0 overflow-hidden">
                    <div class="flex">
                        <span class="inline-block font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{{item.nickname}}</span>
                        <span class="inline-block text-slate-600 flex-shrink-0">&nbsp;·&nbsp;{{item.lastTimeDisplay}}</span>
                    </div>
                    <div class="text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis">{{item.content}}</div>
                </div>
            </div>
            <div></div>
        </div>
        <div class="sticky bottom-16 w-fit float-right md:bottom-0 pr-4 h-16">
            <Button icon="pi pi-plus !text-xl" class="!p-7 shadow-lg"
                    rounded severity="primary" @click="router.push({ name: 'Contact'} )"/>
        </div>
    </div>
</template>

<script setup>
import EHeader from "@/components/logo/EHeader.vue";
import {useScroll} from "@/utils/scroll.js";
import {useI18n} from "vue-i18n";
import Avatar from 'primevue/avatar';
import OverlayBadge from 'primevue/overlaybadge';
import {onBeforeUnmount, onMounted} from "vue";
import {useRouter} from "vue-router";
import {useChatStore} from "@/stores/chatStore.js";
import Button from "primevue/button";

const router = useRouter();
const chatStore = useChatStore();
const {isScrollDown} = useScroll();
const { t, locale, availableLocales } = useI18n();

const conversations = chatStore.conversationMap;

onMounted(() => {
    if(chatStore.initConversation()){
        chatStore.loadMoreConversation();
    }
})

</script>

<style scoped>

</style>
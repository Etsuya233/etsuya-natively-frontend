<template>
    <div class="w-full">
        <EHeader class='sticky top-0 z-10 transition-opacity transform-gpu hover:!opacity-100' :enable-slot="true" >
            <div class="flex items-center">
                <div class="h-10 w-10 mr-4 flex-shrink-0">
                    <img :src="receiverInfo.avatar" class="object-cover rounded-full" alt="avatar"/>
                </div>
                <div class="overflow-hidden text-ellipsis">{{receiverInfo.nickname}}</div>
            </div>
            <ETransition name="scale">
                <div v-if="loadingMore" class="top-20 absolute flex left-0 right-0 justify-center items-center pointer-events-none">
                    <div  class="border h-12 w-12 flex items-center justify-center
                    rounded-full bg-slate-100 shadow-md">
                        <div class="pi pi-spin pi-spinner-dotted !text-2xl text-slate-700"></div>
                    </div>
                </div>
            </ETransition>
        </EHeader>
        
<!--        MsgList -->
        <div class="flex flex-col gap-3 px-3 my-3 min-h-[calc(100vh-8.5rem)]">
            <div v-for="(item, index) in msgs" class="">
                <div class="flex justify-center" v-if="index === 0 || msgs[index].date !== msgs[index - 1].date">
                    <div class="text-sm w-fit bg-slate-100 text-slate-600 py-1 px-2 mb-3 rounded-full">
                        {{item.date}}
                    </div>
                </div>
                <div v-if="meId === item.senderId" class="w-full pl-8">
                    <div class="w-fit max-w-[28rem] overflow-hidden text-ellipsis p-3 border border-primary bg-primary
                    hover:bg-primary-emphasis text-white rounded-2xl float-right select-text transition-colors">
                        {{item.content}}
                        <div class="text-xs inline-block translate-y-1/2 float-right">&nbsp;{{item.time.substring(0, 5)}}</div>
                    </div>
                </div>
                <div v-else class="w-full pr-8">
                    <div class="w-fit max-w-[28rem] overflow-hidden text-ellipsis p-3 bg-slate-100 border-slate-100
                        hover:bg-slate-200 transition-colors rounded-2xl select-text text-slate-900">
                        {{item.content}}
                        <div class="text-xs inline-block translate-y-1/2 float-right text-slate-600">&nbsp;&nbsp;{{item.time.substring(0, 5)}}</div>
                    </div>
                </div>
            </div>
        </div>
        
<!--        Input -->
        <div class="sticky bottom-0 flex flex-col bg-white/80 backdrop-blur-xl p-2 border-t transition-all transform-gpu"
            :class="{ '!animate-pulse': chatStore.sending }">
            <ETransition name="scale">
                <div class="absolute bottom-[4.5rem] right-4" v-if="!isAtBottom" @click="goBottom" :class="{ 'bottom-40': tools }">
                    <Button v-if="!hasUnread" icon="pi pi-arrow-down !text-xl" class="!p-6 shadow-lg"
                            rounded severity="secondary" />
                    <Button v-else icon="pi pi-envelope !text-xl" class="!p-6 shadow-lg animate-bounce"
                            rounded severity="secondary" />
                </div>
            </ETransition>
            <div class="w-full flex gap-2 items-end">
                <Button :disabled="chatStore.sending" v-if="!msgContent" @click="tools = !tools" icon="pi pi-plus"
                        rounded severity="secondary" pt:root:class="!h-10 !w-10 !py-0 !flex-shrink-0"/>
                <textarea :disabled="chatStore.sending" @input="textareaKeyDown" v-model="msgContent"
                          class="h-10 outline-none text-base py-2 px-4 rounded-[1.25rem] ring-1 resize-none w-0
                          ring-slate-300 bg-slate-100/60 flex-1"
                          :placeholder="chatStore.sending? t('chat.sending'): t('chat.message')"></textarea>
                <Button :disabled="!msgContent || chatStore.sending" icon="pi pi-send" rounded
                        pt:root:class="!h-10 !w-10 !py-0 !flex-shrink-0" @click="sendTextMsg"/>
            </div>
            <div class="pt-3 flex *:flex-1 gap-2" v-if="tools">
                <Button icon="pi pi-image" label="Images" severity="secondary" outlined iconPos="top" pt:root:class="!bg-white/50" />
                <Button icon="pi pi-camera" label="Camera" severity="secondary" outlined iconPos="top" pt:root:class="!bg-white/50" />
                <Button icon="pi pi-microphone" label="Voice" severity="secondary" outlined iconPos="top" pt:root:class="!bg-white/50" />
            </div>
        </div>
    </div>
</template>

<script setup>
import EHeader from "@/components/logo/EHeader.vue";
import Button from 'primevue/button';
import {useScroll} from "@/utils/scroll.js";
import {useI18n} from "vue-i18n";
import {nextTick, onMounted, ref, watch} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import {useRouter, useRoute} from "vue-router";
import {useChatStore} from "@/stores/chatStore.js";
import {apiGetUser} from "@/api/user.js";
import OverlayBadge from "primevue/overlaybadge";
import ETransition from "@/components/ETransition.vue";

const userStore = useUserStore();
const {isScrollDown, isAtBottom, isAtTop} = useScroll();
const { t, locale, availableLocales } = useI18n();
const router = useRouter();
const route = useRoute();
const chatStore = useChatStore();

let meId = userStore.userInfo.id;
let receiver = ref(null);
let msgs = ref([]);
let receiverInfo = ref({ nickname: '', avatar: '/data/natively-avatar/user.png' });

// msg
let msgContent = ref('');
const sendTextMsg = () => {
    chatStore.sendTextMsg(msgContent.value, receiver.value);
    msgContent.value = '';
}
let loadingMore = ref(false);
const loadMoreOldMsg = async () => {
    loadingMore.value = true;
    try {
        await chatStore.loadMoreOldMessage(receiver.value);
    } catch (e) {} finally {
        loadingMore.value = false;
    }
}

// tools
let tools = ref(false);

// ui
const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
const textAreaMaxHeight = 8.5 * rootFontSize;
const textAreaMinHeight = 2.5 * rootFontSize;
const textareaKeyDown = (e) => {
    e.target.style.height = '1px';
    let height = e.target.scrollHeight;
    height = Math.min(height, textAreaMaxHeight);
    e.target.style.height = Math.max(height, textAreaMinHeight) + 'px';
}
const goBottom = () => {
    // 获取页面的总高度
    const documentHeight = document.documentElement.scrollHeight;
    // 获取窗口的高度
    const windowHeight = window.innerHeight;
    window.scrollTo({
        top: documentHeight - windowHeight,  // 目标位置
        behavior: 'smooth'  // 平滑滚动
    });
}
let latestMsgId; // used to scroll to bottom when receiving msg
let hasUnread = ref(false);
watch(() => msgs.value.length, (newVal, oldVal) => {
    const latestMsg = msgs.value[msgs.value.length - 1];
    let currentLatestMsgId = latestMsg? latestMsg.id: 0;
    if(isAtBottom.value && currentLatestMsgId !== latestMsgId){
        hasUnread.value = false;
        nextTick(() => goBottom());
    } else if(!isAtBottom.value && currentLatestMsgId !== latestMsgId){
        hasUnread.value = true;
    }
})
watch(isAtBottom, (newVal, oldVal) => {
    if(newVal){
        hasUnread.value = false;
    }
})
watch(isAtTop, async (newVal, oldVal) => {
    if(loadingMore.value === false && newVal === true){
        let heightToBottom = document.documentElement.scrollHeight;
        await loadMoreOldMsg();
        nextTick(() => {
            let scrollYPos = document.documentElement.scrollHeight - heightToBottom;
            console.log(heightToBottom, document.documentElement.scrollHeight, scrollYPos);
            window.scrollTo(0, scrollYPos);
        })
    }
})

// lifespan
onMounted(async () => {
    receiver.value = route.params.id;
    if(chatStore.initMessage(receiver.value)){
        await chatStore.loadMoreOldMessage(receiver.value);
    }
    msgs.value = chatStore.msgMap.get(receiver.value);
    receiverInfo.value = await apiGetUser(receiver.value);
    const latestMsg = msgs.value[msgs.value.length - 1];
    latestMsgId = latestMsg? latestMsg.id: 0;
    nextTick(() => goBottom());
})

</script>

<style scoped>

</style>
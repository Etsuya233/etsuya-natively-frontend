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
                    <div v-if="item.type === 1" class="w-fit max-w-[28rem] overflow-hidden text-ellipsis p-3 border border-primary bg-primary
                    hover:bg-primary-emphasis text-white rounded-2xl float-right select-text transition-colors" @click="openMsgMenu(item, $event)">
                        {{item.content}}
                        <div class="text-xs inline-block translate-y-1/2 float-right">&nbsp;{{item.time.substring(0, 5)}}</div>
                    </div>
                    <div v-else-if="item.type === 2" class="w-fit float-right max-w-[28rem] min-w-24 relative h-36 rounded-2xl overflow-hidden border" @click="openImageMenu($event)">
                        <img class="h-full w-full object-cover" :src="item.content" alt="image"/>
                        <div class="absolute text-xs inline-block bottom-2 right-2 bg-slate-700/30 text-slate-100 px-1 rounded-full">
                            {{item.time.substring(0, 5)}}
                        </div>
                    </div>
                    <div v-else-if="item.type === 3" class="w-fit max-w-[28rem] overflow-hidden text-ellipsis p-3 border border-primary bg-primary
                    hover:bg-primary-emphasis text-white rounded-2xl float-right select-text transition-colors">
                        <audio :src="item.content" controls />
                        <div class="text-xs inline-block translate-y-1/2 float-right">&nbsp;{{item.time.substring(0, 5)}}</div>
                    </div>
                    <div v-else></div>
                </div>
                <div v-else class="w-full pr-8">
                    <div v-if="item.type === 1" class="w-fit max-w-[28rem] overflow-hidden text-ellipsis p-3 bg-slate-100 border-slate-100
                        hover:bg-slate-200 transition-colors rounded-2xl select-text text-slate-900" @click="openMsgMenu(item, $event)">
                        {{item.content}}
                        <div class="text-xs inline-block translate-y-1/2 float-right text-slate-600">&nbsp;&nbsp;{{item.time.substring(0, 5)}}</div>
                    </div>
                    <div v-else-if="item.type === 2" class="w-fit max-w-[28rem] min-w-24 relative h-36 rounded-2xl overflow-hidden border" @click="openImageMenu($event)">
                        <img class="h-full w-full object-cover" :src="item.content" alt="image"/>
                        <div class="absolute text-xs inline-block bottom-2 right-2 bg-slate-700/30 text-slate-100 px-1 rounded-full">
                            {{item.time.substring(0, 5)}}
                        </div>
                    </div>
                    <div v-else-if="item.type === 3" class="w-fit max-w-[28rem] overflow-hidden text-ellipsis p-3 bg-slate-100 border-slate-100
                        hover:bg-slate-200 transition-colors rounded-2xl select-text text-slate-900">
                        <audio :src="item.content" controls />
                        <div class="text-xs inline-block translate-y-1/2 float-right text-slate-600">&nbsp;&nbsp;{{item.time.substring(0, 5)}}</div>
                    </div>
                    <div v-else></div>
                </div>
            </div>
            <div class="h-12 md:hidden">
            
            </div>
        </div>
        
<!--        Input -->
        <div class="sticky bottom-14 md:bottom-0 flex flex-col bg-white/80 backdrop-blur-xl p-2 border-t transition-all transform-gpu"
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
                          ring-slate-300 bg-slate-100/60 flex-1 caret-primary-emphasis"
                          :placeholder="chatStore.sending? t('chat.sending'): t('chat.message')"></textarea>
                <Button :disabled="!msgContent || chatStore.sending" icon="pi pi-send" rounded
                        pt:root:class="!h-10 !w-10 !py-0 !flex-shrink-0" @click="sendTextMsg"/>
            </div>
            <div class="pt-3 flex *:flex-1 gap-2" v-if="tools">
                <Button @click="addImage" icon="pi pi-image" label="Images" severity="secondary" outlined iconPos="top" pt:root:class="!bg-white/50" />
                <Button  icon="pi pi-camera" label="Camera" severity="secondary" outlined iconPos="top" pt:root:class="!bg-white/50" />
                <Button @click="addVoice" icon="pi pi-microphone" label="Voice" severity="secondary" outlined iconPos="top" pt:root:class="!bg-white/50" />
            </div>
        </div>
        
        <ImageUploader2 ref="imageUploader" :enable-send="true" :limit="1" v-model:images="images" v-model:imageSrc="imageSrc" @send="sendImage" />
        <VoiceRecorder2 ref="voiceRecorder" :enable-send="true" v-model:value="voice" v-model:url="voiceUrl" @send="sendVoice" />
        
<!--        Popover -->
        <Popover ref="msgMenu" pt:content:class="!p-1" pt:root:class="!rounded-xl">
            <Menu :model="menuItem" pt:root:class="!border-none !w-fit !min-w-0" pt:list:class="!w-fit" />
        </Popover>
        <Popover ref="imageMsgMenu" pt:content:class="!p-1" pt:root:class="!rounded-xl">
            <Menu :model="imageMenuItem" pt:root:class="!border-none !w-fit !min-w-0" pt:list:class="!w-fit" />
        </Popover>
    </div>
</template>

<script setup>
import EHeader from "@/components/logo/EHeader.vue";
import Button from 'primevue/button';
import {useScroll} from "@/utils/scroll.js";
import {useI18n} from "vue-i18n";
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import {useRoute, useRouter} from "vue-router";
import {useChatStore} from "@/stores/chatStore.js";
import {apiGetUser} from "@/api/user.js";
import ETransition from "@/components/ETransition.vue";
import Popover from 'primevue/popover';
import Menu from 'primevue/menu';
import {useLanguageStore} from "@/stores/languageStore.js";
import {useNaviStore} from "@/stores/naviStore.js";
import ImageUploader2 from "@/components/ImageUploader2.vue";
import {apiSendFile} from "@/api/chat.js";
import VoiceRecorder2 from "@/components/VoiceRecorder2.vue";

const userStore = useUserStore();
const {isScrollDown, isAtBottom, isAtTop} = useScroll();
const { t, locale, availableLocales } = useI18n();
const router = useRouter();
const route = useRoute();
const chatStore = useChatStore();
const languageStore = useLanguageStore();
const naviStore = useNaviStore();

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

// menu
const msgMenu = ref();
let selectedMsg = ref();
const openMsgMenu = (msg, event) => {
    selectedMsg.value = msg;
    msgMenu.value.toggle(event);
}
const menuItem = ref([{
    label: t('common.optimize'),
    icon: 'pi pi-pencil',
},{
    label: 'Navi',
    icon: 'pi pi-sparkles',
    command: () => {
        naviStore.open({
            quote: selectedMsg.value.content,
            type: 2
        });
        msgMenu.value.toggle();
    }
},{
    label: t('bookmark.addToBookmark'),
    icon: 'pi pi-bookmark',
}])
const imageMsgMenu = ref(null);
const imageMenuItem = ref([{
    label: t('chat.getOriginalImage'),
    icon: 'pi pi-image'
}])
const openImageMenu = (event) => {
    imageMsgMenu.value.toggle(event);
}

// image
const imageUploader = ref(null);
let images = ref([]);
let imageSrc = ref([]); //used for preview
const addImage = () => {
    imageUploader.value.toggle();
    tools.value = false;
}
const sendImage = () => {
    imageUploader.value.toggle();
    if(images.value.length === 0) return;
    let formData = new FormData();
    formData.append('file', images.value[0]);
    formData.append('type', 2);
    formData.append('receiverId', receiver.value);
    chatStore.sending = true;
    apiSendFile(formData).then(() => {
        images.value.splice(0, images.value.length);
        imageSrc.value.splice(0, images.value.length);
    }).catch(() => {}).finally(() => {
        chatStore.sending = false;
    })
}

// voice
const voiceRecorder = ref(null);
const addVoice = () => {
    voiceRecorder.value.toggle();
    tools.value = false;
}
const voice = ref(null);
const voiceUrl = ref('');
const sendVoice = () => {
    voiceRecorder.value.toggle();
    if(!voiceUrl.value) return;
    let formData = new FormData();
    formData.append('file', voice.value);
    formData.append('type', 3);
    formData.append('receiverId', receiver.value);
    chatStore.sending = true;
    apiSendFile(formData).then(() => {
        voice.value = undefined;
        voiceUrl.value = '';
    }).catch(() => {}).finally(() => {
        chatStore.sending = false;
    })
}

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
//TODO bug fix for new message reminder
//TODO update lastId for Conversation to sorting
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
onBeforeUnmount(() => {
    chatStore.clearUnread(receiver.value);
})

// onBeforeRouteUpdate(async (to, from) => {
//     console.log(to, from);
// })

</script>

<style scoped>

</style>
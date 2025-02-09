<template>
    <div class="w-full">
        <EHeader class='sticky top-0 z-10 transition-opacity transform-gpu hover:!opacity-100' :enable-slot="true" >
            <div class="flex items-center w-fit cursor-pointer hover:underline"
                 @click="router.push({ name: 'User', params: { id: receiver } })">
                <div class="h-10 w-10 mr-4 flex-shrink-0">
                    <img :src="receiverInfo.avatar" class="object-cover rounded-full" alt="avatar"/>
                </div>
                <div class="overflow-hidden text-ellipsis">{{receiverInfo.nickname}}</div>
            </div>
        </EHeader>
        
<!--        MsgList -->
        <div class="flex flex-col gap-3 px-3 my-3 min-h-[calc(100vh-8.5rem)]">
            <ELoadMore :loading="loadingMore" @click="loadMoreOldMsg" />
            <div v-for="(item, index) in msgs" class="">
                <div class="flex justify-center" v-if="index === 0 || msgs[index].date !== msgs[index - 1].date">
                    <div class="text-sm w-fit bg-slate-100 text-slate-600 py-1 px-2 mb-3 rounded-full">
                        {{item.date}}
                    </div>
                </div>
                <div v-if="meId === item.senderId" class="w-full pl-8">
                    <div v-if="item.type === 1" class="w-fit max-w-[28rem] overflow-hidden text-ellipsis p-3 border border-primary bg-primary whitespace-pre-line
                    hover:bg-primary-emphasis text-white rounded-2xl float-right select-text transition-colors" @click="openMsgMenu(item)">
                        {{item.content}}
                        <div class="text-xs inline-block translate-y-1/2 float-right">&nbsp;{{item.time.substring(0, 5)}}</div>
                    </div>
                    <div v-else-if="item.type === 2" class="w-fit float-right max-w-[28rem] min-w-24 relative h-36 rounded-2xl overflow-hidden border" @click="openMsgMenu(item)" >
                        <img class="h-full w-full object-cover" :src="item.content" alt="image"/>
                        <div class="absolute text-xs inline-block bottom-2 right-2 bg-slate-700/30 text-slate-100 px-1 rounded-full">
                            {{item.time.substring(0, 5)}}
                        </div>
                    </div>
                    <div v-else-if="item.type === 3" class="w-fit max-w-[28rem] overflow-hidden text-ellipsis p-3 border border-primary bg-primary
                    hover:bg-primary-emphasis text-white rounded-2xl float-right select-text transition-colors" @click="openMsgMenu(item)">
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
        <div class="sticky bottom-14 md:bottom-0 flex flex-col bg-blur p-2 border-t transition-all transform-gpu"
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
                <Button :disabled="chatStore.sending" v-if="!msgContent" @click="tools = !tools" :icon="'pi ' + (tools? 'pi-minus': 'pi-plus')"
                        rounded severity="secondary" pt:root:class="!h-10 !w-10 !py-0 !flex-shrink-0"/>
                <Button :disabled="chatStore.sending" v-if="!msgContent && tools" @click="addImage" icon="pi pi-image"
                        rounded severity="secondary" pt:root:class="!h-10 !w-10 !py-0 !flex-shrink-0"/>
                <Button :disabled="chatStore.sending" v-if="!msgContent && tools" @click="addVoice" icon="pi pi-microphone"
                        rounded severity="secondary" pt:root:class="!h-10 !w-10 !py-0 !flex-shrink-0"/>
                <textarea :disabled="chatStore.sending" @keydown.shift.enter="sendTextMsg"
                          @input="changeTextareaHeight" v-model="msgContent" ref="textArea"
                          class="h-10 outline-none text-base py-2 px-4 rounded-[1.25rem] ring-1 resize-none w-0
                          ring-slate-300 bg-slate-100/60 flex-1 caret-primary-emphasis"
                          :placeholder="chatStore.sending? t('chat.sending'): t('chat.message')"></textarea>
                <Button :disabled="!msgContent || chatStore.sending" icon="pi pi-send" rounded
                        pt:root:class="!h-10 !w-10 !py-0 !flex-shrink-0" @click="sendTextMsg"/>
            </div>
        </div>
        
        <ImageUploader ref="imageUploader" :enable-send="true" :limit="1" v-model:images="images" v-model:imageSrc="imageSrc" @send="sendImage" />
        <VoiceRecorder ref="voiceRecorder" :enable-send="true" v-model:value="voice" v-model:url="voiceUrl" @send="sendVoice" />
        
        <Drawer v-model:visible="bookmarkData.visible" position="bottom" :header="t('post.bookmark')"
                class="!rounded-t-2xl !z-20 !h-auto !max-h-[90dvh] !max-w-[35rem]">
            <div class="flex flex-col gap-4">
                <EListItem enable-slot rounded>
                    {{ bookmarkData.content }}
                </EListItem>
                <EList :title="t('bookmark.note')" icon="pi pi-pencil">
                    <EListItem enable-slot>
                        <ETextarea v-model="bookmarkData.note" />
                    </EListItem>
                </EList>
                <div class="flex *:flex-1 gap-4 sticky bottom-0 drop-shadow-2xl">
                    <Button :label="t('navi.ok')" @click="doBookmark" :loading="bookmarkData.loading" icon="pi pi-check" class="!rounded-xl" />
                </div>
            </div>
        </Drawer>
        
        <Drawer v-model:visible="msgMenuVisible" position="bottom" :header="t('chat.menu')"
                class="!rounded-t-2xl !z-20 !h-auto !max-h-[90dvh] !max-w-[35rem]">
            <div class="flex flex-col gap-4">
                <EList>
                    <EListItem v-for="item in msgMenuItem[selectedMsg.type]" :icon="item.icon" :title="item.label" @click="item.command" />
                </EList>
                <div class="flex *:flex-1 gap-4 sticky bottom-0 drop-shadow-2xl">
                    <Button :label="t('chat.times')" severity="secondary" @click="msgMenuVisible = false" icon="pi pi-check" class="!rounded-xl" />
                </div>
            </div>
        </Drawer>
    </div>
</template>

<script setup>
import EHeader from "@/components/etsuya/EHeader.vue";
import Button from 'primevue/button';
import {useScroll} from "@/utils/scroll.js";
import {useI18n} from "vue-i18n";
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import {useRoute, useRouter} from "vue-router";
import {useChatStore} from "@/stores/chatStore.js";
import {apiGetUser} from "@/api/user.js";
import ETransition from "@/components/etsuya/ETransition.vue";
import Popover from 'primevue/popover';
import Menu from 'primevue/menu';
import {useLanguageStore} from "@/stores/languageStore.js";
import {useNaviStore} from "@/stores/naviStore.js";
import ImageUploader from "@/components/natively/ImageUploader.vue";
import {apiSendFile} from "@/api/chat.js";
import VoiceRecorder from "@/components/natively/VoiceRecorder.vue";
import ETextarea from "@/components/etsuya/ETextarea.vue";
import EList from "@/components/etsuya/EList.vue";
import EListItem from "@/components/etsuya/EListItem.vue";
import Drawer from "primevue/drawer";
import {apiCreateBookmark} from "@/api/postV2.js";
import ELoadMore from "@/components/etsuya/ELoadMore.vue";
import {useSelect} from "@/utils/selection.js";

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
    nextTick(() => {
        changeTextareaHeight();
    })
}
let loadingMore = ref(false);
const doLoadMore = async () => {
    loadingMore.value = true;
    try {
        await chatStore.loadMoreOldMessage(receiver.value);
    } catch (e) {} finally {
        loadingMore.value = false;
    }
}
const loadMoreOldMsg = async () => {
    if(loadingMore.value === false){
        let heightToBottom = document.documentElement.scrollHeight;
        await doLoadMore();
        await nextTick(() => {
            let scrollYPos = document.documentElement.scrollHeight - heightToBottom;
            console.log(heightToBottom, document.documentElement.scrollHeight, scrollYPos);
            window.scrollTo(0, scrollYPos);
        })
    }
}

// tools
let tools = ref(false);

// menu2
const { selected } = useSelect();
const msgMenuVisible = ref(false);
const msgMenuItem = ref({
    '1': [
        {
            label: t('chat.copy'),
            icon: 'pi pi-copy',
            command: () => {
                navigator.clipboard.writeText(selectedMsg.value.content);
                msgMenuVisible.value = false;
            }
        },
        {
            label: 'Navi',
            icon: 'pi pi-sparkles',
            command: () => {
                naviStore.launch(selectedMsg.value.content);
                msgMenuVisible.value = false;
            }
        },{
            label: t('bookmark.addToBookmark'),
            icon: 'pi pi-bookmark',
            command: () => {
                bookmarkData.value.visible = true;
                bookmarkData.value.content = selectedMsg.value.content;
                msgMenuVisible.value = false;
            }
        }
    ],
    "2": [
        {
            label: t('chat.getOriginalImage'),
            icon: 'pi pi-image',
        }
    ]
})
let selectedMsg = ref();
const openMsgMenu = (msg) => {
    if(selected.value){
        return;
    }
    selectedMsg.value = msg;
    msgMenuVisible.value = true;
}
const bookmarkData = ref({
    visible: false,
    note: '',
    content: '',
    loading: false
})
const doBookmark = () => {
    bookmarkData.value.loading = true;
    apiCreateBookmark(0, null, bookmarkData.value.content, bookmarkData.value.note).then(res => {
        bookmarkData.value.visible = false;
    }).catch((err) => {}).finally(() => {
        bookmarkData.value.loading = false;
    })
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
const textArea = ref(null);
const changeTextareaHeight = () => {
    textArea.value.style.height = '1px';
    let height = textArea.value.scrollHeight;
    height = Math.min(height, textAreaMaxHeight);
    textArea.value.style.height = Math.max(height, textAreaMinHeight) + 'px';
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

// lifespan
onMounted(async () => {
    loadingMore.value = true;
    // get receiver info and msg
    try {
        receiver.value = route.params.id;
        receiverInfo.value = await chatStore.getUserInfo(receiver.value);
        if(chatStore.getMessageList(receiver.value)){
            await chatStore.loadMoreOldMessage(receiver.value);
        }
        msgs.value = chatStore.msgMap.get(receiver.value);
        const latestMsg = msgs.value[msgs.value.length - 1];
        latestMsgId = latestMsg? latestMsg.id: 0;
    } catch (e){
        console.log(e);
    } finally {
        loadingMore.value = false;
    }
    nextTick(() => goBottom());
})
onBeforeUnmount(() => {
    chatStore.clearUnread(receiver.value);
})

</script>

<style scoped>

</style>
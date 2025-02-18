<template>
    <div class="flex justify-center">
        <div class="flex w-full max-w-screen-xl justify-center">
        
<!--            Navigation-->
            <div class="fixed left-0 right-0 bottom-0 flex justify-evenly p-1 border-t border-surface z-50 bg-blur h-14
            transition-opacity transform-gpu
            md:sticky md:top-0 md:right-auto md:flex-col md:justify-normal md:border-t-0 md:border-r md:p-4 md:gap-2
            md:h-dvh md:w-fit"
                 :class="{ 'max-sm:opacity-30': isScrollDown && route.meta.navTransparent }" >
                <div class="px-4 py-2 hidden md:block" >
                    <Logo position="center" />
                </div>
                <div v-for="(item, index) in menuItem" :key="item.name">
                    <div v-if="index === 3" class="p-2 flex items-center hover:bg-surface-100
                        rounded-full cursor-pointer transition-colors
                        md:px-4 md:py-2
                        hover:dark:bg-surface-800" @mousedown.stop.prevent="naviStore.launch(null, null)">
                        <Button unstyled :label="item.name" :icon="item.icon"
                                pt:root:class="flex items-center"
                                pt:label:class="text-xl ml-4 hidden md:block whitespace-nowrap"
                                :pt:icon:class="selected && !naviStore.visible? '!text-2xl w-8 animate-ping': '!text-2xl w-8'" />
                    </div>
                    <div v-else class="p-2 flex items-center hover:bg-surface-100
                        rounded-full cursor-pointer transition-colors
                        md:px-4 md:py-2
                        hover:dark:bg-surface-800"
                                @click="router.push(item.to)"
                    >
                        <Button v-if="item.value === route.meta.tab" unstyled :label="item.name" :icon="item.icon"
                                pt:root:class="flex items-center"
                                pt:label:class="text-xl ml-4 hidden md:block !font-bold whitespace-nowrap"
                                pt:icon:class="!text-2xl w-8 !font-bold" />
                        <Button v-else unstyled :label="item.name" :icon="item.icon"
                                pt:root:class="flex items-center"
                                pt:label:class="text-xl ml-4 hidden md:block whitespace-nowrap"
                                pt:icon:class="!text-2xl w-8" />
                    </div>
                </div>
            </div>
            
<!--            Router-->
            <div class="w-full lg:max-w-[40rem]" v-if="loggedIn">
                <div class="w-full">
                    <router-view v-slot="{ Component, route }">
                        <keep-alive :include="pageStore.cachedComponentArray">
                            <component
                                    :is="Component"
                                    :key="route.meta.keepAliveKey || route.fullPath"
                            />
                        </keep-alive>
                    </router-view>
                </div>
                <div class="h-14 md:hidden" :class="{ '!hidden': !route.meta.nav }"></div>
            </div>
            
<!--            Sidebar-->
            <div class="hidden p-4 border-surface w-[20rem] flex-shrink-0
                        lg:block md:sticky md:h-dvh md:top-0 md:border-l">
                <EListItem enable-slot rounded class="!p-0 overflow-hidden" :interactive="false">
                    <div class="w-72 h-72 relative">
                        <img :src="userStore.userInfo.avatar" class="h-full w-full object-cover" alt="avatar"/>
                        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-surface-100 dark:to-surface-800"></div>
                        <div class="absolute bottom-0 p-4 font-bold">
                            {{ t('base.welcome', { nickname: userStore.userInfo.nickname }) }}
                        </div>
                    </div>
                </EListItem>
                <EListItem enable-slot rounded :interactive="false" class="mt-2">
                    <div class="text-xl font-bold">
                        {{ formattedTime }}
                    </div>
                </EListItem>
            </div>
            
<!--            Navi-->
            <Navi />
        </div>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import {computed, onBeforeMount, onMounted, ref, watch} from 'vue';
import Logo from "@/components/natively/Logo.vue";
import Button from 'primevue/button';
import {useScroll} from "@/utils/scroll.js";
import ETransition from "@/components/etsuya/ETransition.vue";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {useNaviStore} from "@/stores/naviStore.js";
import {useSelect} from "@/utils/selection.js";
import {useUserStore} from "@/stores/userStore.js";
import Navi from "@/components/natively/Navi.vue";
import {useChatStore} from "@/stores/chatStore.js";
import {usePageStore} from "@/stores/pageStore.js";
import ProgressBar from "primevue/progressbar";
import LoadingNotification from "@/components/natively/LoadingNotification.vue";
import {useWsStore} from "@/stores/wsStore.js";
import {apiGetCurrent} from "@/api/user.js";
import {toast} from "vue3-toastify";
import EListItem from "@/components/etsuya/EListItem.vue";
import { useRealtimeTime } from "@/utils/reatimeTime.js";

const { t, locale, availableLocales } = useI18n();
const route = useRoute();
const {selected} = useSelect();
const userStore = useUserStore();
const chatStore = useChatStore();
const wsStore = useWsStore();
const {isScrollDown} = useScroll();
const pageStore = usePageStore();
const router = useRouter();

// login
const loggedIn = ref(false);

// time
const { localizedDate, formattedTime } = useRealtimeTime();

// connect
const reconnectToastId = 'reconnect';
const reconnectNotificationOptions = {
    toastId: reconnectToastId,
    autoClose: false,
    expandCustomProps: true,
    type: toast.TYPE.INFO,
    contentProps: {
        title: t('common.connectingNatively'),
        loading: true
    },
    hideProgressBar: true,
    closeButton: false,
    closeOnClick: false
};
const connectionNotificationWatch = (newVal, oldValue) => {
    if (!newVal) {
        if (toast.isActive(reconnectToastId)) {
            toast.update(reconnectToastId, reconnectNotificationOptions);
        } else {
            toast(LoadingNotification, reconnectNotificationOptions);
        }
    } else {
        toast.update(reconnectToastId, {
            toastId: reconnectToastId,
            autoClose: 3000,
            expandCustomProps: true,
            type: toast.TYPE.SUCCESS,
            contentProps: {
                title: t('common.connectNativelySuccess'),
                loading: false
            },
            hideProgressBar: false,
        })
    }
}
watch(() => wsStore.connected, connectionNotificationWatch);

// navi
const naviStore = useNaviStore();

// tab
let menuItem = ref([
    { name: t('common.home'), icon: 'pi pi-home', to: { name: 'Home'}, value: 'Home'},
    { name: t('common.search'), icon: 'pi pi-search', to: { name: 'Search'}, value: 'Search'},
    { name: t('common.chat'), icon: 'pi pi-envelope', to: { name: 'ChatList'}, value: 'Chat'},
    { name: 'Navi', icon: 'pi pi-sparkles'},
    { name: t('common.bookmark'), icon: 'pi pi-bookmark', to: { name: 'Bookmark'}, value: 'Bookmark'},
    { name: t('common.me'), icon: 'pi pi-user', to: { name: 'More' }, value: 'More' }
]);

onBeforeMount(async () => {
    const accessToken = localStorage.getItem('accessToken');
    if(!accessToken){
        await router.push({ name: 'Welcome' });
        return;
    }
    try {
        await userStore.update();
    } catch (e){
        const title = t('user.loginSessionExpired');
        toast.warn(title);
        await router.push({ name: 'Welcome' });
        return;
    }
    loggedIn.value = true;
    wsStore.connect();
    chatStore.init();
    naviStore.init();
})

onMounted(() => {
    setTimeout(() => {
        if(wsStore.connected === false){
            if(route.matched && route.matched[0].name === 'Base'){
                connectionNotificationWatch(false, true);
            }
        }
    }, 5000);
});

</script>

<style scoped>

</style>
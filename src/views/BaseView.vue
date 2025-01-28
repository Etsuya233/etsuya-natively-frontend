<template>
    <div class="flex justify-center">
        <div class="flex w-full max-w-screen-xl">
        
<!--            Navigation-->
            <div class="fixed left-0 right-0 bottom-0 flex justify-evenly p-1 border-t border-surface max-md:bg-white/80 z-10
            backdrop-blur-xl h-14 transition-opacity transform-gpu
            md:sticky md:top-0 md:right-auto md:flex-col md:justify-normal md:border-t-0 md:border-r md:p-4 md:gap-2
            md:h-dvh md:w-fit
            max-md:dark:bg-surface-900/70 max-md:dark:opacity-80" :class="{ 'max-sm:opacity-30': isScrollDown && route.meta.navTransparent }" >
<!--                , 'max-md:!hidden': !route.meta.nav }-->
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
                    <RouterLink v-else :to="item.to" class="p-2 flex items-center hover:bg-surface-100
                        rounded-full cursor-pointer transition-colors
                        md:px-4 md:py-2
                        hover:dark:bg-surface-800"
                        v-slot="{isActive}"
                    >
                        <Button v-if="isActive" unstyled :label="item.name" :icon="item.icon"
                                pt:root:class="flex items-center"
                                pt:label:class="text-xl ml-4 hidden md:block !font-bold whitespace-nowrap"
                                pt:icon:class="!text-2xl w-8 !font-bold" />
                        <Button v-else unstyled :label="item.name" :icon="item.icon"
                                pt:root:class="flex items-center"
                                pt:label:class="text-xl ml-4 hidden md:block whitespace-nowrap"
                                pt:icon:class="!text-2xl w-8" />
                    </RouterLink>
                </div>
            </div>
            
<!--            Router-->
            <div class="w-full">
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
            <div class="hidden p-4 border-surface
                        lg:block md:sticky md:h-dvh md:top-0 md:border-l md:max-w-sm">
                <Card class="w-full">
                    <template #title>Simple Card</template>
                    <template #content>
                        <p class="m-0" id="aside">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                            quas!
                        </p>
                    </template>
                </Card>
            </div>
            
<!--            Navi-->
            <Navi />
            
<!--            Emergency-->
            <ETransition name="slide-down">
                <div v-if="!chatStore.connected" class="fixed bottom-0 left-0 right-0 z-[100] flex justify-center">
                    <ProgressBar mode="indeterminate" class="!h-2 w-full max-w-screen-sm" />
                </div>
            </ETransition>
        </div>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import {computed, ref, watch} from 'vue';
import Logo from "@/components/natively/Logo.vue";
import Button from 'primevue/button';
import {useScroll} from "@/utils/scroll.js";
import ETransition from "@/components/etsuya/ETransition.vue";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {useNaviStore} from "@/stores/naviStore.js";
import {useSelect} from "@/utils/selection.js";
import {useUserStore} from "@/stores/userStore.js";
import Navi from "@/components/natively/Navi.vue";
import {useChatStore} from "@/stores/chatStore.js";
import {usePageStore} from "@/stores/pageStore.js";
import ProgressBar from "primevue/progressbar";

const { t, locale, availableLocales } = useI18n();
const route = useRoute();
const {selected} = useSelect();
const userStore = useUserStore();
const chatStore = useChatStore();
const pageStore = usePageStore();

// navi
const naviStore = useNaviStore();

const {isScrollDown} = useScroll();

let menuItem = ref([
    { name: t('common.home'), icon: 'pi pi-home', to: { name: 'Home'}},
    { name: t('common.search'), icon: 'pi pi-search', to: { name: 'Search'}},
    { name: t('common.chat'), icon: 'pi pi-envelope', to: { name: 'ChatList'}},
    { name: 'Navi', icon: 'pi pi-sparkles'},
    { name: t('common.bookmark'), icon: 'pi pi-bookmark', to: { name: 'Bookmark'}},
    { name: t('common.me'), icon: 'pi pi-user', to: { name: 'More' }}
])

</script>

<style scoped>

</style>
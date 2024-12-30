<template>
    <div class="flex justify-center">
        <div class="flex w-full max-w-screen-xl">
        
<!--            Navigation-->
            <div class="fixed left-0 right-0 bottom-0 flex justify-evenly p-1 border-t border-surface bg-white/80 z-10
            backdrop-blur-xl h-14 transition-opacity transform-gpu
            md:sticky md:top-0 md:right-auto md:flex-col md:justify-normal md:border-t-0 md:border-r md:p-4 md:gap-2
            md:h-dvh md:w-fit
            dark:bg-surface-900/70" :class="{ 'max-sm:opacity-30': isScrollDown && route.meta.navTransparent }" >
<!--                , 'max-md:!hidden': !route.meta.nav }-->
                <div class="px-4 py-2 hidden md:block" >
                    <Logo position="center" />
                </div>
                <div v-for="(item, index) in menuItem" :key="item.name">
                    <div v-if="index === 3" class="p-2 flex items-center hover:bg-surface-100
                        rounded-full cursor-pointer transition-colors
                        md:px-4 md:py-2
                        hover:dark:bg-surface-800" @click="naviStore.open({ type: 0 })">
                        <Button unstyled :label="item.name" :icon="item.icon"
                                pt:root:class="flex items-center"
                                pt:label:class="text-xl ml-4 hidden md:block whitespace-nowrap"
                                :pt:icon:class="selected && !naviStore.showing? '!text-2xl w-8 animate-ping': '!text-2xl w-8'" />
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
                    <RouterView class="w-full" v-slot="{Component}" :key="route.path" >
                        <ETransition name="fade">
                            <component :is="Component" />
                        </ETransition>
                    </RouterView>
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
            <Drawer v-model:visible="naviStore.showing" position="bottom" class="!rounded-t-2xl !z-20 !h-auto
                    !max-h-[90dvh] !max-w-[35rem]" header="Navi">
                <template #header>
                    <div class="flex items-center text-2xl font-bold">
                        <div class="pi pi-sparkles !text-xl pr-3"></div><div>Navi</div>
                    </div>
                </template>
                <div class="w-full flex flex-col gap-4 selection:bg-primary-100 selection:text-primary-600 dark:selection:bg-primary-800">
                    <div class="w-full flex flex-col gap-2" v-if="naviStore.type === 2">
                        <div class="text-xl font-bold pl-2"> <span class="pi pi-align-left"></span>&nbsp; {{t('navi.quote')}}</div>
                        <div class="bg-slate-100 p-4 rounded-2xl" @click="naviQuoteLineClamp = !naviQuoteLineClamp">
                            <div class="overflow-hidden text-ellipsis whitespace-break-spaces  text-slate-800 select-text" :class="{ 'line-clamp-4': naviQuoteLineClamp }">
                                {{naviStore.quote}}
                            </div>
                        </div>
                    </div>
                    
                    <ETransition>
                        <div v-if="naviStore.page === 1">
                            <div class="w-full flex flex-col gap-2">
                                <div class="text-xl font-bold pl-2"> <span class="pi pi-sliders-h"></span>&nbsp; {{t('navi.ability')}}</div>
                                <div class="bg-slate-100 rounded-2xl divide-y overflow-hidden
                                *:flex *:items-center *:py-3 *:px-4 hover:*:bg-slate-200 *:transition-colors *:transform-gpu *:text-slate-800">
                                    <div @click="naviStore.operate(1)">
                                        <div class="pi pi-comment !text-xl pr-3"></div><div>{{t('navi.ask')}}</div>
                                    </div>
                                    <div @click="naviStore.operate(2)">
                                        <div class="pi pi-language !text-xl pr-3"></div><div>{{t('navi.translate')}}</div>
                                    </div>
                                    <div @click="naviStore.operate(3)">
                                        <div class="pi pi-lightbulb !text-xl pr-3"></div><div>{{t('navi.explain')}}</div>
                                    </div>
                                    <div @click="naviStore.operate(4)">
                                        <div class="pi pi-volume-up !text-xl pr-3"></div><div>{{t('navi.pronounce')}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        
                        <div v-else-if="naviStore.page === 2" class="*:w-full *:flex *:flex-col *:gap-4">
                            <div class="w-full flex flex-col gap-2">
                                <div v-if="naviStore.mode === 1" class="text-xl font-bold pl-2"> <span class="pi pi-pencil"></span>&nbsp; {{t('navi.question')}}</div>
                                <div v-else-if="naviStore.mode === 2" class="text-xl font-bold pl-2"> <span class="pi pi-pencil"></span>&nbsp; {{t('navi.originalText')}}</div>
                                <div v-else-if="naviStore.mode === 3" class="text-xl font-bold pl-2"> <span class="pi pi-pencil"></span>&nbsp; {{t('navi.originalText')}}</div>
                                <textarea class="w-full text-base resize-none bg-slate-100 p-4 h-14 outline-none rounded-2xl"
                                          v-model="naviStore.question" @input="textareaKeyDown" :placeholder="t('navi.enterHere')"></textarea>
                            </div>
                        </div>
                        
                        <div v-else class="w-full flex flex-col gap-4">
                            <div class="w-full flex flex-col gap-2" v-if="naviStore.mode === 1">
                                <div class="text-xl font-bold pl-2"> <span class="pi pi-question"></span>&nbsp; {{t('navi.question')}}</div>
                                <div class="bg-slate-100 p-4 rounded-2xl" @click="naviQuestionLineClamp = !naviQuestionLineClamp">
                                    <div class="overflow-hidden text-ellipsis  text-slate-800 select-text" :class="{ 'line-clamp-4': naviQuestionLineClamp }">
                                        {{naviStore.question}}
                                    </div>
                                </div>
                            </div>
                            <div class="w-full flex flex-col gap-2">
                                <div v-if="naviStore.mode === 1" class="text-xl font-bold pl-2"> <span class="pi pi-comment"></span>&nbsp; {{t('common.answer')}}</div>
                                <div v-else-if="naviStore.mode === 2" class="text-xl font-bold pl-2"> <span class="pi pi-language"></span>&nbsp; {{t('common.translation')}}</div>
                                <div v-else-if="naviStore.mode === 3" class="text-xl font-bold pl-2"> <span class="pi pi-comment"></span>&nbsp; {{t('common.explanation')}}</div>
                                <div v-if="naviStore.mode !== 4" class="bg-slate-100 p-4 rounded-2xl text-slate-800 select-text">
                                    <div v-if="naviStore.loading" class="flex flex-col gap-1">
                                        <Skeleton class="h-4" />
                                        <Skeleton class="h-4" />
                                        <Skeleton class="h-4" />
                                        <Skeleton class="h-4 !w-3/5" />
                                    </div>
                                    <div v-else>
                                        <div v-if="naviStore.mode !== 2">
                                            <md-render :markdown="naviStore.answer" />
                                        </div>
                                        <div v-else class="whitespace-break-spaces">
                                            {{naviStore.answer}}
                                        </div>
                                    </div>
                                </div>
                                <div v-else >
                                    <div v-if="naviStore.loading" class="flex justify-center items-center">
                                        <ProgressSpinner />
                                    </div>
                                    <div v-else>
                                        <audio ref="naviPronounce" controls />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ETransition>
                    
                    <div class="w-full flex justify-evenly *:drop-shadow-2xl *:flex-1 gap-4 *:!rounded-2xl *:!p-3 sticky bottom-0">
                        <Button v-if="naviStore.page === 1" @click="naviStore.showing = false" :label="t('common.close')" icon="pi pi-times" severity="secondary" />
                        <Button v-if="naviStore.page >= 2" @click="naviStore.goBack()" :label="t('common.back')" icon="pi pi-arrow-left" severity="secondary" />
                        <Button v-if="naviStore.mode === 1 && naviStore.page === 2" @click="naviStore.goNext()" :label="t('navi.ask')" icon="pi pi-sparkles" iconPos="right" />
                        <Button v-else-if="naviStore.mode === 2 && naviStore.page === 2" @click="naviStore.goNext()" :label="t('navi.ask')" icon="pi pi-sparkles" iconPos="right" />
                        <Button v-else-if="naviStore.mode === 3 && naviStore.page === 2" @click="naviStore.goNext()" :label="t('navi.ask')" icon="pi pi-sparkles" iconPos="right" />
                        <Button v-else-if="naviStore.mode === 4 && naviStore.page === 2" @click="naviStore.goNext()" :label="t('navi.ask')" icon="pi pi-sparkles" iconPos="right" />
                        <Button v-if="naviStore.page === 3" :disabled="naviStore.loading" @click="naviStore.goNext()" :label="t('navi.retry')" icon="pi pi-replay" severity="info" />
                    </div>
                </div>
            </Drawer>
        </div>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import Logo from "@/components/logo/Logo.vue";
import Button from 'primevue/button';
import {useScroll} from "@/utils/scroll.js";
import EFade from "@/components/ETransition.vue";
import ETransition from "@/components/ETransition.vue";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {useNaviStore} from "@/stores/naviStore.js";
import MdRender from "@/components/logo/MdRender.vue";
import Drawer from "primevue/drawer";
import Skeleton from "primevue/skeleton";
import {useSelect} from "@/utils/selection.js";
import ProgressSpinner from 'primevue/progressspinner';
import {useUserStore} from "@/stores/userStore.js";

const { t, locale, availableLocales } = useI18n();
const route = useRoute();
const {selected} = useSelect();
const userStore = useUserStore();


// ---- navi ----
const naviStore = useNaviStore();
const naviQuoteLineClamp = ref(true);
const naviQuestionLineClamp = ref(true);
const naviPronounce = ref();
watch(() => naviStore.audioUrl ,(newVal, oldVal) => {
    nextTick(() => {
        naviPronounce.value.src = newVal;
        naviPronounce.value.play();
    })
})

// ---- ui ----
const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize); //TODO repeat code
const textAreaMinHeight = 1.5 * rootFontSize;
const textareaKeyDown = (e) => {
    e.target.style.height = '1px';
    let height = e.target.scrollHeight;
    e.target.style.height = Math.max(height, textAreaMinHeight) + 'px';
}

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
<template>
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
</template>

<script setup>

import MdRender from "@/components/logo/MdRender.vue";
import ProgressSpinner from "primevue/progressspinner";
import ETransition from "@/components/ETransition.vue";
import Drawer from "primevue/drawer";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";
import {useNaviStore} from "@/stores/naviStoreV1.js";

const naviStore = useNaviStore();
</script>

<style scoped>

</style>
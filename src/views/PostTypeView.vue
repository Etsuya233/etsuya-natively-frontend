<template>
    <div class="w-full">
        <EHeader class="sticky top-0 z-10" :title="t('common.type')" />
        <div class="w-full flex flex-col gap-4 p-4">
            <div class="text-3xl font-bold">{{t('post.selectType')}}</div>
            <ESelectList>
                <ESelectItem :enable-slot="true">
                    <RouterLink :to="{ name: 'ComposeNormal' }">
                        <div class="flex">
                            <div class="pi pi-comment !text-3xl my-auto"></div>
                            <div class="pl-4">
                                <div class="font-bold text-lg">{{t('post.normal')}}</div>
                                <div class="text-slate-700">{{t('post.normalDesc')}}</div>
                            </div>
                        </div>
                    </RouterLink>
                </ESelectItem>
                <ESelectItem>
                    <RouterLink :to="{ name: 'ComposeQuestion' }">
                        <div class="flex">
                            <div class="pi pi-question !text-3xl my-auto"></div>
                            <div class="pl-4">
                                <div class="font-bold text-lg">{{t('post.question')}}</div>
                                <div class="text-slate-700">{{t('post.questionDesc')}}</div>
                            </div>
                        </div>
                    </RouterLink>
                </ESelectItem>
                <ESelectItem>
                    <RouterLink :to="{ name: 'ComposeArticle'}">
                        <div class="flex">
                            <div class="pi pi-book !text-3xl my-auto"></div>
                            <div class="pl-4">
                                <div class="font-bold text-lg">{{t('post.article')}}</div>
                                <div class="text-slate-700">{{t('post.articleDesc')}}</div>
                            </div>
                        </div>
                    </RouterLink>
                </ESelectItem>
            </ESelectList>
        </div>
    </div>
</template>

<script setup>
import EHeader from "@/components/logo/EHeader.vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import ESelectList from "@/components/ESelectList.vue";
import ESelectItem from "@/components/ESelectItem.vue";

const router = useRouter();
const route = useRoute();
const { t, locale, availableLocales } = useI18n();
</script>

<style scoped>

</style>
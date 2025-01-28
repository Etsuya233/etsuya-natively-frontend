<template>
    <div class="w-full">
        <EHeader class="sticky top-0 z-10" :title="t('common.type')" />
        <div class="w-full">
            <ETransition>
                <div v-if="page === 1" class="w-full flex flex-col gap-4 p-4">
                    <div class="text-3xl font-bold">{{t('post.containLanguages')}}</div>
                    <EList>
                        <EListItem v-for="(item, index) in languages"
                                     :title="languageStore.getLanguageName(item.language)"
                                     :selected="item.selected"
                                     @click="languageClicked(index)" />
                    </EList>
                    <Button class="!rounded-xl" :disabled="selectedLanguageCode.length === 0" :label="t('post.next')" icon="pi pi-arrow-right" @click="goNext" />
                </div>
                <div v-else class="w-full flex flex-col gap-4 p-4">
                    <div class="text-3xl font-bold">{{t('post.selectType')}}</div>
                    <EList>
                        <EListItem :enable-slot="true">
                            <RouterLink :to="{ name: 'ComposeNormal', query: { type: 1, language: selectedLanguageCode } }">
                                <div class="flex">
                                    <div class="pi pi-comment !text-3xl my-auto"></div>
                                    <div class="pl-4">
                                        <div class="font-bold text-lg">{{t('post.normal')}}</div>
                                        <div class="text-slate-700">{{t('post.normalDesc')}}</div>
                                    </div>
                                </div>
                            </RouterLink>
                        </EListItem>
                        <EListItem>
                            <RouterLink :to="{ name: 'ComposeNormal', query: { type: 2, language: selectedLanguageCode } }">
                                <div class="flex">
                                    <div class="pi pi-question !text-3xl my-auto"></div>
                                    <div class="pl-4">
                                        <div class="font-bold text-lg">{{t('post.question')}}</div>
                                        <div class="text-slate-700">{{t('post.questionDesc')}}</div>
                                    </div>
                                </div>
                            </RouterLink>
                        </EListItem>
                    </EList>
                    <Button class="!rounded-xl" :label="t('post.back')" icon="pi pi-arrow-left" @click="page = 1" />
                    <EList>
                        <EListItem :enable-slot="true">
                            <div>
                                <div class="font-bold">{{ t('post.selectedLanguage') }}</div>
                                <div class="mt-1">
                                    <Tag v-for="item in selectedLanguageText" :value="item" class="ml-2 first:ml-0" />
                                </div>
                            </div>
                        </EListItem>
                    </EList>
                </div>
            </ETransition>
        </div>
    </div>
</template>

<script setup>
import EHeader from "@/components/etsuya/EHeader.vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import EList from "@/components/etsuya/EList.vue";
import EListItem from "@/components/etsuya/EListItem.vue";
import {useUserStore} from "@/stores/userStore.js";
import {useLanguageStore} from "@/stores/languageStore.js";
import {computed, ref} from "vue";
import Button from 'primevue/button';
import ETransition from "@/components/etsuya/ETransition.vue";
import Chip from 'primevue/chip';
import Tag from 'primevue/tag';

const router = useRouter();
const route = useRoute();
const { t, locale, availableLocales } = useI18n();
const languageStore = useLanguageStore();

const userStore = useUserStore();
/**
 * [{language: code, proficiency}]
 * @type {Ref<UnwrapRef<*[]>, UnwrapRef<*[]> | *[]>}
 */
const languages = ref([... userStore.userInfo.languages]);
console.log(languages.value);
const languageClicked = (index) => {
    languages.value[index].selected = !languages.value[index].selected;
}
const selectedLanguageCode = computed(() => {
    const ret = [];
    languages.value.forEach((item) => {
        if (item.selected) {
            ret.push(item.language);
        }
    })
    return ret;
})
const selectedLanguageText = computed(() => {
    const ret = [];
    languages.value.forEach((item) => {
        if (item.selected) {
            ret.push(languageStore.getLanguageName(item.language));
        }
    })
    return ret;
})

const page = ref(1);
const goNext = () => {
    page.value = 2;
}

</script>

<style scoped>

</style>
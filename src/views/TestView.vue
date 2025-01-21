<template>
    <div class="w-full">
        <Button label="Navi" @click="naviStore.launch" />
        <Drawer v-model:visible="naviStore.visible" position="bottom" class="!rounded-t-2xl !z-20 !h-auto
                    !max-h-[90dvh] !max-w-[35rem]" header="Navi">
            <template #header>
                <div class="flex items-center text-2xl font-bold">
                    <div class="pi pi-sparkles !text-xl pr-3"></div><div>Navi</div>
                </div>
            </template>
            
            <div class="w-full *:flex *:flex-col gap-4 selection:bg-primary-100 selection:text-primary-600 dark:selection:bg-primary-800">
                <div v-if="naviStore.page === 1">
                    <EList icon="pi pi-sliders-h" :title="t('navi.ability')">
                        <EListItem icon="pi pi-comment" :title="t('navi.ask')" />
                        <EListItem icon="pi pi-language" :title="t('navi.translate')" @click="translate" />
                        <EListItem icon="pi pi-lightbulb" :title="t('navi.explain')" />
                        <EListItem icon="pi pi-volume-up" :title="t('navi.pronounce')" />
                    </EList>
                </div>
                <div v-if="mode === 'translate'">
                    <div v-if="naviStore.page !== 1" class="flex items-center gap-3">
                        <ESelect v-model="translateFrom" :data="availableLanguages" :title="t('navi.translateFrom')" display-field="name" value-field="code" />
                        <div class="pi pi-arrow-right-arrow-left !text-lg" />
                        <ESelect v-model="translateTo" :data="availableTranslateToLanguage" :title="t('navi.translateTo')" display-field="name" value-field="code" />
                    </div>
                    <div v-if="naviStore.page === 2">
                    
                    </div>
                </div>
            </div>
        </Drawer>
    </div>
</template>

<script setup>
import Drawer from "primevue/drawer";
import Button from "primevue/button";
import {useNaviStoreV2} from "@/stores/naviStoreV2.js";
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import EList from "@/components/EList.vue";
import EListItem from "@/components/EListItem.vue";
import {useLanguageStore} from "@/stores/languageStore.js";
import {getCurrentLanguage} from "@/utils/language.js";
import {cloneDeep} from "lodash";
import ESelect from "@/components/ESelect.vue";
const { t, locale, availableLocales } = useI18n();

const naviStore = useNaviStoreV2();

// mode
const mode = ref('');

// translation
const languageStore = useLanguageStore();
const availableLanguages = ref(cloneDeep(languageStore.languageData));
availableLanguages.value.splice(0, 0, { code: null, name: t('navi.autoDetect') });
const availableTranslateToLanguage = ref(cloneDeep(languageStore.languageData));
const currentLanguage = getCurrentLanguage();
const getLanguageName = (code) => {
    const ret = availableLanguages.value.find(item => item.code === code);
    return ret ? ret.name : '???';
}
const translateLoading = ref(true);
const translateFrom = ref(null);
const translateTo = ref(currentLanguage);
const translateFromSelectVisible = ref(false);
const translateToSelectVisible = ref(false);
const translateOriginal = ref('');
const translateResult = ref('');
const translate = (data) => {
    if(naviStore.page === 1){ // click from menu
        mode.value = 'translate';
        if(naviStore.quoteMode){
            
            naviStore.page = 3;
        } else {
            naviStore.page = 2;
        }
    } else if(naviStore.page === 2){ // after passing content
        if(data.content){
            naviStore.page = 3;
        }
    }
    if(naviStore.page === 3){ // sending request

    }
}

</script>

<style>

</style>
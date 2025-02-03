<template>
    <Drawer v-model:visible="naviStore.visible" position="bottom" class="!rounded-t-2xl !z-20 !h-auto
                !max-h-[90dvh] !max-w-[35rem]" header="Navi">
        <template #header>
            <div class="flex items-center text-2xl font-bold">
                <div class="pi pi-sparkles !text-xl pr-3"></div><div>Navi</div>
            </div>
        </template>
        
        <div class="w-full *:flex *:flex-col gap-4 selection:bg-primary-100 selection:text-primary-600 dark:selection:bg-primary-800">
            <div v-if="naviStore.page === 1" class="flex flex-col gap-4">
                <EList icon="pi pi-align-left" :title="t('navi.quote')" v-if="naviStore.quoteMode">
                    <EListItem enable-slot>
                        <div class="line-clamp-5">
                            {{ naviStore.quote }}
                        </div>
                    </EListItem>
                </EList>
                <EList icon="pi pi-sliders-h" :title="t('navi.ability')">
                    <EListItem icon="pi pi-comment" :title="t('navi.ask')" @click="ask" />
                    <EListItem icon="pi pi-language" :title="t('navi.translate')" @click="translateFast" />
                    <EListItem icon="pi pi-language" :title="t('navi.translateInDeep')" @click="translate" />
                    <EListItem icon="pi pi-lightbulb" :title="t('navi.explain')" @click="explain"/>
                    <EListItem icon="pi pi-volume-up" :title="t('navi.pronounce')" @click="pronounce" />
                    <EListItem icon="pi pi-book" :title="t('navi.dictionary')" @click="dictionary" />
                </EList>
                <Button :label="t('navi.close')" severity="secondary" class="!rounded-xl drop-shadow-2xl" @click="naviStore.visible = false" />
            </div>
            
            <!--                Ask -->
            <div v-if="mode === 'ask'" class="flex flex-col gap-4">
                <div v-if="naviStore.page !== 1" class="flex flex-col gap-4">
                    <EList v-if="naviStore.quoteMode" icon="pi pi-align-left" :title="t('navi.quote')">
                        <EListItem enable-slot>
                            <div class="line-clamp-5">
                                {{ askData.quote }}
                            </div>
                        </EListItem>
                    </EList>
                    <EList icon="pi pi-comment" :title="t('navi.question')">
                        <EListItem enable-slot>
                            <ETextarea v-show="naviStore.page === 2" v-model="askData.question" :placeholder="t('navi.enterYourQuestion')" />
                            <div v-show="naviStore.page === 3" class="line-clamp-5">
                                {{ askData.question }}
                            </div>
                        </EListItem>
                    </EList>
                </div>
                <div v-if="naviStore.page === 2" class="flex flex-col gap-4">
                    <div class="flex *:flex-1 gap-4 sticky bottom-0 drop-shadow-2xl">
                        <Button :label="t('navi.back')" icon="pi pi-arrow-left" severity="secondary" class="!rounded-xl" @click="askBack" />
                        <Button :label="t('navi.ask')" icon="pi pi-sparkles" class="!rounded-xl" @click="ask" />
                    </div>
                </div>
                <div v-if="naviStore.page === 3" class="flex flex-col gap-4">
                    <div class="">
                        <EList :title="t('navi.answer')" icon="pi pi-language">
                            <EListItem :enable-slot="true">
                                <div v-if="naviStore.getStreamOutput(askData.counter)" class="select-text">
                                    <MdRender :markdown="naviStore.getStreamOutput(askData.counter)" dynamic />
                                </div>
                                <div v-else class="flex flex-col gap-1">
                                    <Skeleton class="h-4" /><Skeleton class="h-4" /><Skeleton class="h-4" /><Skeleton class="h-4 !w-3/5" />
                                </div>
                            </EListItem>
                        </EList>
                    </div>
                    <div class="flex *:flex-1 gap-4 sticky bottom-0 drop-shadow-2xl">
                        <Button class="!rounded-xl" :label="t('navi.back')" @click="askBack" icon="pi pi-arrow-left" severity="secondary" />
                        <Button class="!rounded-xl" :label="t('navi.retry')" :disabled="!naviStore.getStreamStatus(askData.counter)" @click="doAskStream" icon="pi pi-replay" severity="warn" />
                    </div>
                </div>
            </div>
            
            <!--                Explain-->
            <div v-if="mode === 'explain'" class="flex flex-col gap-4">
                <div v-if="naviStore.page !== 1">
                    <EList icon="pi pi-align-left" :title="t('navi.content')">
                        <EListItem enable-slot>
                            <ETextarea v-show="naviStore.page === 2" v-model="explainData.quote" :placeholder="t('navi.explainInputPlaceholder')" />
                            <div v-show="naviStore.page === 3" class="line-clamp-5">
                                {{ explainData.quote }}
                            </div>
                        </EListItem>
                    </EList>
                </div>
                <div v-if="naviStore.page === 2" class="flex flex-col gap-4">
                    <div class="flex *:flex-1 gap-4 sticky bottom-0 drop-shadow-2xl">
                        <Button :label="t('navi.back')" icon="pi pi-arrow-left" severity="secondary" class="!rounded-xl" @click="explainBack" />
                        <Button :label="t('navi.explain')" icon="pi pi-sparkles" class="!rounded-xl" @click="explain" />
                    </div>
                </div>
                <div v-if="naviStore.page === 3" class="flex flex-col gap-4">
                    <div class="">
                        <EList :title="t('navi.explanation')" icon="pi pi-lightbulb">
                            <EListItem :enable-slot="true">
                                <div v-if="naviStore.getStreamOutput(explainData.counter)" class="select-text">
                                    <MdRender :markdown="naviStore.getStreamOutput(explainData.counter)" dynamic />
                                </div>
                                <div v-else class="flex flex-col gap-1">
                                    <Skeleton class="h-4" /><Skeleton class="h-4" /><Skeleton class="h-4" /><Skeleton class="h-4 !w-3/5" />
                                </div>
                            </EListItem>
                        </EList>
                    </div>
                    <div class="flex *:flex-1 gap-4 sticky bottom-0 drop-shadow-2xl">
                        <Button class="!rounded-xl" :label="t('navi.back')" @click="explainBack" icon="pi pi-arrow-left" severity="secondary" />
                        <Button class="!rounded-xl" :label="t('navi.retry')" :disabled="!naviStore.getStreamStatus(explainData.counter)" @click="doExplainStream" icon="pi pi-replay" severity="warn" />
                    </div>
                </div>
            </div>
            
            <!--                Pronounce-->
            <div v-if="mode === 'pronounce'" class="flex flex-col gap-4">
                <div v-if="naviStore.page !== 1">
                    <EList icon="pi pi-align-left" :title="t('navi.content')">
                        <EListItem enable-slot>
                            <ETextarea v-show="naviStore.page === 2" v-model="pronounceData.quote" :placeholder="t('navi.pronounceInputPlaceholder')" />
                            <div v-show="naviStore.page === 3" class="line-clamp-5">
                                {{ pronounceData.quote }}
                            </div>
                        </EListItem>
                    </EList>
                </div>
                <div v-if="naviStore.page === 2" class="flex flex-col gap-4">
                    <div class="flex *:flex-1 gap-4 sticky bottom-0 drop-shadow-2xl">
                        <Button :label="t('navi.back')" icon="pi pi-arrow-left" severity="secondary" class="!rounded-xl" @click="pronounceBack" />
                        <Button :label="t('navi.explain')" icon="pi pi-sparkles" class="!rounded-xl" @click="pronounce" />
                    </div>
                </div>
                <div v-if="naviStore.page === 3" class="flex flex-col gap-4">
                    <div class="">
                        <EList :title="t('navi.pronunciation')" icon="pi pi-volume-up">
                            <EListItem :enable-slot="true">
                                <div v-show="!pronounceData.loading" class="select-text">
                                    <audio :src="pronounceData.audioUrl" controls />
                                </div>
                                <div v-show="pronounceData.loading" class="flex flex-col gap-1">
                                    <ProgressBar mode="indeterminate"></ProgressBar>
                                </div>
                            </EListItem>
                        </EList>
                    </div>
                    <div class="flex *:flex-1 gap-4 sticky bottom-0 drop-shadow-2xl">
                        <Button class="!rounded-xl" :label="t('navi.back')" @click="pronounceBack" icon="pi pi-arrow-left" severity="secondary" />
                        <Button class="!rounded-xl" :label="t('navi.retry')" :disabled="pronounceData.loading" @click="doPronounce" icon="pi pi-replay" severity="warn" />
                    </div>
                </div>
            </div>
            
<!--            Translate in Deep -->
            <div v-if="mode === 'translate'" class="flex flex-col gap-4">
                <div v-if="naviStore.page !== 1" class="flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <ESelect v-model="translateFrom" :data="availableLanguages" :header="t('navi.translateFrom')" display-field="name" value-field="code" />
                        <div class="pi pi-arrow-right !text-lg" />
                        <ESelect v-model="translateTo" :data="availableTranslateToLanguage" :header="t('navi.translateTo')" display-field="name" value-field="code" />
                    </div>
                    <EList :title="`${t('navi.originalText')}${(translateFrom === null && naviStore.page === 3 && !translateLoading)? ' · ' + getLanguageName(translateFromAutoDetect): ''} `"
                           icon="pi pi-align-left">
                        <EListItem :enable-slot="true">
                            <ETextarea v-if="naviStore.page === 2" v-model="translateOriginal" :placeholder="t('navi.originalText')" />
                            <div v-else class="line-clamp-5">
                                {{ translateOriginal }}
                            </div>
                        </EListItem>
                    </EList>
                </div>
                <div v-if="naviStore.page === 2" class="flex flex-col gap-4">
                    <div class="flex *:flex-1 gap-4">
                        <Button class="!rounded-xl" @click="translateBack" :label="t('navi.back')" icon="pi pi-arrow-left" severity="secondary" />
                        <Button class="!rounded-xl" :label="t('navi.translate')" icon="pi pi-language" @click="translate" />
                    </div>
                </div>
                <div v-if="naviStore.page === 3" class="flex flex-col gap-4">
                    <div class="">
                        <EList :title="t('navi.translation')" icon="pi pi-language">
                            <EListItem :enable-slot="true">
                                <div v-show="!translateLoading" class="select-text">
                                    {{ translateResult }}
                                </div>
                                <div v-show="translateLoading" class="flex flex-col gap-1">
                                    <Skeleton class="h-4" />
                                    <Skeleton class="h-4" />
                                    <Skeleton class="h-4" />
                                    <Skeleton class="h-4 !w-3/5" />
                                </div>
                            </EListItem>
                        </EList>
                    </div>
                    <div class="flex *:flex-1 gap-4">
                        <Button class="!rounded-xl" :label="t('navi.back')" @click="translateBack" icon="pi pi-arrow-left" severity="secondary" />
                        <Button class="!rounded-xl" :label="t('navi.retry')" :disabled="translateLoading" @click="doTranslate" icon="pi pi-replay" severity="warn" />
                    </div>
                </div>
            </div>
            
            <!--                Translation Fast-->
            <div v-if="mode === 'translateFast'" class="flex flex-col gap-4">
                <div v-if="naviStore.page !== 1" class="flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <ESelect v-model="translateFastData.targetLanguage" :data="translateFastData.targetList" :header="t('navi.translateTo')" display-field="name" value-field="code" />
                    </div>
                    <EList :title="t('navi.originalText')" icon="pi pi-align-left">
                        <EListItem :enable-slot="true">
                            <ETextarea v-if="naviStore.page === 2" v-model="translateFastData.original" :placeholder="t('navi.originalText')" />
                            <div v-else class="line-clamp-5">
                                {{ translateFastData.original }}
                            </div>
                        </EListItem>
                    </EList>
                </div>
                <div v-if="naviStore.page === 2" class="flex flex-col gap-4">
                    <div class="flex *:flex-1 gap-4">
                        <Button class="!rounded-xl" @click="translateFastBack" :label="t('navi.back')" icon="pi pi-arrow-left" severity="secondary" />
                        <Button class="!rounded-xl" :label="t('navi.translate')" icon="pi pi-language" @click="translateFast" />
                    </div>
                </div>
                <div v-if="naviStore.page === 3" class="flex flex-col gap-4">
                    <div class="">
                        <EList :title="t('navi.translation')" icon="pi pi-language">
                            <EListItem :enable-slot="true">
                                <div v-if="naviStore.getStreamOutput(translateFastData.counter)" class="select-text">
                                    {{ naviStore.getStreamOutput(translateFastData.counter) }}
                                </div>
                                <div v-else class="flex flex-col gap-1">
                                    <Skeleton class="h-4" />
                                    <Skeleton class="h-4" />
                                    <Skeleton class="h-4" />
                                    <Skeleton class="h-4 !w-3/5" />
                                </div>
                            </EListItem>
                        </EList>
                    </div>
                    <div class="flex *:flex-1 gap-4">
                        <Button class="!rounded-xl" :label="t('navi.back')" @click="translateFastBack" icon="pi pi-arrow-left" severity="secondary" />
                        <Button class="!rounded-xl" :label="t('navi.retry')" :disabled="!naviStore.getStreamStatus(translateFastData.counter)" @click="doTranslateFast" icon="pi pi-replay" severity="warn" />
                    </div>
                </div>
            </div>
            
<!--            Dictionary -->
            <div v-if="mode === 'dictionary'" class="flex flex-col gap-4">
                <div v-if="naviStore.page !== 1">
                    <EList icon="pi pi-align-left" :title="t('navi.word')">
                        <EListItem enable-slot>
                            <ETextarea v-show="naviStore.page === 2" v-model="dictionaryData.word" :placeholder="t('navi.wordInputPlaceholder')" />
                            <div v-show="naviStore.page !== 2" class="line-clamp-5">
                                {{ dictionaryData.word }}
                            </div>
                        </EListItem>
                    </EList>
                </div>
                <div v-if="naviStore.page === 2" class="flex flex-col gap-4">
                    <div class="flex *:flex-1 gap-4 sticky bottom-0 drop-shadow-2xl">
                        <Button :label="t('navi.back')" icon="pi pi-arrow-left" severity="secondary" class="!rounded-xl" @click="dictionaryBack" />
                        <Button :label="t('navi.next')" icon="pi pi-arrow-right" class="!rounded-xl" @click="dictionary" />
                    </div>
                </div>
                <div v-if="naviStore.page === 3" class="flex flex-col gap-4">
                    <EList v-for="lang in dictionaryData.langList" :title="lang.name" icon="pi pi-book">
                        <EListItem v-for="dic in dictionaryData.dicList[lang.code]" :title="dic.name" @click="dicSelected(dic)"  />
                    </EList>
                    <div class="flex *:flex-1 gap-4 sticky bottom-0 drop-shadow-2xl">
                        <Button :label="t('navi.back')" icon="pi pi-arrow-left" severity="secondary" class="!rounded-xl" @click="dictionaryBack" />
                        <Button :label="t('navi.close')" icon="pi pi-times" severity="secondary" class="!rounded-xl" @click="naviStore.visible = false" />
                    </div>
                </div>
            </div>
        </div>
    </Drawer>
</template>

<script setup>
import Drawer from "primevue/drawer";
import Button from "primevue/button";
import {useNaviStore} from "@/stores/naviStore.js";
import {nextTick, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import EList from "@/components/etsuya/EList.vue";
import EListItem from "@/components/etsuya/EListItem.vue";
import {useLanguageStore} from "@/stores/languageStore.js";
import {getCurrentLanguage} from "@/utils/language.js";
import {cloneDeep} from "lodash";
import ProgressBar from 'primevue/progressbar';
import ESelect from "@/components/etsuya/ESelect.vue";
import ETextarea from "@/components/etsuya/ETextarea.vue";
import Skeleton from "primevue/skeleton";
import {apiNaviAsk, apiNaviExplain, apiNaviPronounce, apiNaviTranslate} from "@/api/naviV2.js";
import MdRender from "@/components/natively/MdRender.vue";
import PostCard from "@/components/natively/PostCard.vue";

const { t, locale, availableLocales } = useI18n();

const naviStore = useNaviStore();

// mode
const mode = ref('');

// counter
const counter = ref(1);

// language
const languageStore = useLanguageStore();

// dictionary
const dictionaryLangSelector = ref(null);
const dictionaryDicSelector = ref(null);
const dictionaryData = ref({
    word: '',
    dic: '',
    lang: null,
    langList: cloneDeep(languageStore.languageData),
    dicList: {
        "en": [
            { "name": "Oxford Learner's Dictionaries", "value": "ENO", "target": "en", "url": "https://www.oxfordlearnersdictionaries.com/definition/english/" },
            { "name": "Cambridge Learner's Dictionary", "value": "ENC", "target": "en", "url": "https://dictionary.cambridge.org/dictionary/learner-english/" },
            { "name": "Longman Dictionary of Contemporary English", "value": "ENL", "target": "en", "url": "https://www.ldoceonline.com/dictionary/" },
            { "name": "柯林斯英语-汉语词典", "value": "ENCCE", "target": "zh", "url": "https://www.collinsdictionary.com/zh/dictionary/english-chinese" },
            { "name": "Weblio英和和英辞典", "value": "ENW", "target": "ja", "url": "https://ejje.weblio.jp/content/" },
            { "name": "Collins English-French Dictionary", "value": "ENCEF", "target": "fr", "url": "https://www.collinsdictionary.com/us/dictionary/english-french/" },
            { "name": "Dictionnaire anglais-français | Cambridge Dictionary", "value": "ENCBEF", "target": "fr", "url": "https://dictionary.cambridge.org/fr/dictionnaire/anglais-francais/" },
            { "name": "네이버 영어사전", "value": "ENN", "target": "ko", "url": "https://en.dict.naver.com/#/search?query=" }
        ],
        "zh": [
            { "name": "文学网汉语词典", "value": "ZHH", "target": "zh", "url": "https://cd.hwxnet.com/search.do?wd=" },
            { "name": "Collins Chinese-English", "value": "ZHC", "target": "en", "url": "https://www.collinsdictionary.com/zh/dictionary/chinese-english/" },
            { "name": "Weblio日中・中日辞典", "value": "ZHW", "target": "ja", "url": "https://cjjc.weblio.jp/content/" },
            { "name": "네이버 중국어사전", "value": "ZHN", "target": "ko", "url": "https://zh.dict.naver.com/#/search?query=" },
            { "name": "다음中国语사전", "value": "ZHD", "target": "ko", "url": "https://dic.daum.net/search.do?dic=zh&q=" }
        ],
        "ja": [
            { "name": "goo国語辞書", "value": "JPG", "target": "ja", "url": "https://dictionary.goo.ne.jp/word/" },
            { "name": "Weblio辞書", "value": "JPW", "target": "ja", "url": "https://www.weblio.jp/content/" },
            { "name": "Jisho.org", "value": "JPE", "target": "en", "url": "https://jisho.org/search?utf8=%E2%9C%93&keyword=" },
            { "name": "Weblio日中・中日辞典", "value": "JPWC", "target": "zh", "url": "https://cjjc.weblio.jp/content/" },
            { "name": "네이버 일본어사전", "value": "JPN", "target": "ko", "url": "https://ja.dict.naver.com/#/search?query=" },
            { "name": "Weblioフランス語辞典", "value": "JPF", "target": "fr", "url": "https://fjjf.weblio.jp/content/" },
            { "name": "Dictionnaire de japonais - 日仏辞典", "value": "JPFD", "target": "fr", "url": "https://www.dictionnaire-japonais.com/search.php?w=" }
        ],
        "fr": [
            { "name": "Dictionnaire Français en ligne", "value": "FRL", "target": "fr", "url": "https://www.larousse.fr/dictionnaires/francais/" },
            { "name": "法语助手", "value": "FRH", "target": "zh", "url": "https://www.frdic.com/dicts/fr/" },
            { "name": "Weblio日中・中日辞典", "value": "FRW", "target": "ja", "url": "https://cjjc.weblio.jp/content/" },
            { "name": "Collins English-French Dictionary", "value": "FRCE", "target": "en", "url": "https://www.collinsdictionary.com/dictionary/english-french/" },
            { "name": "프랑스어사전", "value": "FRK", "target": "ko", "url": "https://dict.naver.com/frkodict/#/search?query=" }
        ],
        "ko": [
            { "name": "네이버 국어사전", "value": "KON", "target": "ko", "url": "https://ko.dict.naver.com/#/search?query=" },
            { "name": "Naver Korean-English Dictionary", "value": "KOE", "target": "en", "url": "https://korean.dict.naver.com/koendict/#/search?query=" },
            { "name": "Naver 韩中词典", "value": "KOZH", "target": "zh", "url": "https://korean.dict.naver.com/kozhdict/#/search?query=" },
            { "name": "Naver 韓日辞書", "value": "KOJA", "target": "ja", "url": "https://korean.dict.naver.com/kojadict/#/search?query=" },
            { "name": "Dictionnaire Coréen-Français", "value": "KOF", "target": "fr", "url": "https://korean.dict.naver.com/kofrdict/#/search?query=" }
        ]
    }
});
const dicSelected = (dic) => {
    window.open(dic.url + dictionaryData.value.word.trim(), '_blank').focus();
}
const dictionary = () => {
    if(naviStore.page === 1){ // click from menu
        mode.value = 'dictionary';
        dictionaryData.value.word = '';
        if(naviStore.quote) {
            dictionaryData.value.word = naviStore.quote;
            naviStore.page = 3;
        } else {
            naviStore.page = 2;
        }
    } else if(naviStore.page === 2){
        if(dictionaryData.value.word){
            naviStore.page = 3;
        }
    }
}
const dictionaryBack = () => {
    if(naviStore.quoteMode){
        if(naviStore.page === 3){
            naviStore.page = 1;
        }
    } else {
        if(naviStore.page === 3){
            naviStore.page = 2;
        } else if(naviStore.page === 2){
            naviStore.page = 1;
        }
    }
}

// ask
const askData = ref({
    question: '',
    loading: false,
    result: '',
    quote: '',
    counter: -1
});
const ask = () => {
    if(naviStore.page === 1){ // click from menu
        mode.value = 'ask';
        askData.value.quote = '';
        if(naviStore.quoteMode) {
            askData.value.quote = naviStore.quote;
        }
        naviStore.page = 2;
    } else if(naviStore.page === 2){ // after passing content
        if(askData.value.question){
            naviStore.page = 3;
        }
    }
    if(naviStore.page === 3){ // sending request
        // doAsk();
        doAskStream();
    }
}
const doAsk = () => {
    const currentCounter = ++counter.value;
    askData.value.loading = true;
    apiNaviAsk(askData.value.question, askData.value.quote).then((res) => {
        if(counter.value !== currentCounter){
            return;
        }
        askData.value.result = res.answer;
    }).catch((err) => {}).finally(() => {
        askData.value.loading = false;
    })
}
const doAskStream = () => {
    const currentCounter = ++naviStore.counter;
    askData.value.counter = currentCounter;
    naviStore.sendAskStreamRequest(askData.value.question, askData.value.quote, currentCounter);
}
const askBack = () => {
    if(naviStore.page === 3){
        naviStore.page = 2;
    } else if(naviStore.page === 2){
        naviStore.page = 1;
    }
}

// explain
const explainData = ref({
    loading: false,
    result: '',
    quote: '',
    counter: -1
});
const explain = () => {
    if(naviStore.page === 1){ // click from menu
        mode.value = 'explain';
        explainData.value.quote = '';
        if(naviStore.quoteMode) {
            explainData.value.quote = naviStore.quote;
            naviStore.page = 3;
        } else {
            naviStore.page = 2;
        }
    } else if(naviStore.page === 2){ // after passing content
        if(explainData.value.quote){
            naviStore.page = 3;
        }
    }
    if(naviStore.page === 3){ // sending request
        // doExplain();
        doExplainStream();
    }
}
const doExplain = () => {
    const currentCounter = ++counter.value;
    explainData.value.loading = true;
    apiNaviExplain(explainData.value.quote).then(res => {
        if(counter.value !== currentCounter){
            return;
        }
        explainData.value.result = res.answer;
    }).catch((err) => {}).finally(() => {
        explainData.value.loading = false;
    })
}
const doExplainStream = () => {
    const currentCounter = ++naviStore.counter;
    explainData.value.counter = currentCounter;
    naviStore.sendExplainStreamRequest(explainData.value.quote, currentCounter);
}
const explainBack = () => {
    if(naviStore.quoteMode){
        if(naviStore.page === 3){
            naviStore.page = 1;
        }
    } else {
        if(naviStore.page === 3){
            naviStore.page = 2;
        } else if(naviStore.page === 2){
            naviStore.page = 1;
        }
    }
}

// pronounce
const pronounceData = ref({
    quote: '',
    audioBlob: null,
    audioUrl: ''
});
const pronounce = () => {
    if(naviStore.page === 1){ // click from menu
        mode.value = 'pronounce';
        pronounceData.value.quote = '';
        if(naviStore.quoteMode) {
            pronounceData.value.quote = naviStore.quote;
            naviStore.page = 3;
        } else {
            naviStore.page = 2;
        }
    } else if(naviStore.page === 2){ // after passing content
        if(pronounceData.value.quote){
            naviStore.page = 3;
        }
    }
    if(naviStore.page === 3){ // sending request
        doPronounce();
    }
}
const doPronounce = () => {
    const currentCounter = ++counter.value;
    pronounceData.value.loading = true;
    apiNaviPronounce(pronounceData.value.quote).then(res => {
        if(counter.value !== currentCounter){
            return;
        }
        pronounceData.value.audioBlob = new Blob([res.data], { type: 'audio/mp3' });
        pronounceData.value.audioUrl = URL.createObjectURL(pronounceData.value.audioBlob);
    }).catch((err) => {}).finally(() => {
        pronounceData.value.loading = false;
    })
}
const pronounceBack = () => {
    if(naviStore.quoteMode){
        if(naviStore.page === 3){
            naviStore.page = 1;
        }
    } else {
        if(naviStore.page === 3){
            naviStore.page = 2;
        } else if(naviStore.page === 2){
            naviStore.page = 1;
        }
    }
}

// translation
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
const translateOriginal = ref('');
const translateResult = ref('');
const translateFromAutoDetect = ref('');
const translate = () => {
    if(naviStore.page === 1){ // click from menu
        mode.value = 'translate';
        if(naviStore.quoteMode){
            translateOriginal.value = naviStore.quote;
            naviStore.page = 3;
        } else {
            naviStore.page = 2;
        }
    } else if(naviStore.page === 2){ // after passing content
        if(translateOriginal.value){
            naviStore.page = 3;
        }
    }
    if(naviStore.page === 3){ // sending request
        doTranslate();
    }
}
const translateBack = () => {
    if(naviStore.quoteMode){
        if(naviStore.page === 3){
            naviStore.page = 1;
        }
    } else {
        if(naviStore.page === 3){
            naviStore.page = 2;
        } else if(naviStore.page === 2){
            naviStore.page = 1;
        }
    }
}
const doTranslate = () => {
    const currentCounter = ++counter.value;
    translateLoading.value = true;
    apiNaviTranslate(translateOriginal.value, translateFrom.value, translateTo.value).then((res) => {
        if(counter.value !== currentCounter) return;
        translateFromAutoDetect.value = res.originalLanguage;
        translateResult.value = res.translation;
    }).catch(error => {}).finally(() => {
        translateLoading.value = false;
    })
}
watch(translateFrom, () => {
    if(naviStore.page === 3){
        doTranslate();
    }
});
watch(translateTo, () => {
    if(naviStore.page === 3){
        doTranslate();
    }
});

// translateFast
const translateFastData = ref({
    targetLanguage: getCurrentLanguage(),
    targetList: cloneDeep(languageStore.languageData),
    original: '',
    counter: -1
});
const translateFast = () => {
    if(naviStore.page === 1){
        mode.value = 'translateFast';
        if(naviStore.quoteMode){
            translateFastData.value.original = naviStore.quote;
            naviStore.page = 3;
        } else {
            naviStore.page = 2;
        }
    } else if(naviStore.page === 2){
        if(translateFastData.value.original){
            naviStore.page = 3;
        }
    }
    if(naviStore.page === 3){ // sending request
        doTranslateFast();
    }
}
const doTranslateFast = () => {
    const currentCounter = ++naviStore.counter;
    translateFastData.value.counter = currentCounter;
    naviStore.sendTranslateFastStreamRequest(translateFastData.value.original, translateFastData.value.targetLanguage, currentCounter);
}
const translateFastBack = () => {
    if(naviStore.quoteMode){
        if(naviStore.page === 3){
            naviStore.page = 1;
        }
    } else {
        if(naviStore.page === 3){
            naviStore.page = 2;
        } else if(naviStore.page === 2){
            naviStore.page = 1;
        }
    }
}
watch(() => translateFastData.value.targetLanguage, () => {
    if(naviStore.page === 3){
        doTranslateFast();
    }
});

</script>

<style>

</style>
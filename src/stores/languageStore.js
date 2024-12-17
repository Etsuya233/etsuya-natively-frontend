import {defineStore} from 'pinia';
import {ref} from "vue";

export const useLanguageStore = defineStore('language', () => {

    let languageData = ref([]);
    let languageNative = ref([]);

    return {languageData, languageNative};

});
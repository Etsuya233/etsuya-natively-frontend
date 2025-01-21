import {defineStore} from 'pinia';
import {ref} from "vue";

export const useLanguageStore = defineStore('language', () => {

    let languageData = ref([]);
    let languageNative = ref([]);

    /**
     * [{code, name}, ...]
     * @param code
     * @returns {string|string}
     */
    function getLanguageName(code) {
        const language = languageData.value.find(item => item.code === code);
        return language ? language.name : '???';
    }

    function getLanguageNativeName(code) {
        const language = languageNative.value.find(item => item.code === code);
        return language ? language.name : '???';
    }

    return {languageData, languageNative, getLanguageName, getLanguageNativeName};

});
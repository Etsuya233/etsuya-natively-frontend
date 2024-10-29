import { createI18n } from 'vue-i18n'
import zhConfig from './lang-zh.js'
import enConfig from './lang-en.js'
import jpConfig from "@/lang/lang-jp.js";
import frConfig from "@/lang/lang-fr.js";
import {getCurrentLanguage} from "@/utils/language.js";

const i18n = createI18n({
    legacy: false,
    locale: getCurrentLanguage(),
    fallbackLocale: 'en-US',
    messages: {
        'zh-CN': zhConfig,
        'en-US': enConfig,
        'ja-JP': jpConfig,
        'fr-FR': frConfig,
    }
})

export default i18n;
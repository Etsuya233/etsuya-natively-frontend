import { createI18n } from 'vue-i18n'
import zhConfig from './lang-zh.js'
import enConfig from './lang-en.js'
import jaConfig from "@/lang/lang-ja.js";
import frConfig from "@/lang/lang-fr.js";
import koConfig from "@/lang/lang-ko.js";
import {getCurrentLanguage} from "@/utils/language.js";

const i18n = createI18n({
    legacy: false,
    locale: getCurrentLanguage(),
    fallbackLocale: 'en-US',
    messages: {
        'zh': zhConfig,
        'en': enConfig,
        'ja': jaConfig,
        'fr': frConfig,
        'ko': koConfig,
    },
    missingWarn: false,
    fallbackWarn: false
})

export default i18n;
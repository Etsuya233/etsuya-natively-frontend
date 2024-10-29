export const getCurrentLanguage = () => {
    let language = localStorage.language;
    if(language === undefined || language === null) {
        let lang = navigator.language;
        localStorage.language = lang;
        if(!lang){
            localStorage.language = 'en-US';
        }
        return lang;
    } else if(language){
        return language;
    } else {
        localStorage.language = 'en-US';
        return 'en-US';
    }
}

export const languageData = [
    { name: '🇺🇸 English', value: 'en-US'},
    { name: '🇯🇵 日本語', value: 'ja-JP'},
    { name: '🇨🇳 简体中文', value: 'zh-CN'},
    { name: '🇫🇷 Français', value: 'fr-FR'}
];

export const changeLanguage = (language) => {
    localStorage.language = language;
}
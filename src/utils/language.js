export const getCurrentLanguage = () => {
    let language = localStorage.language;
    if(language === undefined || language === null) {
        let lang = navigator.language;
        localStorage.language = lang;
        if(!lang){
            localStorage.language = 'en';
        }
        return lang;
    } else if(language){
        if(!language.startsWith('zh')){
            language = language.substring(0, 2);
        }
        return language;
    } else {
        localStorage.language = 'en';
        return 'en';
    }
}

export const languageData = [
    { name: '🇺🇸 English', value: 'en'},
    { name: '🇯🇵 日本語', value: 'ja'},
    { name: '🇨🇳 简体中文', value: 'zh-CN'},
    { name: '🇫🇷 Français', value: 'fr'}
];

export const changeLanguage = (language) => {
    localStorage.language = language;
}
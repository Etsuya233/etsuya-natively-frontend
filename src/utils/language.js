export const getCurrentLanguage = () => {
    let language = localStorage.language;
    if(language === undefined || language === null) {
        let lang = navigator.language;
        localStorage.language = lang;
        if(!lang){
            localStorage.language = 'en';
        }
        return lang;
    } else {
        return language;
    }
}

export const languageData = [
    { name: '🇺🇸 English', value: 'en'},
    { name: '🇯🇵 日本語', value: 'ja'},
    { name: '🇨🇳 简体中文', value: 'zh'},
    { name: '🇫🇷 Français', value: 'fr'},
    { name: '🇰🇷 한국인', value: 'ko'}
];

export const changeLanguage = (language) => {
    localStorage.language = language;
}
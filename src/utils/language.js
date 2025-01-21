export const getCurrentLanguage = () => {
    let language = localStorage.language;
    if(language === undefined || language === null) {
        let lang = navigator.language.substring(0, 2);
        localStorage.language = lang;
        if(!lang){
            localStorage.language = 'en';
        }
        return lang;
    } else {
        return language.substring(0, 2);
    }
}

export const changeLanguage = (language) => {
    localStorage.language = language;
}
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

export const changeLanguage = (language) => {
    localStorage.language = language;
}
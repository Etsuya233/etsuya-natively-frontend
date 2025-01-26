export const themeChange = (mode) => {
    if(mode === 'dark'){
        localStorage.theme = 'dark';
    } else if(mode === 'light'){
        localStorage.theme = 'light';
    } else {
        localStorage.theme = 'system'
    }
    document.documentElement.classList.toggle(
        'dark',
        localStorage.theme === 'dark' ||
        ((!('theme' in localStorage) || (localStorage.theme === 'system')) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
}

export const detectTheme = () => {
    if(localStorage.theme === 'dark'){
        return 'dark';
    } else if(localStorage.theme === 'light'){
        return 'light';
    } else {
        return 'system';
    }
}
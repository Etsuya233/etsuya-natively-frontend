<template>
    <div class="flex flex-col p-4 gap-4">
        <div class="flex flex-col gap-4 mt-8 md:items-center md:mt-12">
            <Logo size="lg" />
            <div class="font-bold text-5xl flex items-center md:text-7xl md:mt-12">
                <transition name="fade" mode="out-in">
                    <p v-if="welcomeText" :key="welcomeText">{{ welcomeText }}</p>
                </transition>
            </div>
        </div>
        <div class="fixed bottom-0 left-0 right-0 flex justify-center">
            <div class="grid grid-cols-2 gap-2 w-full *:w-full p-4 max-w-screen-md">
                <Button icon="pi pi-language" :label="t('common.language')" severity="secondary" @click="languageModal = true" />
                <Button icon="pi pi-sun" :label="t('common.theme')" severity="secondary" @click="themeModal = true" />
                <Button icon="pi pi-user" class="col-span-2" :label="t('login.login')" @click="router.push({ name: 'Login'})" />
                <Button icon="pi pi-user-plus" class="col-span-2" :label="t('login.register')" />
            </div>
        </div>
        <Dialog class="min-w-80" v-model:visible="languageModal" modal :header="t('common.language')">
            <Select class="mb-4 w-full" v-model="language" :options="languages" optionLabel="name" optionValue="value"/>
            <div class="flex justify-end gap-2">
                <Button type="button" :label="t('common.cancel')" severity="secondary" @click="languageModal = false"></Button>
                <Button type="button" :label="t('common.save')" @click="languageChanged"></Button>
            </div>
        </Dialog>
        <Dialog class="min-w-80" v-model:visible="themeModal" modal :header="t('common.theme')">
            <Select class="mb-4 w-full" v-model="themeMode" :options="themeModes" optionLabel="name" optionValue="value"/>
            <div class="flex justify-end gap-2">
                <Button type="button" :label="t('common.cancel')" severity="secondary" @click="themeModal = false"></Button>
                <Button type="button" :label="t('common.save')" @click="themeChanged"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import Logo from "@/components/logo/Logo.vue";
import Button from 'primevue/button';
import Select from 'primevue/select';
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useI18n} from 'vue-i18n'
import {detectTheme, themeChange} from "@/utils/theme.js";
import {changeLanguage, getCurrentLanguage, languageData} from "@/utils/language.js";
import Dialog from 'primevue/dialog';
import {useRouter} from "vue-router";

const { t, locale, availableLocales } = useI18n();
const router = useRouter();

//language
let languageModal = ref(false);
let language = ref(getCurrentLanguage());
const languages = ref(languageData);
const languageChanged = () => {
    changeLanguage(language.value);
    location.reload();
}

//theme
let themeModal = ref(false);
let themeMode = ref(detectTheme());
const themeModes = ref([
    { name: t('common.darkMode'), value: 'dark'},
    { name: t('common.lightMode'), value: 'light'},
    { name: t('common.followSystem'), value: 'system'},
])
const themeChanged = () => {
    themeChange(themeMode.value);
    themeModal.value = false;
}

//welcome
const welcomeMessages = [
    "Welcome",           // English
    "欢迎",               // Chinese (Simplified)
    "ようこそ",           // Japanese
    "환영합니다",         // Korean
    "Добро пожаловать",   // Russian
    "Bienvenido",         // Spanish
    "Willkommen",         // German
    "Bienvenue",          // French
    "Benvenuto",          // Italian
    "Bem-vindo",          // Portuguese
    "स्वागत हे",           // Hindi
    "Hoş geldiniz",       // Turkish
    "Καλώς ήρθατε",       // Greek
    "Witamy",             // Polish
    "Welkom",             // Dutch
    "Välkommen",          // Swedish
    "Velkommen",          // Norwegian
    "Tervetuloa",         // Finnish
    "Добре дошли",        // Bulgarian
    "Üdvözöljük",         // Hungarian
    "مرحبا",            // Arabic (مرحبا)
    "ברוך הבא",           // Hebrew
    "Karibu",             // Swahili
    "Mabuhay",            // Filipino
    "வணக்கம்",            // Tamil
    "Selamat datang",     // Indonesian
    "Chào mừng",          // Vietnamese
    "Bine ai venit",      // Romanian
    "Добродошли"          // Serbian
];
let welcomeIndex = 0;
let welcomeText = ref(welcomeMessages[0]);
const changeMessage = () => {
    welcomeIndex++;
    welcomeText.value = welcomeMessages[welcomeIndex % welcomeMessages.length];
}
let interval;

//life cycle
onMounted(() => {
    interval = setInterval(changeMessage, 3500);
});
onBeforeUnmount(() => {
    clearInterval(interval);
});

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

</style>
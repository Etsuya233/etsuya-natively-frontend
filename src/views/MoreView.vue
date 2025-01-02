<template>
    <div class="w-full min-h-[calc(100dvh-3.5rem)] md:min-h-[calc(100dvh-3.5rem)]" @click="handleGlobalClicked">
        <EHeader :title="t('common.me')" :show-back="false" />
        <div class="w-full">
            <div class="w-full flex flex-col gap-4 p-4">
                <div class="bg-slate-100 rounded-2xl flex px-4 py-3" @click="router.push({ name: 'User', params: { id: userStore.userInfo.id }})">
                    <div class="h-12 w-12 flex-shrink-0">
                        <img class="rounded-full" :src="userStore.userInfo.avatar" alt="avatar"/>
                    </div>
                    <div class="pl-3 *:overflow-hidden *:whitespace-nowrap *:text-ellipsis min-w-0 flex-1">
                        <div class="text-lg font-bold">{{userStore.userInfo.nickname}}</div>
                        <div class="text-sm">{{`@${userStore.userInfo.username}`}}</div>
                    </div>
                </div>
                <ESelectList>
                    <ESelectItem icon="pi-pencil" :title="t('more.editProfile')" />
                    <ESelectItem @click="languageVisible = true" icon="pi-language" :title="t('more.language')" />
                    <ESelectItem @click.stop="logoutClicked" icon="pi-sign-out"
                                 :title="logoutCnt === 0? t('more.logout'): t('more.clickOneMoreTimeToLogout')"
                                 :danger="logoutCnt !== 0" />
                </ESelectList>
            </div>
        </div>
        <Drawer v-model:visible="languageVisible" position="bottom" class="rounded-t-2xl !h-auto" :header="t('more.language')">
            <ESelectList>
                <ESelectItem v-for="item in languages" :key="item" :title="item.name" :selected="item.code === currentLanguage"
                @click="changeLanguageClick(item.code)"/>
            </ESelectList>
        </Drawer>
    </div>
</template>

<script setup>
import EHeader from "@/components/logo/EHeader.vue";
import {useI18n} from "vue-i18n";
import ESelectList from "@/components/ESelectList.vue";
import {useUserStore} from "@/stores/userStore.js";
import Drawer from "primevue/drawer";
import ESelectItem from "@/components/ESelectItem.vue";
import {ref} from "vue";
import {useLanguageStore} from "@/stores/languageStore.js";
import {changeLanguage, getCurrentLanguage} from "@/utils/language.js";
import {useRoute, useRouter} from "vue-router";
import {useChatStore} from "@/stores/chatStore.js";

const { t, locale, availableLocales } = useI18n();
const userStore = useUserStore();
const languageStore = useLanguageStore();
const router = useRouter();
const route = useRoute();

const languages = languageStore.languageNative;
const currentLanguage = ref(getCurrentLanguage());
const languageVisible = ref(false);
const changeLanguageClick = (code) => {
    changeLanguage(code);
    location.reload();
}

// logout
const handleGlobalClicked = () => {
    logoutCnt.value = 0;
}
let logoutCnt = ref(0);
const logoutClicked = () => {
    if(logoutCnt.value === 0){
        logoutCnt.value = 1;
    } else {
        router.push({ name: 'Logout'});
    }
}
</script>

<style scoped>

</style>
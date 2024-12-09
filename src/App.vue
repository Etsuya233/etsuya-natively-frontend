<template>
    <Toast position="top-center" class="!w-full !top-0 !max-w-screen-sm" pt:root:class="*:!m-4" />
    <router-view class="selection:bg-primary-100 selection:text-primary-600 dark:selection:bg-primary-800"/>
</template>

<script setup>
import {detectTheme, themeChange} from "@/utils/theme.js";
import Toast from 'primevue/toast';
import {onBeforeMount} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import {apiGetCurrent} from "@/api/user.js";
import {useChatStore} from "@/stores/chatStore.js";

let currentTheme = detectTheme();
themeChange(currentTheme);

const userStore = useUserStore();
const chatStore = useChatStore();

onBeforeMount(async () => {
    let res = await apiGetCurrent();
    userStore.userInfo = res;
    chatStore.connect();
})

</script>

<style>
* {
    font-family: 'Inter', sans-serif;
    user-select: none;
}
</style>

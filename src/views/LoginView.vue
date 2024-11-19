<template>
    <div class="flex justify-center">
        <div class="flex w-full flex-col p-4 gap-4 max-w-screen-md items-center">
            <ProgressBar class="!h-2 !w-full" :value="(progress - 1) * 34" :show-value="false" />
            <div class="flex flex-col gap-4 mt-12 md:items-center w-full">
                <Logo size="lg" />
                <div class="font-bold text-5xl flex items-center md:mt-4">
                    {{t('login.login')}}
                </div>
            </div>
            <Transition name="fade" mode="out-in" class="flex flex-col mt-4 gap-4 w-full md:mt-8 md:max-w-[28rem]">
                <div v-if="progress === 1" class="flex flex-col gap-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-user"></i>
                        </InputGroupAddon>
                        <FloatLabel variant="in">
                            <InputText id="username" v-model="userInfo.username" />
                            <label for="username">{{t('login.usernameEtc')}}</label>
                        </FloatLabel>
                    </InputGroup>
                    <div class="flex gap-2">
                        <Button class="w-full" :label="t('common.next')" @click="goNext" />
                    </div>
                    <div class="text-center">
                        <RouterLink class="text-surface-500" :to="{ name: 'Register'}">{{t('login.createAccount')}}</RouterLink>
                    </div>
                    <Divider />
                    <ThirdPartyLogin />
                </div>
                <div v-else-if="progress === 2 || progress === 3" class="flex flex-col gap-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-lock"></i>
                        </InputGroupAddon>
                        <FloatLabel variant="in">
                            <Password id="password" v-model="userInfo.password" :feedback="false" toggleMask />
                            <label for="password">{{t('login.password')}}</label>
                        </FloatLabel>
                    </InputGroup>
                    <div class="flex gap-2">
                        <Button class="w-full" :label="t('common.back')" severity="secondary" @click="goBack" />
                        <Button class="w-full" :label="t('common.next')" :loading="loginLoading" @click="goNext" />
                    </div>
                </div>
                <div v-else class="flex flex-col gap-4">
                    <div class="font-bold text-2xl md:text-center">{{t('login.loginSuccess')}}</div>
                    <div class="text-surface-600 md:text-center">{{t('login.redirect')}}</div>
                    <div class="flex">
                        <RouterLink class="w-full" :to="{ name: 'Home'}">
                            <Button class="w-full" :label="t('login.goToHome')" />
                        </RouterLink>
                    </div>
                </div>
            </Transition>
            <div class="fixed bottom-4 right-4">
                <Button label="Hello!" severity="secondary" @click="hello" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Logo from "@/components/logo/Logo.vue";
import {useI18n} from 'vue-i18n'
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Password from 'primevue/password';
import {onBeforeMount, onMounted, ref, toRaw} from "vue";
import {apiHello, apiLogin} from "@/api/user.js";
import {useToast} from 'primevue/usetoast';
import {useToastStore} from "@/stores/toastStore.js";
import Divider from 'primevue/divider';
import ThirdPartyLogin from "@/components/logo/ThirdPartyLogin.vue";
import {useRoute, useRouter} from "vue-router";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const toastStore = useToastStore();
const { t, locale, availableLocales } = useI18n();

//login info
let loginLoading = ref(false);
let userInfo = ref({
    username: '', password: ''
})

//login
const login = async () => {
    apiLogin(toRaw(userInfo.value)).then((res) => {
        console.log(res);
        goNext();
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        setTimeout(() => {
            router.push({ name: 'Home'});
        }, 3000);
    }).catch((err) => {
        progress.value = 2;
    }).finally(() => {
        loginLoading.value = false;
    })
}

//progress
let progress = ref(1);
const goBack = () => {
    progress.value = Math.max(1, progress.value - 1);
}
const goNext = () => {
    if(progress.value + 1 === 3){
        loginLoading.value = true;
        login();
    }
    progress.value = Math.min(4, progress.value + 1)
}

//hello
const hello = () => {
    apiHello().then((res) => {
        toastStore.add({
            severity: 'success',
            summary: 'Hello!',
            detail: res,
        })
    })
}

//onMounted
onBeforeMount(() => {
    if(route.query.completed){
        progress.value = 4;
        setTimeout(() => {
            router.push({ name: 'Home'});
        }, 3000);
    }
})

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

</style>
<template>
    <div class="flex justify-center">
        <div class="flex w-full flex-col p-4 gap-4 max-w-screen-md items-center">
            <ProgressBar class="!h-2 !w-full" :value="(progress - 1) * 50" :show-value="false" />
            <div class="flex flex-col gap-4 mt-12 md:items-center w-full">
                <Logo size="lg" />
                <div class="font-bold text-5xl flex items-center md:mt-4">
                    {{t('login.login')}}
                </div>
            </div>
            <div class="flex flex-col mt-4 gap-4 w-full md:mt-8 md:max-w-[28rem]">
                <form @submit.prevent="goNext" class="flex flex-col gap-4">
                    <div v-show="progress === 1" class="flex flex-col gap-4">
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-user"></i>
                            </InputGroupAddon>
                            <FloatLabel variant="in">
                                <InputText 
                                    id="username" 
                                    name="username"
                                    autocomplete="username"
                                    v-model="userInfo.username" 
                                    @keyup.enter="goNext" 
                                />
                                <label for="username">{{t('login.usernameEtc')}}</label>
                            </FloatLabel>
                        </InputGroup>
                        <div class="flex gap-2">
                            <Button type="submit" class="w-full" :label="t('common.next')" />
                        </div>
                        <div class="text-center">
                            <RouterLink class="text-surface-500" :to="{ name: 'Register'}">{{t('login.createAccount')}}</RouterLink>
                        </div>
                        <Divider />
                        <ThirdPartyLogin />
                    </div>
                    <div v-show="progress === 2" class="flex flex-col gap-4">
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-lock"></i>
                            </InputGroupAddon>
                            <FloatLabel variant="in">
                                <Password 
                                    id="password" 
                                    name="password"
                                    autocomplete="current-password"
                                    ref="passwordInput"
                                    v-model="userInfo.password" 
                                    :feedback="false"
                                    toggleMask
                                    :input-props="{ autocomplete: 'current-password' }"
                                />
                                <label for="password">{{ t('login.password') }}</label>
                            </FloatLabel>
                        </InputGroup>
                        <div class="flex gap-2">
                            <Button type="button" class="w-full" :label="t('common.back')" severity="secondary" @click="goBack" />
                            <Button type="submit" class="w-full" :label="t('common.next')" :loading="loginLoading" />
                        </div>
                    </div>
                </form>
                <div v-show="progress === 3" class="flex flex-col gap-4">
                    <div class="font-bold text-2xl md:text-center">{{t('login.loginSuccess')}}</div>
                    <div class="text-surface-600 md:text-center">{{t('login.redirect')}}</div>
                    <div class="flex">
                        <RouterLink class="w-full" :to="{ name: 'Home'}">
                            <Button class="w-full" :label="t('login.goToHome')" />
                        </RouterLink>
                    </div>
                </div>
            </div>
            <div class="fixed bottom-4 right-4">
                <Button label="Hello!" severity="secondary" @click="hello" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Logo from "@/components/natively/Logo.vue";
import {useI18n} from 'vue-i18n'
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Password from 'primevue/password';
import {nextTick, onBeforeMount, ref, toRaw} from "vue";
import {apiHello, apiLogin} from "@/api/user.js";
import Divider from 'primevue/divider';
import ThirdPartyLogin from "@/components/natively/ThirdPartyLogin.vue";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/stores/userStore.js";
import {useToast} from "@/utils/toast.js";
import ETransition from "@/components/etsuya/ETransition.vue";

const userStore = useUserStore();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const { t, locale, availableLocales } = useI18n();

//login info
let loginLoading = ref(false);
let userInfo = ref({
    username: '', password: ''
})

//login
const login = async () => {
    const res = await apiLogin(toRaw(userInfo.value));
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('userId', res.userId);
    userStore.userInfo.id = res.userId;
}

// progress
let progress = ref(1);
const goBack = () => {
    progress.value = Math.max(1, progress.value - 1);
}
const passwordInput = ref(null);
const goNext =  async () => {
    try {
        if(progress.value + 1 === 3){
            loginLoading.value = true;
            await login();
            setTimeout(() => {
                router.push({ name: 'Home'});
            }, 3000);
        }
        progress.value = Math.min(4, progress.value + 1)
    } catch (e){} finally {
        loginLoading.value = false;
    }
}

//hello
const hello = () => {
    apiHello().then((res) => {
        toast.add({
            type: 'success',
            title: 'Hello!',
            content: res
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
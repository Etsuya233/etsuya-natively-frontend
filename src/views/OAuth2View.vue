<template>
    <div class="flex justify-center">
        <div class="flex w-full flex-col p-4 gap-4 max-w-screen-md items-center">
            <ProgressBar mode="indeterminate" class="!h-2 !w-full" :show-value="false" />
            <div class="flex flex-col gap-4 mt-12 md:items-center w-full">
                <Logo size="lg" />
                <div class="font-bold text-5xl flex items-center md:mt-4">
                    {{t('common.loadingWithDots')}}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Logo from "@/components/natively/Logo.vue";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from 'vue-i18n'
import {onBeforeMount, onMounted, ref} from "vue";
import ProgressBar from "primevue/progressbar";
import {apiOAuth2} from "@/api/user.js";
import {useUserStore} from "@/stores/userStore.js";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { t, locale, availableLocales } = useI18n();

const login = async () => {
    const code = route.query.code;
    const owner = route.params.owner;
    try {
        let res = await apiOAuth2({
            owner: owner,
            code: code
        });
        if(res.mode === 'login'){
            localStorage.setItem('accessToken', res.loginInfo.accessToken);
            localStorage.setItem('refreshToken', res.loginInfo.refreshToken);
            localStorage.setItem('userId', res.userId);
            userStore.userInfo.id = res.userId;
            await router.push({name: 'Login', query: { completed: 'true'}});
        } else if(res.mode === 'register') {
            await router.push({name: 'Register', query: {
                    oauth2: 'true',
                    email: res.registerInfo.email,
                    nickname: res.registerInfo.nickname,
                    owner: res.registerInfo.owner,
                    ownerId: res.registerInfo.ownerId
                }});
        } else {
            router.push({ name: 'UserEdit' });
        }
    } catch (err){
        await router.push({name: 'Welcome'});
    }
}

onMounted(() => {
    login();
})

</script>

<style scoped>


</style>
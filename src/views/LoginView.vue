<template>
    <div class="flex flex-col p-4 gap-4">
        <ProgressBar class="!h-2" :value="(progress - 1) * 50" :show-value="false" />
        <div class="flex flex-col gap-4 mt-12">
            <Logo size="lg" />
            <div class="font-bold text-5xl flex items-center">
                {{t('login.login')}}
            </div>
        </div>
        <Transition name="fade" mode="out-in" class="flex flex-col mt-4 gap-4">
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
                <div class="text-center" v-if="progress !== 3">
                    <RouterLink class="text-surface-500" :to="{ name: 'Login'}">{{t('login.createAccount')}}</RouterLink>
                </div>
            </div>
            <div v-else-if="progress === 2" class="flex flex-col gap-4">
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
                    <Button class="w-full" :label="t('common.next')" @click="goNext" />
                </div>
            </div>
            <div v-else class="flex flex-col gap-4">
                <div class="font-bold text-2xl">{{t('login.loginSuccess')}}</div>
                <div class="text-surface-600">{{t('login.redirect')}}</div>
                <div class="flex">
                    <RouterLink class="w-full">
                        <Button class="w-full" :label="t('login.goToHome')" />
                    </RouterLink>
                </div>
            </div>
        </Transition>
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
import {ref} from "vue";

const { t, locale, availableLocales } = useI18n();

//login info
let userInfo = ref({
    username: '', password: ''
})

//progress
let progress = ref(1);
const goBack = () => {
    progress.value -= 1;
}
const goNext = () => {
    progress.value += 1;
}

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
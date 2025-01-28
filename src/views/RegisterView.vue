<template>
    <div class="flex justify-center">
        <div class="flex w-full flex-col p-4 gap-4 max-w-screen-md items-center">
            <ProgressBar class="!h-2 !w-full" :value="(progress - 1) * 12.5" :show-value="false" />
            <div class="flex flex-col gap-4 mt-12 md:items-center w-full">
                <Logo size="lg" />
                <div class="font-bold text-5xl flex items-center md:mt-4">
                    {{t('login.register')}}
                </div>
            </div>
            <Transition name="fade" mode="out-in" class="flex flex-col mt-4 gap-4 w-full md:mt-8 md:max-w-[28rem]">
                <div v-if="progress === 1" class="flex flex-col gap-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-envelope"></i>
                        </InputGroupAddon>
                        <FloatLabel variant="in">
                            <InputText id="email" v-model="userInfo.email" />
                            <label for="email">{{t('login.email')}}</label>
                        </FloatLabel>
                    </InputGroup>
                    <Transition name="fade" mode="out-in">
                        <Message severity="error" v-if="errMsg">{{errMsg}}</Message>
                    </Transition>
                    <div class="flex gap-2">
                        <Button class="w-full" :loading="nextLoading" :label="t('common.next')" @click="goNext" />
                    </div>
                    <Divider />
                    <ThirdPartyLogin />
                </div>
                <div v-else-if="progress === 2" class="flex flex-col gap-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-user"></i>
                        </InputGroupAddon>
                        <InputGroupAddon>
                            @
                        </InputGroupAddon>
                        <FloatLabel variant="in">
                            <InputText id="username" v-model="userInfo.username" />
                            <label for="username">{{t('login.username')}}</label>
                        </FloatLabel>
                    </InputGroup>
                    <Transition name="fade" mode="out-in">
                        <Message severity="error" v-if="errMsg">{{errMsg}}</Message>
                    </Transition>
                    <div class="flex gap-2">
                        <Button class="w-full" :label="t('common.back')" severity="secondary" @click="goBack" />
                        <Button class="w-full" :loading="nextLoading" :label="t('common.next')" @click="goNext" />
                    </div>
                    <div class="text-center">
                        <RouterLink class="text-surface-500" :to="{ name: 'Register'}">{{t('login.alreadyHaveAccount')}}</RouterLink>
                    </div>
                    <Message severity="info">
                        <div class="whitespace-pre-line">
                            {{t('login.usernameRule')}}
                        </div>
                    </Message>
                </div>
                <div v-else-if="progress === 3" class="flex flex-col gap-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-user"></i>
                        </InputGroupAddon>
                        <FloatLabel variant="in">
                            <InputText id="nickname" v-model="userInfo.nickname" />
                            <label for="nickname">{{t('login.nickname')}}</label>
                        </FloatLabel>
                    </InputGroup>
                    <Transition name="fade" mode="out-in">
                        <Message severity="error" v-if="errMsg">{{errMsg}}</Message>
                    </Transition>
                    <div class="flex gap-2">
                        <Button class="w-full" :label="t('common.back')" severity="secondary" @click="goBack" />
                        <Button class="w-full" :loading="nextLoading" :label="t('common.next')" @click="goNext" />
                    </div>
                    <Message severity="info">
                        <div class="whitespace-pre-line">
                            {{t('login.nicknameRule')}}
                        </div>
                    </Message>
                </div>
                <div v-else-if="progress === 4" class="flex flex-col gap-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-lock"></i>
                        </InputGroupAddon>
                        <FloatLabel variant="in">
                            <Password id="password" v-model="userInfo.password" />
                            <label for="password">{{t('login.password')}}</label>
                        </FloatLabel>
                    </InputGroup>
                    <Transition name="fade" mode="out-in">
                        <Message severity="error" v-if="errMsg">{{errMsg}}</Message>
                    </Transition>
                    <div class="flex gap-2">
                        <Button class="w-full" :label="t('common.back')" severity="secondary" @click="goBack" />
                        <Button class="w-full" :loading="nextLoading" :label="t('common.next')" @click="goNext" />
                    </div>
                    <Message severity="info">
                        <div class="whitespace-pre-line">
                            {{t('login.passwordRule')}}
                        </div>
                    </Message>
                </div>
                <div v-else-if="progress === 5" class="flex flex-col gap-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-lock"></i>
                        </InputGroupAddon>
                        <FloatLabel variant="in">
                            <Password id="rePassword" v-model="userInfo.rePassword" :feedback="false" />
                            <label for="rePassword">{{t('login.reenterYourPassword')}}</label>
                        </FloatLabel>
                    </InputGroup>
                    <Transition name="fade" mode="out-in">
                        <Message severity="error" v-if="errMsg">{{errMsg}}</Message>
                    </Transition>
                    <div class="flex gap-2">
                        <Button class="w-full" :label="t('common.back')" severity="secondary" @click="goBack" />
                        <Button class="w-full" :loading="nextLoading" :label="t('common.next')" @click="goNext" />
                    </div>
                    <Message severity="info">
                        <div class="whitespace-pre-line">
                            {{t('login.rePasswordRule')}}
                        </div>
                    </Message>
                </div>
                <div v-else-if="progress === 6" class="flex flex-col gap-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-globe"></i>
                        </InputGroupAddon>
                        <FloatLabel variant="in">
                            <Select id="location" v-model="userInfo.location" :options="location" optionLabel="name"
                                    optionValue="code" :loading="locationLoading" filter />
                            <label for="location">{{t('login.locationOrCountry')}}</label>
                        </FloatLabel>
                    </InputGroup>
                    <div class="flex gap-2">
                        <Button class="w-full" :label="t('common.back')" severity="secondary" @click="goBack" />
                        <Button class="w-full" :loading="nextLoading" :label="t('common.next')" @click="goNext" />
                    </div>
                    <Message severity="info">
                        <div class="whitespace-pre-line">
                            {{t('login.nicknameRule')}}
                        </div>
                    </Message>
                </div>
                <div v-else-if="progress === 7" class="flex flex-col gap-4">
                    <div class="">{{t('login.chooseLanguage')}}</div>
                    <Button :label="t('login.addALanguage')" icon="pi pi-plus" @click="addLanguage" />
                    <div v-if="userInfo.language.length > 0" class="flex flex-col gap-2">
                        <div v-for="(item, index) in userInfo.language" :key="item.code">
                            <div class="relative overflow-hidden border rounded-lg border-surface" :class="item.native? {'bg-primary-50': true, 'dark:bg-primary-900': true}: {}" >
                                <div class="px-4 py-2 border-surface-200 mb-1 flex gap-4 items-center">
                                    <div class="text-3xl">🇫🇷</div>
                                    <div class="font-bold text-xl">{{lang.find((ele) => ele.code === item.language).name}}</div>
                                    <Button @click="editLanguage(index)" class="ml-auto" icon="pi pi-pencil" severity="secondary" />
                                    <Button @click="deleteLanguage(index)" icon="pi pi-trash" severity="secondary" />
                                </div>
                                <div class="absolute left-0 bottom-0 border-primary-500 border-2 w-full" :style="languageProficiencyStyle(item.proficiency)"></div>
                            </div>
                        </div>
                    </div>
                    <Transition name="fade" mode="out-in">
                        <Message severity="error" v-if="errMsg">{{errMsg}}</Message>
                    </Transition>
                    <div class="flex gap-2">
                        <Button class="w-full" :label="t('common.back')" severity="secondary" @click="goBack" />
                        <Button class="w-full" :loading="nextLoading" :label="t('common.next')" @click="goNext" />
                    </div>
                    <Message severity="info">
                        <div class="whitespace-pre-line">
                            {{t('login.languageRule')}}
                        </div>
                    </Message>
                </div>
                <div v-else-if="progress === 9" class="flex flex-col gap-4">
                    <div class="font-bold text-2xl">{{t('login.registerSuccess')}}</div>
                    <div class="text-surface-600">{{t('login.redirect')}}</div>
                    <div class="flex">
                        <RouterLink class="w-full" :to="{ name: 'Home'}">
                            <Button class="w-full" :label="t('login.goToHome')" />
                        </RouterLink>
                    </div>
                </div>
            </Transition>
        </div>
        <Dialog class="min-w-80 max-w-[95%]" v-model:visible="addLangDialog" modal :header="langEditing >= 0? t('common.edit'): t('login.addALanguage')">
            <div class="mb-4 flex flex-col gap-2">
                <Select v-if="langEditing === -1" id="lang" class="w-full" v-model="addingLanguage.language" :placeholder="t('common.language')" :options="selectableLang" optionLabel="name" optionValue="code"/>
                <div class="border border-surface p-4 rounded-lg flex items-center">
                    <div>{{t('login.proficiency')}}</div>
                    <div class="ml-auto"><Rating v-model="addingLanguage.proficiency" /></div>
                </div>
                <div class="border border-surface p-4 rounded-lg flex items-center">
                    <div>{{t('login.native')}}</div>
                    <div class="ml-auto"><Checkbox v-model="addingLanguage.native" binary /></div>
                </div>
                <Message severity="info">
                    <div class="whitespace-pre-line">
                        {{t('login.languageProficiencyInfo')}}
                    </div>
                </Message>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" :label="t('common.cancel')" severity="secondary" @click="addLangDialog = false"></Button>
                <Button type="button" :label="langEditing === -1? t('common.add'): t('common.save')" @click="updateLangList" :disabled="!addingLanguage.language"></Button>
            </div>
        </Dialog>
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
import {computed, onBeforeMount, onMounted, ref, toRaw} from "vue";
import {apiEmailUnique, apiLogin, apiRegister, apiUsernameUnique} from "@/api/user.js";
import {useToast} from 'primevue/usetoast';
import {useToastStore} from "@/stores/toastStore.js";
import Divider from 'primevue/divider';
import Fieldset from 'primevue/fieldset';
import {emailRegex, nicknameRegex, passwordRegex, usernameRegex} from "@/utils/regex.js";
import Message from 'primevue/message';
import Select from 'primevue/select';
import Dialog from "primevue/dialog";
import Rating from "primevue/rating";
import Checkbox from 'primevue/checkbox';
import ThirdPartyLogin from "@/components/natively/ThirdPartyLogin.vue";
import {useRoute, useRouter} from "vue-router";
import {useLanguageStore} from "@/stores/languageStore.js";

const toast = useToast();
const toastStore = useToastStore();
const languageStore = useLanguageStore();
const { t, locale, availableLocales } = useI18n();
const route = useRoute();
const router = useRouter();

//register info
let userInfo = ref({
    username: '', nickname: '', email: '', password: '', rePassword: '', gender: '', location: '',
    language: [], owner: null, ownerId: null
})

//langs
let langLoading = ref(false);
let lang = languageStore.languageData;
let selectableLang = computed(() => {
    return lang.value.filter((item) => {
        let ul = userInfo.value.language.find((ele) => {
            return ele.language === item.code;
        });
        return ul === undefined;
    });
})
let addLangDialog = ref(false);
let langEditing = ref(-1);
let addingLanguage = ref({
    language: '', proficiency: 3, native: false
});
const updateLangList = () => {
    if(langEditing.value !== -1){
        userInfo.value.language[langEditing.value].language = addingLanguage.value.language;
        userInfo.value.language[langEditing.value].proficiency = addingLanguage.value.proficiency;
        userInfo.value.language[langEditing.value].native = addingLanguage.value.native;
    } else {
        if(addingLanguage.value.language){
            userInfo.value.language.push({ ...addingLanguage.value });
        }
    }
    addingLanguage.value.language = '';
    addingLanguage.value.proficiency = 3;
    addingLanguage.value.native = false;
    addLangDialog.value = false;
}
const languageProficiencyStyle = (num) => {
    return {
        width: num * 20 + '%'
    }
}
const deleteLanguage = (index) => {
    userInfo.value.language.splice(index, 1);
}
const addLanguage = () => {
    langEditing.value = -1;
    addLangDialog.value = true;
}
const editLanguage = (index) => {
    langEditing.value = index;
    addLangDialog.value = true;
    let obj = userInfo.value.language[index];
    addingLanguage.value.language = obj.language;
    addingLanguage.value.proficiency = obj.proficiency;
    addingLanguage.value.native = obj.native;
}
apiGetLanguages().then((res) => {
    lang.value.splice(0, location.value.length);
    lang.value.push(... res);
}).catch(err => console.log(err))
    .finally(() => langLoading.value = false);

//progress and validation
let progress = ref(1);
let errMsg = ref('');
let nextLoading = ref(false);
const goBack = () => {
    errMsg.value = '';
    progress.value = Math.max(1, progress.value - 1);
}
const goNext = async () => {
    nextLoading.value = true;
    errMsg.value = '';
    if(progress.value === 1){
        if(!emailRegex.test(userInfo.value.email)){
            errMsg.value = t('login.emailContentLimit');
        } else {
            try {
                let res = await apiEmailUnique(userInfo.value.email);
                if(!res) errMsg.value = t('login.emailTaken');
            } catch (e){
                errMsg.value = t('common.error');
            }
        }
    } else if(progress.value === 2){ //username
        if(userInfo.value.username.length < 6 || userInfo.value.username.length > 20){
            errMsg.value = t('login.usernameDigitLimit');
        } else if(!usernameRegex.test(userInfo.value.username)){
            errMsg.value = t('login.usernameContentLimit');
        } else {
            try {
                let res = await apiUsernameUnique(userInfo.value.username);
                if(!res) errMsg.value = t('login.usernameTaken');
            } catch (err){
                errMsg.value = t('common.error');
            }
        }
    } else if(progress.value === 3){
        if(userInfo.value.nickname.length < 6 || userInfo.value.nickname.length > 64){
            errMsg.value = t('login.nicknameDigitLimit');
        } else if(!nicknameRegex.test(userInfo.value.nickname)){
            errMsg.value = t('login.nicknameContentLimit');
        }
    } else if(progress.value === 4){
        if(userInfo.value.password.length < 6 || userInfo.value.password.length > 32){
            errMsg.value = t('login.passwordDigitLimit');
        } else if(!passwordRegex.test(userInfo.value.password)){
            errMsg.value = t('login.passwordContentLimit');
        }
    } else if(progress.value === 5){
        if(lang.value.length < 2){
            langLoading.value = true;
        }
        if(userInfo.value.password !== userInfo.value.rePassword){
            errMsg.value = t('login.rePasswordContentLimit')
        }
    } else if(progress.value === 6){
        if(userInfo.value.language.length === 0){
            errMsg.value = t('login.languageContentLimit');
        }
        if(!errMsg.value){
            try {
                progress.value = Math.min(8, progress.value + 1)
                let res = await apiRegister(toRaw(userInfo.value));
            } catch (err){
                progress.value = Math.max(1, progress.value - 1);
                errMsg.value = t('common.error');
            }
        }
    }
    nextLoading.value = false;
    if(errMsg.value.length > 0){
        return;
    }
    progress.value = Math.min(8, progress.value + 1)
}

//lifespan
onBeforeMount(() => {
    if(route.query.oauth2){
        userInfo.value.email = route.query.email;
        userInfo.value.nickname = route.query.nickname;
        userInfo.value.owner = route.query.owner;
        userInfo.value.ownerId = route.query.ownerId;
    }
})

onMounted(() => {
    if(route.query.oauth2){
        toastStore.add({
            severity: 'success',
            summary: t('login.continueYourRegistration'),
            life: 3000
        })
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
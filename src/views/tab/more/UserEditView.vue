<template>
    <div class="w-full">
        <e-header class="sticky top-0 z-20" :title="t('more.editProfile')" />
        <ProgressBar v-if="firstLoading" mode="indeterminate" class="!h-2" />
        <div v-else class="w-full p-4 flex flex-col gap-4">
            <EList icon="pi pi-user" :title="t('user.basicInformation')">
                <EListInput :title="t('user.username')" v-model="userInfo.username" />
                <EListInput :title="t('user.nickname')" v-model="userInfo.nickname" />
                <EListInput :title="t('user.bio')" v-model="userInfo.bio" />
                <EListInput :title="t('user.email')" v-model="userInfo.email" />
                <EListItem enable-slot @click="avatarClicked" :class="{ 'cursor-not-allowed': avatarLoading }" >
                    <div class="flex items-center">
                        <div>{{t('user.avatar')}}</div>
                        <div class="ml-auto h-10 w-10">
                            <img v-if="!avatarLoading" class="rounded-full" :src="userInfo.avatar" alt="Avatar" />
                            <Skeleton v-else size="2.5rem" shape="circle" />
                        </div>
                    </div>
                </EListItem>
            </EList>
            <EList icon="pi pi-language" :title="t('user.language')">
                <EListItem class="relative" enable-slot v-for="(item, index) in userInfo.languages" :key="item.code">
                    <div class="mb-1 flex items-center">
                        <div class="font-bold text-lg">{{lang.find((ele) => ele.code === item.language).name}}</div>
                        <Button size="small" text @click="editLanguage(index)" class="ml-auto" icon="pi pi-pencil" severity="secondary" />
                        <Button size="small" text @click="deleteLanguage(index)" icon="pi pi-trash" severity="secondary" />
                    </div>
                    <div class="absolute left-0 bottom-0 border-primary-500 border-2 w-full" :style="languageProficiencyStyle(item.proficiency)"></div>
                </EListItem>
            </EList>
            <Button class="!rounded-2xl" severity="secondary" icon="pi pi-plus" :label="t('user.addLanguage')" @click="addLanguage" />
            <div class="sticky bottom-[4.5rem] md:bottom-4">
                <Button @click="updateUserInfo" :loading="userInfoUpdating" class="!rounded-2xl w-full shadow-2xl" severity="primary" :label="t('user.save')" icon="pi pi-save" />
            </div>
            <Divider />
            <EList icon="pi pi-link" :title="t('user.linkedAccount')">
                <EListItem enable-slot v-for="item in linkedServices">
                    <div class="flex items-center gap-4">
                        <div :class="item.icon" class="flex-shrink-0"></div>
                        <div class="text-ellipsis overflow-hidden break-words">{{item.name}} {{item.linked? `(${item.label})`: ''}}</div>
                        <div v-if="item.linked" class="ml-auto hover:underline flex-shrink-0 text-red-700" @click="unlinkAccount(item)">{{t('user.unlink')}}</div>
                        <div v-else class="ml-auto flex-shrink-0 hover:underline" @click="linkAccount(item.link)">{{t('user.link')}}</div>
                    </div>
                </EListItem>
            </EList>
            <Divider />
            <EList icon="pi pi-key" :title="t('user.password')">
                <EListInput :title="t('user.oldPassword')" v-model="passwordData.oldPassword" :attr="{ autocomplete: 'current-password' }" />
                <EListInput :title="t('user.newPassword')" v-model="passwordData.newPassword" :attr="{ autocomplete: 'new-password' }" />
                <EListInput :title="t('user.confirmNewPassword')" v-model="passwordData.confirmNewPassword" :attr="{ autocomplete: 'new-password' }" />
            </EList>
            <EListItem v-if="passwordData.error" rounded enable-slot danger>
                {{ passwordData.error }}
            </EListItem>
            <Button class="!rounded-2xl shadow-2xl" :loading="passwordData.loading" icon="pi pi-reload" :label="t('user.update')" @click="changePassword" />
        </div>
        <Dialog class="min-w-80 max-w-[95%]" v-model:visible="addLangDialog" modal :header="langEditing >= 0? t('common.edit'): t('login.addALanguage')">
            <div class="mb-4 flex flex-col gap-2">
                <Select v-if="langEditing === -1" id="lang" class="w-full" v-model="addingLanguage.language" :placeholder="t('common.language')" :options="selectableLang" optionLabel="name" optionValue="code"/>
                <div class="border border-surface p-4 rounded-lg flex items-center">
                    <div>{{t('login.proficiency')}}</div>
                    <div class="ml-auto"><Rating v-model="addingLanguage.proficiency" /></div>
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
        <input ref="avatarUploader" class="hidden" type="file" accept="image/*" @input="imageSelected" />
    </div>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import EHeader from "@/components/etsuya/EHeader.vue";
import EList from "@/components/etsuya/EList.vue";
import EListItem from "@/components/etsuya/EListItem.vue";
import EListInput from "@/components/etsuya/EListInput.vue";
import {computed, onBeforeMount, ref} from "vue";
import {cloneDeep} from "lodash";
import {useUserStore} from "@/stores/userStore.js";
import Button from "primevue/button";
import {useLanguageStore} from "@/stores/languageStore.js";
import Rating from "primevue/rating";
import Select from "primevue/select";
import Dialog from "primevue/dialog";
import Message from "primevue/message";
import Skeleton from "primevue/skeleton";
import ProgressBar from "primevue/progressbar";
import {giteeOauthLink, githubOauthLink, googleOauthLink} from "@/utils/oauth.js";
import {
    apiChangePassword,
    apiGetUserLinkedAccounts,
    apiModifyUser,
    apiOauthUnlink,
    apiUserAvatarUpload
} from "@/api/user.js";
import {useToast} from "@/utils/toast.js";
import Divider from "primevue/divider";
import {passwordRegex} from "@/utils/regex.js";
import {useRouter} from "vue-router";

const { t, locale, availableLocales } = useI18n();
const userStore = useUserStore();
const languageStore = useLanguageStore();
const toast = useToast();
const router = useRouter();

// password
const passwordData = ref({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    error: '',
    loading: false,
})
const changePassword = async () => {
    if(passwordData.value.newPassword !== passwordData.value.confirmNewPassword){
        passwordData.value.error = t('user.newPasswordNotMatch');
    } else if(!passwordRegex.test(passwordData.value.newPassword)){
        passwordData.value.error = t('login.passwordContentLimit');
    }
    if(!passwordData.value.error){
        passwordData.value.loading = true;
        try{
            await apiChangePassword(passwordData.value.oldPassword, passwordData.value.newPassword);
            toast.add({
                content: t('user.changePasswordSuccessPrompt'),
            });
            setTimeout(() => {
                router.push({ name: 'Welcome'});
            }, 500);
        } catch (e) {} finally {
            passwordData.value.loading = false;
        }
    }
}

// userInfo
const firstLoading = ref(true);
const userInfo = ref(cloneDeep(userStore.userInfo));
const userInfoUpdating = ref(false);
const updateUserInfo = () => {
    userInfoUpdating.value = true;
    const updatedUserInfo = cloneDeep(userInfo.value);
    apiModifyUser(updatedUserInfo).then(() => {
        toast.add({
            type: 'success',
            title: t('user.userInfoUpdated'),
        });
    }).catch((e) => {}).finally(() => {
        userInfoUpdating.value = false;
    })
}

// avatar
const avatarLoading = ref(false);
const avatarUploader = ref(null);
const avatarClicked = () => {
    if(avatarLoading.value){
        toast.add({
            type: 'warning',
            timeout: 1200,
            content: t('user.avatarIsUploading')
        })
        return;
    }
    avatarUploader.value.click();
}
const imageSelected = async (event) => {
    if(event.target.files.length === 0){
        return;
    }
    avatarLoading.value = true;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);
    try {
        userInfo.value.avatar = await apiUserAvatarUpload(formData);
    } catch (e) {
        console.log(e);
    } finally {
        avatarLoading.value = false;
    }
}

// linked
const linkedServices = ref([
    { owner: 'google', name: 'Google', icon: 'pi pi-google', link: googleOauthLink},
    { owner: 'github', name: 'GitHub' , icon: 'pi pi-github', link: githubOauthLink },
    { owner: 'gitee', name: 'Gitee' , icon: 'pi pi-cog', link: giteeOauthLink},
])
const linkAccount = (link) => {
    location.href = link;
}
const unlinkAccount = (item) => {
    apiOauthUnlink(item.owner).then(() => {
        item.linked = false;
    })
}

// lang
const lang = ref(cloneDeep(languageStore.languageData));
const languageProficiencyStyle = (num) => {
    return {
        width: num * 20 + '%'
    }
}
let selectableLang = computed(() => {
    return lang.value.filter((item) => {
        let ul = userInfo.value.languages.find((ele) => {
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
        userInfo.value.languages[langEditing.value].language = addingLanguage.value.language;
        userInfo.value.languages[langEditing.value].proficiency = addingLanguage.value.proficiency;
        userInfo.value.languages[langEditing.value].native = addingLanguage.value.native;
    } else {
        if(addingLanguage.value.language){
            userInfo.value.languages.push({ ...addingLanguage.value });
        }
    }
    addingLanguage.value.language = '';
    addingLanguage.value.proficiency = 3;
    addingLanguage.value.native = false;
    addLangDialog.value = false;
}
const deleteLanguage = (index) => {
    userInfo.value.languages.splice(index, 1);
}
const addLanguage = () => {
    langEditing.value = -1;
    addLangDialog.value = true;
}
const editLanguage = (index) => {
    langEditing.value = index;
    addLangDialog.value = true;
    let obj = userInfo.value.languages[index];
    addingLanguage.value.language = obj.language;
    addingLanguage.value.proficiency = obj.proficiency;
    addingLanguage.value.native = obj.native;
}

// lifespan
onBeforeMount(async () => {
    firstLoading.value = true;
    let res = await userStore.update();
    userInfo.value = {... res};
    res = await apiGetUserLinkedAccounts();
    userInfo.value.linkedAccounts = res;
    res.forEach((item) => {
        let obj = linkedServices.value.find((item2) => item.owner === item2.owner);
        obj.linked = true;
        obj.label = item.label;
    })
    firstLoading.value = false;
})

</script>

<style scoped>

</style>
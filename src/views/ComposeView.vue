<template>
    <div class="">
        <EHeader class="top-0 sticky" title="Compose" />
        <div class="w-full p-4 flex flex-col gap-2">
            <div class="w-full flex flex-col gap-1">
                <div class="flex items-center gap-2 *:text-surface-500 text-sm">
                    <div class="">Title</div>
                    <div @click="showTitleHelp" class="pi pi-info-circle cursor-pointer"></div>
                    <Popover ref="titlePopover">
                        {{t('post.titleRule')}}
                    </Popover>
                </div>
                <InputText v-model="postInfo.title" />
            </div>
            <div class="flex w-full flex-col gap-1">
                <div class="flex items-center gap-2 *:text-surface-500 text-sm">
                    <div class="">Type</div>
                    <div class="pi pi-info-circle cursor-pointer" @click="showTypeHelp"></div>
                </div>
                <SelectButton class="flex-1" v-model="postInfo.type" :options="postType" option-label="name" option-value="value"
                pt:root:class="*:w-full" />
                <Popover ref="typePopover">
                    {{t('post.typeRule')}}
                </Popover>
            </div>
            <div class="flex w-full flex-col gap-1">
                <div class="flex items-center gap-2 *:text-surface-500 text-sm">
                    <div class="">Content</div>
                    <div class="pi pi-info-circle cursor-pointer" @click="showContentHelp"></div>
                </div>
                <div class="w-full h-[24rem]">
                    <EEditor id="post-comment" ref="editor" :placeholder="t('post.postPlaceholder')" />
                </div>
                <Popover ref="contentPopover">
                    {{t('post.contentRule')}}
                </Popover>
            </div>
            <div class="flex md:hidden justify-end gap-2">
                <Button :badge="images.length.toString()" badgeSeverity="contrast" icon="pi pi-image" size="small" severity="secondary" @click="openImageDialog" />
                <Button icon="pi pi-microphone" size="small" severity="secondary" @click="openVoiceDialog"/>
                <Button :label="t('post.comment')" size="small" @click="submitPost" />
            </div>
            <div class="hidden md:flex justify-end gap-2">
                <Button :badge="images.length.toString()" badgeSeverity="contrast" :label="t('post.addImage')" size="small" severity="secondary" @click="openImageDialog" />
                <Button :label="t('post.addVoice')" size="small" severity="secondary" @click="openVoiceDialog"/>
                <Button :label="t('post.comment')" size="small" @click="submitPost" />
            </div>
        </div>
        <Dialog v-model:visible="imageDialogVisible" modal :header="t('post.addImage')" class="min-w-80 md:min-w-[30rem]">
            <ImageUploader :images="images" :image-src="imageSrc" />
        </Dialog>
    </div>
</template>

<script setup>
import 'vditor/dist/index.css';
import {ref, toRaw} from "vue";
import Button from "primevue/button";
import {useI18n} from "vue-i18n";
import EEditor from "@/components/logo/EEditor.vue";
import InputText from 'primevue/inputtext';
import EHeader from "@/components/logo/EHeader.vue";
import SelectButton from "primevue/selectbutton";
import Popover from 'primevue/popover';
import {useToastStore} from "@/stores/toastStore.js";
import {apiCreatePost} from "@/api/post.js";
import {useRouter} from "vue-router";
import Dialog from "primevue/dialog";
import ImageUploader from "@/components/ImageUploader.vue";

const toastStore = useToastStore();
const { t, locale, availableLocales } = useI18n();
const editor = ref();
const router = useRouter();

//info
let postInfo = ref({
    title: '',
    type: 1,
    content: ''
})
let images = ref([]);
let imageSrc = ref([]);
let voice = ref(null);
const imageDialogVisible = ref(false);
const openImageDialog = () => {
    imageDialogVisible.value = true;
}
const openVoiceDialog = () => {

}

//editor
const getContent = () => {
    postInfo.value.content = editor.value.getValue();
}

//send post
const submitPostOld = async () => {
    getContent();
    let errMsg = null;
    if(postInfo.value.type !== 1 && postInfo.value.title === ''){
        errMsg = t('post.titleNotEmpty');
    } else if([...postInfo.value.title].length > 255){
        errMsg = t('post.titleLengthLimit');
    } else if([...postInfo.value.content].length > 65535){
        errMsg = t('post.contentLengthLimit');
    }
    if(errMsg){
        toastStore.add({
            severity: "error",
            summary: t('common.error'),
            detail: errMsg,
            life: 3000
        });
        return;
    }
    try {
        let res = await apiCreatePost(toRaw(postInfo.value));
        console.log(res);
        await router.push({ name: 'Post', params: {id: res}});
    } catch (e){}
}
const submitPost = async () => {
    getContent();
    let errMsg = null;
    if(postInfo.value.type !== 1 && postInfo.value.title === ''){
        errMsg = t('post.titleNotEmpty');
    } else if([...postInfo.value.title].length > 255){
        errMsg = t('post.titleLengthLimit');
    } else if([...postInfo.value.content].length > 65535){
        errMsg = t('post.contentLengthLimit');
    }
    if(errMsg){
        toastStore.add({
            severity: "error",
            summary: t('common.error'),
            detail: errMsg,
            life: 3000
        });
        return;
    }
    try {
        let formData = new FormData();
        formData.append("title", postInfo.value.title);
        formData.append("type", postInfo.value.type);
        formData.append("content", postInfo.value.content);
        images.value.forEach((item) => {
            formData.append("images", item);
            console.log(item); //输出了图片，但是
        })
        let res = await apiCreatePost(formData);
        console.log(res);
        await router.push({ name: 'Post', params: {id: res}});
    } catch (e){}
}

//type select
const postType = ref([
    { name: 'Normal', value: 1 },
    { name: 'Question', value: 2 }
]);

//help
const titlePopover = ref();
const showTitleHelp = (event) => {
    titlePopover.value.toggle(event);
}
const typePopover = ref();
const showTypeHelp = (event) => {
    typePopover.value.toggle(event);
}
const contentPopover = ref();
const showContentHelp = (event) => {
    contentPopover.value.toggle(event);
}


</script>

<style scoped>

</style>
<template>
    <div class="w-full">
        <EHeader class="sticky top-0 z-10" :title="t('post.question')" />
        <div class="w-full p-4">
            <div class="w-full flex">
                <textarea v-model="title" ref="textarea" class="w-full text-xl font-bold outline-none" placeholder="Title"></textarea>
            </div>
            <Divider />
            <div class="w-full flex h-[25rem]">
                <EEditor :placeholder="t('post.addAComment')" ref="editor"/>
            </div>
            <Divider />
            <div class="flex md:hidden justify-end gap-2 sticky bottom-16 *:shadow">
                <Button :badge="images.length === 0? '': images.length.toString()" badgeSeverity="contrast" icon="pi pi-image" size="small" severity="secondary" @click="openImageDialog" />
                <Button :badge="voice? '1': ''" badgeSeverity="contrast" icon="pi pi-microphone" size="small" severity="secondary" @click="openVoiceDialog"/>
                <Button icon="pi pi-send" size="small" @click="postNormal" />
            </div>
            <div class="hidden md:flex justify-end gap-2 sticky bottom-16 *:shadow">
                <Button :badge="images.length === 0? '': images.length.toString()" badgeSeverity="contrast" :label="t('post.addImage')" size="small" severity="secondary" @click="openImageDialog" />
                <Button :badge="voice? '1': ''" badgeSeverity="contrast" :label="t('post.addVoice')" size="small" severity="secondary" @click="openVoiceDialog"  />
                <Button :label="t('post.post')" size="small" @click="postNormal" />
            </div>
            <Dialog v-model:visible="imageDialogVisible" modal :header="t('post.addImage')" class="min-w-80 md:min-w-[30rem]">
                <ImageUploader :images="images" :image-src="imageSrc" />
            </Dialog>
            <Dialog v-model:visible="voiceDialogVisible" modal :header="t('post.addVoice')" class="min-w-80 max-w-[35rem]">
                <VoiceRecorder v-model:value="voice" v-model:url="voiceUrl" />
            </Dialog>
        </div>
    </div>
</template>

<script setup>
import EHeader from "@/components/logo/EHeader.vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/stores/userStore.js";
import Divider from "primevue/divider";
import {onBeforeUnmount, onMounted, ref} from "vue";
import Button from "primevue/button";
import ImageUploader from "@/components/ImageUploader.vue";
import VoiceRecorder from "@/components/VoiceRecorder.vue";
import Dialog from "primevue/dialog";
import {apiCreatePost} from "@/api/post.js";
import EEditor from "@/components/logo/EEditor.vue";

const route = useRoute();
const router = useRouter();
const { t, locale, availableLocales } = useI18n();

const userStore = useUserStore();

const textarea = ref();
const editor = ref();
const title = ref();
const content = ref('');

//add images
let images = ref([]);
let imageSrc = ref([]); //used for preview
let imageDialogVisible = ref(false);
const openImageDialog = () => {
    imageDialogVisible.value = true;
}

//add voice
let voice = ref();
let voiceUrl = ref();
let voiceDialogVisible = ref(false);
const openVoiceDialog = () => {
    voiceDialogVisible.value = true;
}

//post normal
const postNormal = async () => {
    //TODO validation
    try {
        content.value = editor.value.getValue();
        let formData = new FormData();
        formData.append("type", '3'); //normal type
        formData.append("content", content.value);
        formData.append("title", title.value);
        images.value.forEach((item) => {
            formData.append("images", item);
        })
        if(voice.value !== null && voice.value){
            formData.append(`voice`, voice.value);
        }
        let res = await apiCreatePost(formData);
        await router.push({ name: 'Post', params: {id: res}});
    } catch (e){}
}


//lifespan
const heightHandler = (e) => {
    e.target.style.height = e.target.scrollHeight + "px";
}

onMounted(() => {
    //textarea auto growing TODO auto shrinking
    textarea.value.style.height = '1.75rem';
    textarea.value.addEventListener("input", heightHandler);
})

onBeforeUnmount(() => {
     textarea.value.removeEventListener("input", heightHandler);
})
</script>

<style scoped>

</style>
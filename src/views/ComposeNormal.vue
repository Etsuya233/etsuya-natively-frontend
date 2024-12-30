<template>
    <div class="w-full">
        <EHeader class="sticky top-0 z-10" :title="t('post.normal')" />
        <div class="w-full p-4">
            <div class="w-full flex">
                <div>
                    <div class="h-10 w-10 rounded-full overflow-hidden sticky top-[4.5rem]">
                        <img :src="userStore.userInfo.avatar" alt="avatar"/>
                    </div>
                </div>
                <div class="flex-1 pl-3 mt-[0.45rem]">
                    <textarea @input="textareaKeyDown" v-model="content" ref="textarea" class="w-full text-lg outline-none" placeholder="What's happening..."></textarea>
                </div>
            </div>
            <Divider />
            <div class="flex md:hidden justify-end gap-2 sticky bottom-16 drop-shadow-2xl">
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

const route = useRoute();
const router = useRouter();
const { t, locale, availableLocales } = useI18n();

const userStore = useUserStore();

const textarea = ref();
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
        let formData = new FormData();
        formData.append("type", '1'); //normal type
        formData.append("content", content.value);
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

const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
const textAreaMinHeight = 7 * rootFontSize;
const textareaKeyDown = (e) => {
    e.target.style.height = '1px';
    let height = e.target.scrollHeight;
    e.target.style.height = Math.max(height, textAreaMinHeight) + 'px';
}

//lifespan
const heightHandler = (e) => {
    e.target.style.height = e.target.scrollHeight + "px";
}

onMounted(() => {
    //textarea auto growing TODO auto shrinking
    textarea.value.style.height = '7rem';
    // textarea.value.addEventListener("input", heightHandler)
})

onBeforeUnmount(() => {
    // textarea.value.removeEventListener("input", heightHandler)
})

</script>

<style scoped>

</style>
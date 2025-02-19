<template>
    <div class="w-full">
        <div class="w-full">
            <div class="w-full">
                <ETextarea v-model="content" :placeholder="t('composeComment.placeholder')" />
                <div class="w-full mt-2" v-if="compareChange.length > 0">
                    <span v-for="d in compareChange"
                          class="font-bold rounded select-text"
                          :class="{ 'bg-red-200': d.removed, 'text-red-500': d.removed, 'bg-primary-100': d.added, 'text-primary-700': d.added }">
                                {{ d.value }}
                    </span>
                </div>
                <div class="w-full mt-2" v-if="imagePreview">
                    <img :src="imagePreview" class="w-full max-h-[20rem] rounded-xl border object-cover" alt="image"/>
                </div>
                <div class="w-full mt-2" v-if="voicePreview">
                    <audio :src="voicePreview" controls />
                </div>
            </div>
            <div class="sticky w-full bottom-0 mt-4">
                <div class="flex px-2 gap-2 py-1 border rounded-xl bg-blur border-surface
                *:px-2 *:py-1 *:!text-lg *:rounded-lg *:transition-colors hover:*:bg-slate-100 hover:dark:*:bg-surface-600">
                    <div class="pi pi-image" @click="imageMenuVisible = true"></div>
                    <div class="pi pi-microphone" @click="voiceMenuVisible = true"></div>
                    <div class="pi pi-arrow-right-arrow-left" @click="compareMenuVisible = true"></div>
                    <div class="pi pi-send ml-auto" @click="send()"></div>
                </div>
            </div>
            <VoiceRecorder
                    ref="voiceRecorder"
                    v-model:url="voiceTempUrl"
                    v-model:value="voiceTemp"
                    :enable-send="true"
                    @send="voiceRecorded" />
            <input class="hidden" accept="image/*" ref="imageUploader" type="file" @input="uploadImage($event)" />
            <input class="hidden" accept="audio/*" ref="voiceUploader" type="file" @input="uploadVoice($event)" />
        </div>
        <Drawer v-model:visible="sending"
                :header="t('editor.posting')"
                :dismissable="false"
                :showCloseIcon="false"
                position="bottom"
                class="!rounded-t-2xl !z-20 !h-auto !max-h-[90dvh] !max-w-[35rem]">
            <ProgressBar :show-value="false" mode="indeterminate" />
        </Drawer>
        <Drawer v-model:visible="imageMenuVisible"
                position="bottom"
                class="rounded-t-2xl !h-auto"
                :header="t('composeComment.imageMenu')">
            <EList>
                <EListItem v-if="!imagePreview" icon="pi-plus" :title="t('composeComment.add')" @click="addImage" />
                <EListItem v-else icon="pi-refresh" :title="t('composeComment.change')" @click="addImage" />
                <EListItem icon="pi-trash" :title="t('composeComment.delete')" @click="deleteImage" />
            </EList>
        </Drawer>
        <Drawer v-model:visible="voiceMenuVisible" position="bottom" class="rounded-t-2xl !h-auto" :header="t('composeComment.voiceMenu')">
            <EList>
                <EListItem icon="pi-microphone" :title="t('composeComment.record')" @click="recordVoice" />
                <EListItem icon="pi-plus" :title="t('composeComment.upload')" @click="uploadVoiceClick" />
                <EListItem icon="pi-trash" :title="t('composeComment.delete')" @click="deleteVoice"/>
            </EList>
        </Drawer>
        <Drawer v-model:visible="compareMenuVisible" position="bottom" class="rounded-t-2xl !h-auto" :header="t('composeComment.compareMenu')">
            <EList>
                <EListItem v-if="compareChange.length === 0" icon="pi-plus" :title="t('composeComment.add')" @click="addCompare" />
                <EListItem v-else icon="pi-refresh" :title="t('composeComment.change')" @click="addCompare" />
                <EListItem icon="pi-trash" :title="t('composeComment.delete')" @click="deleteCompare" />
            </EList>
        </Drawer>
        <Drawer v-model:visible="compareDetailVisible" position="bottom" class="rounded-t-2xl !h-auto" :header="t('composeComment.compare')">
            <EList class="mb-4">
                <EListItem :enable-slot="true">
                    <div class="w-full">
                        <div>{{ t('composeComment.compareOutput') }}</div>
                        <div>
                            <span v-for="d in compareTempChange"
                                  class="font-bold rounded select-text"
                                  :class="{ 'bg-red-200': d.removed, 'text-red-500': d.removed, 'bg-primary-100': d.added, 'text-primary-700': d.added }">
                                {{ d.value }}
                            </span>
                        </div>
                    </div>
                </EListItem>
            </EList>
            <EList class="mb-4">
                <EListItem :enable-slot="true">
                    <div class="w-full">
                        <div>{{ t('composeComment.compareOldValue') }}</div>
                        <ETextarea v-model="compareTempOldValue" @inputHandler="compareTempChanged" />
                    </div>
                </EListItem>
                <EListItem :enable-slot="true">
                    <div class="w-full">
                        <div>{{ t('composeComment.compareNewValue') }}</div>
                        <ETextarea v-model="compareTempNewValue" @inputHandler="compareTempChanged" />
                    </div>
                </EListItem>
            </EList>
            <EList>
                <EListItem icon="pi-check" :title="t('composeComment.confirm')" @click="confirmCompare" />
            </EList>
        </Drawer>
    </div>
</template>

<script setup>
import EHeader from "@/components/etsuya/EHeader.vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/stores/userStore.js";
import {computed, onBeforeMount, ref} from "vue";
import ETextarea from "@/components/etsuya/ETextarea.vue";
import VoiceRecorder from "@/components/natively/VoiceRecorder.vue";
import Drawer from 'primevue/drawer';
import ProgressBar from 'primevue/progressbar';
import EListItem from "@/components/etsuya/EListItem.vue";
import EList from "@/components/etsuya/EList.vue";
import Diff from "diff/dist/diff.js";
import {apiCreateComment} from "@/api/postV2.js";
import {useToast} from "@/utils/toast.js";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const { t, locale, availableLocales } = useI18n()
const userStore = useUserStore();

const props = defineProps({
    postId: {
        type: String,
        default: ''
    },
    isPost: {
        type: Boolean,
        default: true
    },
    id: {
        type: String,
        default: ''
    }
})
const emits = defineEmits(['commented'])

const content = ref('');

// send
const sending = ref(false);
const send = async () => {
    sending.value = true;
    // todo validation
    const formData = new FormData();
    formData.append('postId', props.postId);
    formData.append('parentId', props.id);
    formData.append('content', content.value);
    if(imageValue.value){
        formData.append('image', imageValue.value);
    }
    if(voiceValue.value){
        formData.append('voice', voiceValue.value);
    }
    if(compareChange.value.length > 0){
        formData.append('compare', JSON.stringify({
            oldValue: compareOldValue.value,
            newValue: compareNewValue.value,
        }));
    }
    // send request
    apiCreateComment(formData).then((res) => {
        emits('commented', res);
    }).catch((err) => {}).finally(() => {
        sending.value = false;
    })
}

// image
const imageValue = ref(null);
const imagePreview = ref(null);
const imageUploader = ref(null);
const imageMenuVisible = ref(false);
const addImage = () => {
    imageUploader.value.click();
}
const uploadImage = (e) => {
    const file = e.target.files[0]; // 获取文件
    if (!file || !file.type.startsWith("image/")) {
        toast.add({
            title: t('file.pleaseSelectImage'),
        })
        return;
    }
    //检查文件大小不超过5M
    if (file.size > 4 * 1024 * 1024) {
        toast.add({
            title: t('post.imageSizeLimit'),
        })
        return;
    }
    // 生成预览 URL
    const previewUrl = URL.createObjectURL(file);
    // 保存
    imageValue.value = file;
    imagePreview.value = previewUrl;
    // close the drawer
    imageMenuVisible.value = false;
}
const deleteImage = () => {
    imageValue.value = null;
    imagePreview.value = null;
    // close the drawer
    imageMenuVisible.value = false;
}

// voice
const voiceMenuVisible = ref(false);
const voiceRecorder = ref(null);
const voiceTempUrl = ref(null);
const voiceTemp = ref(null);
const voiceValue = ref(null);
const voicePreview = ref(null);
const voiceUploader = ref(null);
const recordVoice = () => {
    voiceMenuVisible.value = false;
    voiceRecorder.value.toggle();
}
const uploadVoiceClick = (e) => {
    voiceUploader.value.click();
}
const uploadVoice = (e) => {
    const file = e.target.files[0]; // 获取文件
    if (!file || !file.type.startsWith("audio/")) {
        toast.add({
            title: t('file.pleaseSelectVoice'),
        })
        return;
    }
    //检查文件大小不超过5M
    if (file.size > 2 * 1024 * 1024) {
        toast.add({
            title: t('post.voiceSizeLimit'),
        })
        return;
    }
    // 生成预览 URL
    const previewUrl = URL.createObjectURL(file);
    // 保存
    voiceValue.value = file;
    voicePreview.value = previewUrl;
    // close the drawer
    voiceMenuVisible.value = false;
}
const voiceRecorded = () => {
    voiceValue.value = voiceTemp.value;
    voicePreview.value = voiceTempUrl.value;
    voiceRecorder.value.toggle();
}
const deleteVoice = () => {
    voiceValue.value = null;
    voicePreview.value = null;
    // close the drawer
    voiceMenuVisible.value = false;
}

// compare
const compareTempOldValue = ref('');
const compareTempNewValue = ref('');
const compareTempChange = ref([]);
const compareMenuVisible = ref(false);
const compareDetailVisible = ref(false);
const compareOldValue = ref('');
const compareNewValue = ref('');
const compareChange = ref([]);
const addCompare = () => {
    compareTempOldValue.value = '';
    compareTempNewValue.value = '';
    compareTempChange.value = [];
    compareMenuVisible.value = false;
    compareDetailVisible.value = true;
}
const compareTempChanged = () => {
    compareTempChange.value = Diff.diffChars(compareTempOldValue.value, compareTempNewValue.value);
}
const confirmCompare = () => {
    compareOldValue.value = compareTempOldValue.value;
    compareNewValue.value = compareTempNewValue.value;
    compareChange.value = compareTempChange.value;
    // close
    compareDetailVisible.value = false;
}
const deleteCompare = () => {
    compareOldValue.value = '';
    compareNewValue.value = '';
    compareChange.value = [];
    compareMenuVisible.value = false;
}

// lifespan

</script>

<style scoped>

</style>
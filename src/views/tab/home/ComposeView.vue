<template>
    <div class="w-full">
        <EHeader class="sticky top-0 z-10" :enable-slot="true" :back-action="backActions">
            <div v-if="page === 1" class="flex items-center">
                <div>{{t('post.language')}}</div>
            </div>
            <div v-else class="flex items-center w-full">
                <div class="whitespace-nowrap flex-1 min-w-0 overflow-hidden text-ellipsis">{{ t('post.compose') }}</div>
                <div class="text-base ml-auto mr-2 flex-shrink-0">{{t('editor.preview')}}</div>
                <ToggleSwitch v-model="preview" class="mr-2 flex-shrink-0" />
            </div>
        </EHeader>
        <div class="w-full">
            <ETransition>
                <div v-if="page === 1" class="w-full flex flex-col gap-4 p-4">
                    <div class="text-3xl font-bold">{{t('post.containLanguages')}}</div>
                    <EList>
                        <EListItem v-for="(item, index) in languages"
                                   :title="languageStore.getLanguageName(item.language)"
                                   :selected="item.selected"
                                   @click="languageClicked(index)" />
                    </EList>
                    <Button class="!rounded-xl" :disabled="selectedLanguageCode.length === 0" :label="t('post.next')" icon="pi pi-arrow-right" @click="goNext" />
                </div>
                <div v-else>
                    <div class="w-full p-4">
                        <div class="w-full">
                            <div class="">
                                <ETextarea v-model="title" :placeholder="type === '1'? t('post.titleOptional'): t('post.title')" class="text-xl font-bold" min-height="1.75" />
                            </div>
                            <Divider class="" />
                            <table class="w-full">
                                <tr v-for="(item, index) in content"
                                    @click="currentIndex = index"
                                    :key="item.id"
                                    class="transform-gpu transition-colors"
                                    :class="{ '!bg-slate-100 dark:!bg-surface-800': !preview && index === currentIndex, 'hover:bg-slate-50 hover:dark:bg-surface-900': !preview }">
                                    <td v-show="!preview" class="border-r border-surface pl-2 pr-2 text-right pt-[0.31rem] align-text-top rounded-l-lg">
                                        <div v-if="item.type === 'markdown'">M</div>
                                        <div v-else class="pi" :class="{
                                'pi-align-left': item.type === 'text',
                                'pi-arrow-down': item.type === 'markdown',
                                'pi-image': item.type === 'image',
                                'pi-microphone': item.type === 'voice',
                                'pi-arrow-right-arrow-left': item.type === 'compare',
                                }"></div>
                                    </td>
                                    <td class="px-3 w-full py-1 rounded-r-lg">
                                        <div v-if="item.type === 'text'" class="h-fit">
                                            <ETextarea v-model="item.value"
                                                       :readonly="preview || index !== currentIndex"/>
                                        </div>
                                        <div class="w-full" v-else-if="item.type === 'image'">
                                            <div v-show="!preview && index === currentIndex"
                                                 class="text-sm text-slate-600 dark:text-surface-400">{{ t('editor.image') }}</div>
                                            <div class="w-full rounded-lg border border-surface mt-1 overflow-hidden" @click="uploadImageClicked(index)">
                                                <img v-if="item.preview"
                                                     :src="item.preview"
                                                     class="h-full w-full max-h-[20rem] object-contain cursor-pointer"
                                                     alt="image"/>
                                                <div v-else class="w-full h-[8rem] flex justify-center items-center">
                                                    <div class="pi pi-plus text-slate-600 dark:text-surface-400 !text-2xl"></div>
                                                </div>
                                            </div>
                                            <div v-show="!preview && index === currentIndex" class="text-sm text-slate-600 dark:text-surface-400 mt-1">{{ t('editor.caption') }}</div>
                                            <div>
                                                <ETextarea v-show="!preview && index === currentIndex"
                                                           :readonly="preview || index !== currentIndex"
                                                           :placeholder="t('editor.caption')"
                                                           v-model="item.caption" />
                                                <div v-show="preview || index !== currentIndex" class="text-sm text-center text-slate-600 dark:text-surface-400 mt-1">
                                                    {{ item.caption }}
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else-if="item.type === 'compare'" class="flex flex-col gap-1">
                                            <div v-show="!preview && index === currentIndex">
                                                <div class="text-sm text-slate-600 dark:text-surface-400">{{ t('editor.originalText') }}</div>
                                                <div>
                                                    <ETextarea @input="compareUpdate(index)"
                                                               :readonly="preview || index !== currentIndex"
                                                               :placeholder="t('editor.originalText')"
                                                               v-model="item.oldValue" />
                                                </div>
                                            </div>
                                            <div v-show="!preview && index === currentIndex">
                                                <div class="text-sm text-slate-600 dark:text-surface-400">{{ t('editor.revisedText') }}</div>
                                                <div>
                                                    <ETextarea @input="compareUpdate(index)"
                                                               :readonly="preview || index !== currentIndex"
                                                               :placeholder="t('editor.revisedText')"
                                                               v-model="item.newValue" />
                                                </div>
                                            </div>
                                            <div>
                                                <div class="text-sm text-slate-600 dark:text-surface-400" v-show="!preview && index === currentIndex">{{ t('editor.output') }}</div>
                                                <div>
                                            <span v-for="d in item.change"
                                                  class="font-bold rounded select-text"
                                                  :class="{ 'bg-red-200': d.removed, 'text-red-500': d.removed, 'bg-primary-100': d.added, 'text-primary-700': d.added }">
                                                {{ d.value }}
                                            </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else-if="item.type === 'markdown'">
                                            <div v-show="!preview && index === currentIndex">
                                                <div class="text-sm text-slate-600 dark:text-surface-400">{{ t('editor.raw') }}</div>
                                                <ETextarea v-model="item.value"
                                                           :readonly="preview || index !== currentIndex"
                                                           :placeholder="t('editor.raw')" />
                                            </div>
                                            <div class="w-full">
                                                <div class="text-sm text-slate-600 dark:text-surface-400" v-show="!preview && index === currentIndex">{{ t('editor.rendered') }}</div>
                                                <MdRender :dynamic="true" :markdown="item.value" />
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div v-show="!preview && index === currentIndex" class="text-sm text-slate-600 dark:text-surface-400">{{ t('editor.voice') }}</div>
                                            <div class="flex justify-center">
                                                <audio v-if="item.preview" :src="item.preview" controls />
                                                <div v-else class="text-sm text-slate-600 dark:text-surface-400">{{ t('editor.noRecordingFound') }}</div>
                                            </div>
                                            <div v-show="!preview && index === currentIndex" class="mt-1 flex justify-evenly *:flex-1 gap-2">
                                                <Button size="small" @click="recordVoice" :label="t('editor.record')" />
                                                <Button size="small" @click="uploadVoiceClicked" :label="t('editor.upload')" />
                                            </div>
                                            <div v-show="!preview && index === currentIndex" class="text-sm text-slate-600 dark:text-surface-400 mt-1">{{ t('editor.caption') }}</div>
                                            <div>
                                                <ETextarea v-show="!preview && index === currentIndex"
                                                           :readonly="preview || index !== currentIndex"
                                                           :placeholder="t('editor.caption')"
                                                           v-model="item.caption" />
                                                <div v-show="preview || index !== currentIndex" class="text-sm text-center text-slate-600 dark:text-surface-400 mt-1">
                                                    {{ item.caption }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div v-show="!preview" class="sticky w-full bottom-16 pt-0 pb-2 px-4">
                        <div class="flex px-2 gap-2 py-1 border border-surface rounded-xl bg-blur
                        *:px-2 *:py-1 *:!text-lg *:rounded-lg *:transition-colors hover:*:bg-slate-100 hover:dark:*:bg-surface-600">
                            <div class="pi pi-align-left" @click="addText(currentIndex)"></div>
                            <div class="pi pi-image" @click="addImage(currentIndex)"></div>
                            <div class="pi pi-microphone" @click="addVoice(currentIndex)"></div>
                            <div class="pi pi-arrow-right-arrow-left" @click="addCompare(currentIndex)"></div>
                            <div class="" @click="addMarkdown(currentIndex)">M</div>
                            <div class="pi pi-trash text-red-600 " @click="deleteBlock"></div>
                            <div class="pi pi-send ml-auto text-primary-500" @click="send()"></div>
                        </div>
                    </div>
                    <div v-show="!preview" class="px-4 pt-2">
                        <EListItem enable-slot rounded>
                            <div class="font-bold pb-1">{{ t('post.stat') }}</div>
                            <div v-for="item in countData">{{ item.label }}: {{ item.value }} <span v-if="item.value > item.max" class="text-red-700" >({{ t('post.overflow')}})</span></div>
                        </EListItem>
                    </div>
                    <div class="px-4 pt-4" v-show="!preview && languages">
                        <EListItem :enable-slot="true" rounded>
                            <div class="font-bold">{{ t('post.selectedLanguage') }}</div>
                            <div class="mt-1">
                                <Tag v-for="item in selectedLanguageText" :value="item" class="ml-2 first:ml-0" />
                            </div>
                        </EListItem>
                    </div>
                    <div v-show="!preview" class="px-4 mt-4">
                        <EListItem enable-slot rounded>
                            <div class="font-bold pb-1">{{ t('post.rule') }}</div>
                            <div class="whitespace-pre-line">
                                {{ type === "1"? t('post.normalRule'): t('post.questionRule') }}
                            </div>
                        </EListItem>
                    </div>
                    <div class="h-4">
                    
                    </div>
                    <VoiceRecorder
                            ref="voiceRecorder"
                            v-model:url="voiceTempUrl"
                            v-model:value="voiceTemp"
                            :enable-send="true"
                            @send="voiceRecorded" />
                    <input class="hidden" ref="imageUploader" type="file" @input="uploadImage($event)" accept="image/*" />
                    <input class="hidden" ref="voiceUploader" type="file" @input="uploadVoice($event)" accept="audio/*"/>
                </div>
            </ETransition>
        </div>
        <Drawer v-model:visible="sending"
                :header="t('editor.posting')"
                :dismissable="false"
                :showCloseIcon="false"
                position="bottom"
                class="!rounded-t-2xl !z-20 !h-auto !max-h-[90dvh] !max-w-[35rem]">
            <ProgressBar :show-value="false" :value="currentStep / stepCount * 100" />
        </Drawer>
    </div>
</template>

<script setup>
import EHeader from "@/components/etsuya/EHeader.vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import Dialog from 'primevue/dialog';
import {useUserStore} from "@/stores/userStore.js";
import {computed, onActivated, onBeforeMount, ref} from "vue";
import Button from "primevue/button";
import ETextarea from "@/components/etsuya/ETextarea.vue";
import Diff from "diff/dist/diff.js";
import MdRender from "@/components/natively/MdRender.vue";
import VoiceRecorder from "@/components/natively/VoiceRecorder.vue";
import ToggleSwitch from 'primevue/toggleswitch';
import {apiCreatePost, apiGetPostVerificationCode, apiUploadPostAttachment} from "@/api/postV2.js";
import {cloneDeep} from "lodash";
import Drawer from 'primevue/drawer';
import ProgressBar from 'primevue/progressbar';
import Divider from 'primevue/divider';
import Tag from 'primevue/tag';
import EListItem from "@/components/etsuya/EListItem.vue";
import {useLanguageStore} from "@/stores/languageStore.js";
import { v4 as uuidv4 } from 'uuid';
import ETransition from "@/components/etsuya/ETransition.vue";
import EList from "@/components/etsuya/EList.vue";
import {useToast} from "@/utils/toast.js";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t, locale, availableLocales } = useI18n()
const userStore = useUserStore();
const languageStore = useLanguageStore();

// page
const page = ref(1);
const goNext = () => {
    page.value ++;
}
const exitDialogVisible = ref(false);
const backActions = computed(() => {
    if(page.value === 1){
        return () => router.back();
    } else {
        return () => page.value = 1;
    }
})

// type
const languages = ref(cloneDeep(userStore.userInfo.languages));
const languageClicked = (index) => {
    languages.value[index].selected = !languages.value[index].selected;
}
const selectedLanguageCode = computed(() => {
    const ret = [];
    languages.value.forEach((item) => {
        if (item.selected) {
            ret.push(item.language);
        }
    })
    return ret;
})
const selectedLanguageText = computed(() => {
    const ret = [];
    languages.value.forEach((item) => {
        if (item.selected) {
            ret.push(languageStore.getLanguageName(item.language));
        }
    })
    return ret;
})

// type
const type = ref('1');

// content
const title = ref('');
const content = ref([{
    id: '123123',
    type: "text",
    value: ""
}]);
const currentIndex = ref(-1);
const preview = ref(false);
let verificationCode = '';
const resetContent = () => {
    content.value = [{
        id: '123123',
        type: "text",
        value: ""
    }];
    title.value = '';
    currentIndex.value = -1;
    preview.value = false;
    verificationCode = '';
}

// send
const sending = ref(false);
const stepCount = ref(0);
const currentStep = ref(0);
const send = async () => {
    try {
        //TODO limitation
        sending.value = true;
        currentStep.value = 0;
        stepCount.value = 2;
        content.value.forEach((item) => {
            if(item.type === 'image' || item.type === 'voice') {
                stepCount.value ++;
            }
        })
        verificationCode = await apiGetPostVerificationCode();
        currentStep.value ++;
        console.log(JSON.stringify(content.value));
        const body = cloneDeep(content.value);
        for (const item of body) {
            switch (item.type) {
                case "text":
                    item.type = 1;
                    break;
                case "compare":
                    item.type = 2;
                    item.change = [];
                    break;
                case "image":
                    item.type = 3;
                    item.preview = "";
                    const imageFormData = new FormData();
                    imageFormData.append("file", item.value);
                    imageFormData.append("code", verificationCode);
                    console.log(imageFormData);
                    item.name = await apiUploadPostAttachment(imageFormData);
                    currentStep.value ++;
                    item.value = null;
                    break;
                case "voice":
                    item.type = 4;
                    item.preview = "";
                    const voiceFormData = new FormData();
                    voiceFormData.append("file", item.value);
                    voiceFormData.append("code", verificationCode);
                    item.name = await apiUploadPostAttachment(voiceFormData);
                    currentStep.value ++;
                    item.value = null;
                    break;
                case "markdown":
                    item.type = 5;
            }
        }
        const postId = await apiCreatePost({
            type: type.value,
            title: title.value,
            content: body,
            verificationCode,
            languages: selectedLanguageCode.value
        });
        currentStep.value ++;
        setTimeout(() => {
            sending.value = false;
        }, 1500);
        await router.replace({ name: 'Post', params: { id: postId }});
        resetContent();
    } catch (e) {
    
    } finally {
        sending.value = false;
    }
}

// text
const textTemplate = {
    type: "text",
    value: ""
};
const addText = (index = content.value.length - 1) => {
    index++;
    content.value.splice(index, 0, {... textTemplate, id: uuidv4()});
    currentIndex.value = index;
}

// compare
const compareTemplate = {
    type: "compare",
    oldValue: "",
    newValue: "",
    change: []
}
const addCompare = (index = content.value.length - 1) => {
    index++;
    content.value.splice(index, 0, {... compareTemplate, id: uuidv4()});
    currentIndex.value = index;
}
const compareUpdate = (index) => {
    content.value[index].change = Diff.diffChars(content.value[index].oldValue, content.value[index].newValue)
}

// markdown
const markdownTemplate = {
    type: "markdown",
    value: ""
}
const addMarkdown = (index = content.value.length - 1) => {
    index++;
    content.value.splice(index, 0, {... markdownTemplate, id: uuidv4()});
    currentIndex.value = index;
}

// image
const imageTemplate = {
    type: "image",
    value: null,
    preview: "",
    caption: ""
}
const addImage = (index = content.value.length - 1) => {
    index++;
    content.value.splice(index, 0, {... imageTemplate, id: uuidv4() });
    currentIndex.value = index;
}
const imageUploader = ref(null);
const uploadImageClicked = (index) => {
    if(index === currentIndex.value && !preview.value){
        imageUploader.value.click();
    }
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
    content.value[currentIndex.value].value = file;
    content.value[currentIndex.value].preview = previewUrl;
}

// voice
const voiceTemplate = {
    type: "voice",
    value: null,
    preview: null,
    caption: ''
};
const addVoice = (index = content.value.length - 1) => {
    index++;
    content.value.splice(index, 0, {... voiceTemplate, id: uuidv4()});
    currentIndex.value = index;
}
const voiceRecorder = ref(null);
const voiceTempUrl = ref(null);
const voiceTemp = ref(null);
const recordVoice = (index) => {
    voiceRecorder.value.toggle();
}
const voiceUploader = ref(null);
const uploadVoiceClicked = (index) => {
    voiceUploader.value.click();
}
const voiceRecorded = () => {
    content.value[currentIndex.value].value = voiceTemp.value;
    content.value[currentIndex.value].preview = voiceTempUrl.value;
}
const uploadVoice = (e) => {
    const file = e.target.files[0]; // 获取文件
    if (!file || !file.type.startsWith("audio/")) {
        toast.add({
            title: t('file.pleaseSelectVoice'),
        })
        return;
    }
    //检查文件大小不超过2M
    if (file.size > 2 * 1024 * 1024) {
        toast.add({
            title: t('post.voiceSizeLimit'),
        })
        return;
    }
    // 生成预览 URL
    const previewUrl = URL.createObjectURL(file);
    // 保存
    content.value[currentIndex.value].value = file;
    content.value[currentIndex.value].preview = previewUrl;
}

// move up
const blockMoveUp = (index) => {

}

// count
const charCount = computed(() => {
    let count = 0;
    content.value.forEach((item) => {
        if(item.type === "text" || item.type === "markdown") {
            count += item.value.length;
        } else if(item.type === "compare") {
            count += item.oldValue.length;
            count += item.newValue.length;
        }
    })
    return count;
})
const blockCount = computed(() => {
    return content.value.length;
})
const imageBlockCount = computed(() => {
    let count = 0;
    content.value.forEach((item) => {
        if(item.type === "image") {
            count ++;
        }
    })
    return count;
})
const voiceBlockCount = computed(() => {
    let count = 0;
    content.value.forEach((item) => {
        if(item.type === "voice") {
            count ++;
        }
    })
    return count;
})
const countData = ref([
    { label: t('post.characterCount'), max: 30000, value: charCount },
    { label: t('post.blockCount'), max: 30, value: blockCount },
    { label: t('post.imageBlockCount'), max: 10, value: imageBlockCount },
    { label: t('post.voiceBlockCount'), max: 10, value: voiceBlockCount },
])

// delete
const deleteBlock = () => {
    content.value.splice(currentIndex.value, 1);
}

// lifespan
onActivated(() => {
    page.value = 1;
})

</script>

<style scoped>

</style>
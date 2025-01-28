<template>
    <div class="w-full">
        <EHeader class="sticky top-0 z-10" :enable-slot="true">
            <div class="flex items-center">
                <div>{{ type === '1'? t('post.normal'): t('post.question') }}</div>
                <div class="text-base ml-auto mr-2">{{t('editor.preview')}}</div>
                <ToggleSwitch v-model="preview" class="mr-2" />
            </div>
        </EHeader>
        <div class="w-full">
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
                            :class="{ '!bg-slate-100': !preview && index === currentIndex, 'hover:bg-slate-50': !preview }">
                            <td v-show="!preview" class="border-r pl-2 pr-2 text-right pt-[0.31rem] align-text-top rounded-l-lg">
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
                                         class="text-sm text-slate-600">{{ t('editor.image') }}</div>
                                    <div class="w-full rounded-lg border mt-1 overflow-hidden" @click="uploadImageClicked(index)">
                                        <img v-if="item.preview"
                                             :src="item.preview"
                                             class="h-full w-full max-h-[20rem] object-contain cursor-pointer"
                                             alt="image"/>
                                        <div v-else class="w-full h-[8rem] flex justify-center items-center">
                                            <div class="pi pi-plus text-slate-600 !text-2xl"></div>
                                        </div>
                                    </div>
                                    <div v-show="!preview && index === currentIndex" class="text-sm text-slate-600 mt-1">{{ t('editor.caption') }}</div>
                                    <div>
                                        <ETextarea v-show="!preview && index === currentIndex"
                                                   :readonly="preview || index !== currentIndex"
                                                   :placeholder="t('editor.caption')"
                                                   v-model="item.caption" />
                                        <div v-show="preview || index !== currentIndex" class="text-sm text-center text-slate-600 mt-1">
                                            {{ item.caption }}
                                        </div>
                                    </div>
                                </div>
                                <div v-else-if="item.type === 'compare'" class="flex flex-col gap-1">
                                    <div v-show="!preview && index === currentIndex">
                                        <div class="text-sm text-slate-600">{{ t('editor.originalText') }}</div>
                                        <div>
                                            <ETextarea @input="compareUpdate(index)"
                                                       :readonly="preview || index !== currentIndex"
                                                       :placeholder="t('editor.originalText')"
                                                       v-model="item.oldValue" />
                                        </div>
                                    </div>
                                    <div v-show="!preview && index === currentIndex">
                                        <div class="text-sm text-slate-600">{{ t('editor.revisedText') }}</div>
                                        <div>
                                            <ETextarea @input="compareUpdate(index)"
                                                       :readonly="preview || index !== currentIndex"
                                                       :placeholder="t('editor.revisedText')"
                                                       v-model="item.newValue" />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-sm text-slate-600" v-show="!preview && index === currentIndex">{{ t('editor.output') }}</div>
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
                                        <div class="text-sm text-slate-600">{{ t('editor.raw') }}</div>
                                        <ETextarea v-model="item.value"
                                                   :readonly="preview || index !== currentIndex"
                                                   :placeholder="t('editor.raw')" />
                                    </div>
                                    <div class="w-full">
                                        <div class="text-sm text-slate-600" v-show="!preview && index === currentIndex">{{ t('editor.rendered') }}</div>
                                        <MdRender :dynamic="true" :markdown="item.value" />
                                    </div>
                                </div>
                                <div v-else>
                                    <div v-show="!preview && index === currentIndex" class="text-sm text-slate-600">{{ t('editor.voice') }}</div>
                                    <div class="flex justify-center">
                                        <audio v-if="item.preview" :src="item.preview" controls />
                                        <div v-else class="text-sm text-slate-600">{{ t('editor.noRecordingFound') }}</div>
                                    </div>
                                    <div v-show="!preview && index === currentIndex" class="mt-1 flex justify-evenly *:flex-1 gap-2">
                                        <Button size="small" @click="recordVoice" :label="t('editor.record')" />
                                        <Button size="small" @click="uploadVoiceClicked" :label="t('editor.upload')" />
                                    </div>
                                    <div v-show="!preview && index === currentIndex" class="text-sm text-slate-600 mt-1">{{ t('editor.caption') }}</div>
                                    <div>
                                        <ETextarea v-show="!preview && index === currentIndex"
                                                   :readonly="preview || index !== currentIndex"
                                                   :placeholder="t('editor.caption')"
                                                   v-model="item.caption" />
                                        <div v-show="preview || index !== currentIndex" class="text-sm text-center text-slate-600 mt-1">
                                            {{ item.caption }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div class="mt-4" v-show="!preview && languages">
                        <EList>
                            <EListItem :enable-slot="true">
                                <div>
                                    <div class="font-bold">{{ t('post.selectedLanguage') }}</div>
                                    <div class="mt-1">
                                        <Tag v-for="item in languageText" :value="item" class="ml-2 first:ml-0" />
                                    </div>
                                </div>
                            </EListItem>
                        </EList>
                    </div>
                    <div v-show="!preview">
                        <Panel :header="t('post.rule')"
                               class="mt-4"
                               toggleable
                               collapsed
                               pt:root:class="!rounded-2xl" pt:content:class="!whitespace-pre-line" >
                            {{ type === "1"? t('post.normalRule'): t('post.questionRule') }}
                        </Panel>
                    </div>
                </div>
            </div>
            <div class="sticky w-full bottom-0 flex flex-col px-4" v-if="false">
                <div class="flex gap-2 justify-evenly *:flex-1">
                    <Button severity="secondary" label="Text" @click="addText(currentIndex)" />
                    <Button severity="secondary" label="Compare" @click="addCompare(currentIndex)" />
                    <Button severity="secondary" label="Image" @click="addImage(currentIndex)"/>
                    <Button severity="secondary" label="Voice" @click="addVoice(currentIndex)" />
                    <Button severity="secondary" label="Markdown" @click="addMarkdown(currentIndex)" />
                    <Button severity="danger" label="Delete" @click="deleteBlock" />
                </div>
                <div>
                    Block Count: {{content.length}} | Char Count: {{charCount}}
                </div>
            </div>
            <div v-show="!preview" class="sticky w-full bottom-16 pt-0 pb-2 px-4">
                <div class="flex px-2 gap-2 py-1 border rounded-xl bg-white/80 backdrop-blur-xl
                *:px-2 *:py-1 *:!text-lg *:rounded-lg *:transition-colors hover:*:bg-slate-100">
                    <div class="pi pi-align-left" @click="addText(currentIndex)"></div>
                    <div class="pi pi-image" @click="addImage(currentIndex)"></div>
                    <div class="pi pi-microphone" @click="addVoice(currentIndex)"></div>
                    <div class="pi pi-arrow-right-arrow-left" @click="addCompare(currentIndex)"></div>
                    <div class="" @click="addMarkdown(currentIndex)">M</div>
                    <div class="pi pi-trash text-red-600 " @click="deleteBlock"></div>
                    <div class="pi pi-send ml-auto text-primary-500" @click="send()"></div>
                </div>
            </div>
            <VoiceRecorder
                    ref="voiceRecorder"
                    v-model:url="voiceTempUrl"
                    v-model:value="voiceTemp"
                    :enable-send="true"
                    @send="voiceRecorded" />
            <input class="hidden" ref="imageUploader" type="file" @input="uploadImage($event)" />
            <input class="hidden" ref="voiceUploader" type="file" @input="uploadVoice($event)" />
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
import {useUserStore} from "@/stores/userStore.js";
import {computed, onBeforeMount, ref} from "vue";
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
import EList from "@/components/etsuya/EList.vue";
import Tag from 'primevue/tag';
import EListItem from "@/components/etsuya/EListItem.vue";
import {useLanguageStore} from "@/stores/languageStore.js";
import Panel from 'primevue/panel';

const route = useRoute();
const router = useRouter();
const { t, locale, availableLocales } = useI18n()
const userStore = useUserStore();
const languageStore = useLanguageStore();

// lang
const languages = ref([]);
const languageText = computed(() => {
    const ret = [];
    if(languages.value){
        languages.value.forEach((item) => {
            ret.push(languageStore.getLanguageName(item));
        })
    }
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
            languages: languages.value
        });
        currentStep.value ++;
        setTimeout(() => {
            sending.value = false;
        }, 1500);
        router.push({ name: 'Post', params: { id: postId }});
    } catch (e) {

    } finally {
    
    }
}

// text
const textTemplate = {
    type: "text",
    value: ""
};
const addText = (index = content.value.length - 1) => {
    // console.log('Before: ', content.value, '. Index: ', index);
    index++;
    content.value.splice(index, 0, {... textTemplate, id: self.crypto.randomUUID()});
    currentIndex.value = index;
    // console.log('After: ', content.value);
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
    content.value.splice(index, 0, {... compareTemplate, id: self.crypto.randomUUID()});
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
    content.value.splice(index, 0, {... markdownTemplate, id: self.crypto.randomUUID()});
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
    content.value.splice(index, 0, {... imageTemplate, id: self.crypto.randomUUID()});
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
        console.warn("请选择有效的图片文件！");
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
    content.value.splice(index, 0, {... voiceTemplate, id: self.crypto.randomUUID()});
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
        console.warn("请选择有效的音频文件！");
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

// delete
const deleteBlock = () => {
    content.value.splice(currentIndex.value, 1);
}

// lifespan
onBeforeMount(() => {
    languages.value = Array.isArray(route.query.language)? route.query.language: [];
    type.value = route.query.type? route.query.type: '1';
})

</script>

<style scoped>

</style>
<template>
    <div class="w-full">
        <EHeader class="sticky top-0 z-10" :title="t('post.normal')" />
        <div class="w-full">
            <div class="w-full p-2">
                <div class="w-full">
                    <table>
                        <tr v-for="(item, index) in content" @click="currentIndex = index"
                            class="hover:bg-slate-50 transform-gpu transition-colors" :class="{ '!bg-slate-100': index === currentIndex }">
                            <td class="border-r pl-2 pr-2 text-right pt-[0.31rem] align-text-top rounded-l-lg">
                                <div class="pi" :class="{
                                'pi-align-left': item.type === 'text',
                                'pi-arrow-down': item.type === 'markdown',
                                'pi-image': item.type === 'image',
                                'pi-microphone': item.type === 'voice',
                                'pi-arrow-right-arrow-left': item.type === 'compare',
                            }"></div>
                            </td>
                            <td class="px-3 w-full py-1 rounded-r-lg">
                                <div v-if="item.type === 'text'" class="h-fit">
                                    <ETextarea v-model="item.value" />
                                </div>
                                <div class="w-full" v-else-if="item.type === 'image'">
                                    <div v-show="index === currentIndex" class="text-sm text-slate-600">{{ t('editor.image') }}</div>
                                    <div class="w-full rounded-lg border mt-1 overflow-hidden" @click="uploadImageClicked(index)">
                                        <img v-if="item.preview"
                                             :src="item.preview"
                                             class="h-full w-full max-h-[20rem] object-contain cursor-pointer"
                                             alt="image"/>
                                        <div v-else class="w-full h-[8rem] flex justify-center items-center">
                                            <div class="pi pi-plus text-slate-600 !text-2xl"></div>
                                        </div>
                                    </div>
                                    <div v-show="index === currentIndex" class="text-sm text-slate-600 mt-1">{{ t('editor.caption') }}</div>
                                    <div>
                                        <ETextarea v-show="index === currentIndex" :placeholder="t('editor.caption')" v-model="item.caption" />
                                        <div v-show="index !== currentIndex" class="text-sm text-center text-slate-600 mt-1">
                                            {{ item.caption }}
                                        </div>
                                    </div>
                                </div>
                                <div v-else-if="item.type === 'compare'" class="flex flex-col gap-1">
                                    <div v-show="index === currentIndex">
                                        <div class="text-sm text-slate-600">{{ t('editor.originalText') }}</div>
                                        <div>
                                            <ETextarea @input="compareUpdate(index)" :placeholder="t('editor.originalText')" v-model="item.oldValue" />
                                        </div>
                                    </div>
                                    <div v-show="index === currentIndex">
                                        <div class="text-sm text-slate-600">{{ t('editor.revisedText') }}</div>
                                        <div>
                                            <ETextarea @input="compareUpdate(index)" :placeholder="t('editor.revisedText')" v-model="item.newValue" />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-sm text-slate-600" v-show="index === currentIndex">{{ t('editor.output') }}</div>
                                        <div>
                                        <span v-for="d in item.change"
                                              class="font-bold rounded"
                                              :class="{ 'bg-red-200': d.removed, 'text-red-500': d.removed, 'bg-primary-100': d.added, 'text-primary-700': d.added }">
                                            {{ d.value }}
                                        </span>
                                        </div>
                                    </div>
                                </div>
                                <div v-else-if="item.type === 'markdown'">
                                    <div v-show="index === currentIndex">
                                        <div class="text-sm text-slate-600">{{ t('editor.raw') }}</div>
                                        <ETextarea v-model="item.value" :placeholder="t('editor.raw')" />
                                    </div>
                                    <div class="w-full">
                                        <div class="text-sm text-slate-600" v-show="index === currentIndex">{{ t('editor.rendered') }}</div>
                                        <MdRender :dynamic="true" :markdown="item.value" />
                                    </div>
                                </div>
                                <div v-else>
                                    <div v-show="index === currentIndex" class="text-sm text-slate-600">{{ t('editor.voice') }}</div>
                                    <div>
                                        <audio v-if="item.preview" :src="item.preview" controls />
                                        <div v-else class="text-sm text-slate-600">{{ t('editor.noRecordingFound') }}</div>
                                    </div>
                                    <div v-show="index === currentIndex" class="mt-1 flex justify-evenly *:flex-1 gap-2">
                                        <Button size="small" @click="recordVoice" :label="t('editor.record')" />
                                        <Button size="small" @click="uploadVoiceClicked" :label="t('editor.upload')" />
                                    </div>
                                    <div v-show="index === currentIndex" class="text-sm text-slate-600 mt-1">{{ t('editor.caption') }}</div>
                                    <div>
                                        <ETextarea v-show="index === currentIndex" :placeholder="t('editor.caption')" v-model="item.caption" />
                                        <div v-show="index !== currentIndex" class="text-sm text-center text-slate-600 mt-1">
                                            {{ item.caption }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="sticky w-full bottom-0 flex flex-col px-4">
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
            <VoiceRecorder2
                    ref="voiceRecorder"
                    v-model:url="voiceTempUrl"
                    v-model:value="voiceTemp"
                    :enable-send="true"
                    @send="voiceRecorded" />
            <input class="hidden" ref="imageUploader" type="file" @input="uploadImage($event)" />
            <input class="hidden" ref="voiceUploader" type="file" @input="uploadVoice($event)" />
        </div>
    </div>
</template>

<script setup>
import EHeader from "@/components/logo/EHeader.vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/stores/userStore.js";
import {computed, ref} from "vue";
import Button from "primevue/button";
import ETextarea from "@/components/ETextarea.vue";
import Diff from "diff/dist/diff.js";
import MdRender from "@/components/logo/MdRender.vue";
import VoiceRecorder2 from "@/components/VoiceRecorder2.vue";

const route = useRoute();
const router = useRouter();
const { t, locale, availableLocales } = useI18n()
const userStore = useUserStore();

const content = ref([]);
const currentIndex = ref(-1);

// text
const textTemplate = {
    type: "text",
    value: ""
};
const addText = (index = content.value.length - 1) => {
    index++;
    content.value.splice(index, 0, {... textTemplate});
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
    content.value.splice(index, 0, {... compareTemplate});
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
    content.value.splice(index, 0, {... markdownTemplate});
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
    content.value.splice(index, 0, {... imageTemplate});
    currentIndex.value = index;
}
const imageUploader = ref(null);
const uploadImageClicked = (index) => {
    imageUploader.value.click();
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
    content.value.splice(index, 0, {... voiceTemplate});
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

</script>

<style scoped>

</style>
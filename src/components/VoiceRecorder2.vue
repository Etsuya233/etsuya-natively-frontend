<template>
    <Drawer v-model:visible="visible" :header="t('voiceRecorder.title')" position="bottom" class="!rounded-t-2xl !z-20 !h-auto !max-h-[90dvh] !max-w-[35rem]">
        <div class="w-full flex flex-col pt-1">
            
            <Message severity="secondary" pt:text:class="!text-sm">
                {{t('voiceRecorder.limit')}}
            </Message>
            <Divider/>
            <audio v-if="url" :src="url" controls></audio>
            <Divider v-if="url" />
            <div class="flex *:flex-1 gap-4 justify-evenly drop-shadow-2xl">
                <Button v-if="!url" @click="toggleRecording"
                        icon="pi pi-microphone"
                        :severity="isRecording? 'warn': 'primary'"
                        :label="isRecording ? formatTime(recordDuration) : t('voiceRecorder.start')" />
                <Button v-if="url" severity="danger"
                        icon="pi pi-trash"
                        @click="removeRecording"
                        :label="t('common.delete')" />
                <Button v-if="url && props.enableSend" severity="primary"
                        icon="pi pi-send"
                        @click="emits('send')"
                        :label="t('voiceRecorder.send')" />
            </div>
            <Divider v-if="error" />
            <Message v-if="error" severity="error">{{ error }}</Message>
        </div>
    </Drawer>
</template>

<script setup>
import Button from "primevue/button";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Divider from "primevue/divider";
import Message from "primevue/message";
import Drawer from "primevue/drawer";

const emits = defineEmits(['send']);
const props = defineProps({
    enableSend: {
        default: false,
    }
})

const visible = ref(false);
const toggle = () => {
    visible.value = !visible.value;
}
defineExpose({toggle});

const { t } = useI18n();
const isRecording = ref(false); // 是否正在录音
const error = ref('');          // 错误信息
const recordDuration = ref(0);  // 录音时长（以秒为单位）
const MAX_RECORD_DURATION = 30; // 最大录音时长（秒）
let mediaRecorder = null;       // MediaRecorder 对象
let audioChunks = [];           // 存储音频数据片段
let currentStream = null;       // 麦克风音轨流
let durationTimer = null;       // 计时器
let stopTimer = null;           // 自动停止计时器
const url = defineModel('url'); // 录音文件 URL
const value = defineModel('value');

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const startRecording = async () => {
    try {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }

        audioChunks = []; // 清空旧数据
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        currentStream = stream;
        mediaRecorder = new MediaRecorder(stream);

        // 收集录音数据
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        // 停止录音时处理数据
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            url.value = URL.createObjectURL(audioBlob);
            value.value = audioBlob;
            audioChunks = [];
            clearTimers(); // 清理计时器
        };

        // 开始录音
        mediaRecorder.start();
        isRecording.value = true;
        startTimers();
    } catch (err) {
        console.error(err);
        if (err.name === 'NotAllowedError') {
            error.value = t('errors.microphonePermissionDenied');
        } else if (err.name === 'NotFoundError') {
            error.value = t('errors.microphoneNotFound');
        } else {
            error.value = t('errors.generic') + err.message;
        }
    }
};

const stopRecording = () => {
    if (mediaRecorder) {
        mediaRecorder.stop();
        isRecording.value = false;
    }

    if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
        currentStream = null;
    }
    mediaRecorder = null;
    clearTimers();
};

const toggleRecording = () => {
    if (isRecording.value) {
        stopRecording();
    } else {
        startRecording();
    }
};

const removeRecording = () => {
    url.value = '';
    recordDuration.value = 0;
};

const startTimers = () => {
    recordDuration.value = 0;

    // 计时器：每秒更新一次录音时间
    durationTimer = setInterval(() => {
        recordDuration.value += 1;
    }, 1000);

    // 限制录音时长：到达最大时长后停止录音
    stopTimer = setTimeout(() => {
        stopRecording();
    }, MAX_RECORD_DURATION * 1000);
};

const clearTimers = () => {
    if (durationTimer) {
        clearInterval(durationTimer);
        durationTimer = null;
    }

    if (stopTimer) {
        clearTimeout(stopTimer);
        stopTimer = null;
    }
};
</script>

<style scoped></style>

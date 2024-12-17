<template>
    <div>
        <InputText v-model="content" />
        <button @click="startSpeaking">Start Speaking</button>
        <audio ref="audioPlayer" controls></audio>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import InputText from "primevue/inputtext";
import {apiSpeak} from "@/api/navi.js";

const audioPlayer = ref(null);
const content = ref('');

// 开始请求语音合成并播放音频
const startSpeaking = async () => {
    
    let res = await apiSpeak({
        content: content.value,
    });

    // 创建音频Blob对象并生成URL
    const audioBlob = new Blob([res.data], { type: 'audio/ogg' });  // 'audio/ogg' 对应 Ogg 格式
    const audioUrl = URL.createObjectURL(audioBlob);

    // 获取并播放音频
    audioPlayer.value.src = audioUrl;
    audioPlayer.value.play();

    // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    //
    // try {
    //     const options = {
    //         method: 'POST',
    //         url: '/api/navi/speak',  // 替换为实际的API端点
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    //         },
    //         data: {
    //             content: content.value  // 请求体内容
    //         },
    //         responseType: 'stream',  // 使用流式响应
    //         adapter: 'fetch'
    //     };
    //
    //     const response = await axios.request(options);
    //     console.log(response);
    //
    //     const reader = response.data.getReader();
    //     const stream = new ReadableStream({
    //         start(controller) {
    //             function push() {
    //                 reader.read().then(({done, value}) => {
    //                     if (done) {
    //                         controller.close();
    //                         return;
    //                     }
    //                     // 将接收到的音频数据送入 AudioContext
    //                     audioContext.decodeAudioData(value.buffer, (audioBuffer) => {
    //                         const source = audioContext.createBufferSource();
    //                         source.buffer = audioBuffer;
    //                         source.connect(audioContext.destination);
    //                         source.start();
    //                     });
    //                     controller.enqueue(value); // 继续读取流
    //                     push();
    //                 });
    //             }
    //
    //             push();
    //         },
    //     });
    // } catch (error) {
    //     console.error('Error fetching and playing audio:', error);
    // }
};
</script>

<template>
    <div class="w-full">
        <div>
            <InputText v-model="message" />
        </div>
        <div>
            <Button label="Send" @click="send" />
        </div>
        <div class="border whitespace-pre-line">
            {{ content }}
        </div>
    </div>
</template>

<script setup>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import {ref} from "vue";

const message = ref('');
const content = ref('');

const send = () => {
    content.value = '';
    
    const eventSource = new EventSource('/api/test/chat?message=' + message.value);
    // 分事件类型处理
    eventSource.addEventListener('message', (e) => {
        const res = JSON.parse(e.data);
        content.value += res.message;
    });

    eventSource.addEventListener('done', () => {
        eventSource.close();
        console.log('流式传输结束');
    });

    eventSource.addEventListener('error', (e) => {
        console.error('错误：', e.data);
        eventSource.close();
    });
}

</script>

<style>

</style>
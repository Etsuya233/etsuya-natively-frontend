<template>
    <div class="w-full flex justify-center py-8">
        <div class="w-full max-w-[30rem] flex flex-col gap-4 bg-white shadow-lg rounded-lg p-6">
            <h2 class="text-xl font-semibold text-center text-gray-700">Chat Application</h2>
            
            <Textarea v-model="message" class="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Type a message..." rows="5" />
            
            <InputText v-model="receiver" class="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Receiver ID" />
            
            <div class="max-h-[20rem] overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2 bg-gray-50">
                <div v-for="(item, index) in messages" :key="index" class="text-sm text-gray-700">
                    {{ item }}
                </div>
            </div>
            
            <div class="flex gap-3 justify-between">
                <Button label="Connect" @click="connect" class="w-full p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition" />
                <Button label="Disconnect" @click="disconnect" class="w-full p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition" />
            </div>
            
            <Button label="Send" @click="send" class="w-full p-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import { useUserStore } from "@/stores/userStore.js";

const userStore = useUserStore();
const currentUser = userStore.userInfo.id;

const messages = ref([]);
const message = ref('');
const receiver = ref('');

let socket, stompClient;

const connect = () => {
    socket = new SockJS("/api/chat/connect");
    stompClient = StompJs.Stomp.over(socket);
    stompClient.connect({
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    }, (frame) => {
        stompClient.subscribe("/topic/system", (res) => {
            messages.value.push(JSON.parse(res.body));
        })
        stompClient.subscribe("/user/queue/message", (res) => {
            messages.value.push(JSON.parse(res.body));
        })
    });
}

const disconnect = () => {
    stompClient.disconnect();
    
}

const send = () => {
    stompClient.send('/ws/msg', {}, JSON.stringify({
        senderId: currentUser,
        receiverId: receiver.value,
        type: 1,
        content: message.value
    }));
    message.value = '';
}
</script>

<style scoped>
.md-editor-icon {
    width: 1.5rem !important;
    height: 1.5rem !important;
}

textarea, input {
    transition: all 0.3s ease;
}

textarea:focus, input:focus {
    border-color: #3b82f6; /* Tailwind's blue-500 */
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* blue shadow */
}
</style>

import {defineStore} from 'pinia';
import {computed, ref} from "vue";
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import {apiGetConversations, apiGetMoreOldMessage} from "@/api/chat.js";
import {useToastStore} from "@/stores/toastStore.js";
import {useUserStore} from "@/stores/userStore.js";

export const useChatStore = defineStore('chat', () => {
    let socket;
    let stompClient = ref(null);

    let conversationMap = ref(new Map());
    let msgMap = ref(new Map());
    let sending = ref(false); // TODO multi tab

    // Conversation
    async function loadMoreConversation(){
        // get the last id
        let lastId = BigInt("9223372036854775807");
        for(const conversation of conversationMap.value.values()){
            if(conversation.lastId && BigInt(conversation.lastId) < lastId){
                lastId = BigInt(conversation.lastId);
            }
        }
        if(lastId === BigInt("9223372036854775807")){
            lastId = null;
        }
        let lastIdStr = lastId === null? null : lastId.toString();
        // query
        let res = await apiGetConversations(lastIdStr);
        res.forEach((conversation) => {
            conversationMap.value.set(conversation.receiverId, conversation);
        })
    }
    function initConversation(){
        return conversationMap.value.size === 0;
    }

    // Messages
    function sendTextMsg(content, receiverId){
        sending.value = true;
        stompClient.value.send("/ws/msg", {}, JSON.stringify({
            receiverId: receiverId,
            type: 1,
            content: content,
        }));
    }
    async function loadMoreOldMessage(userId){
        // msg array
        initMessage(userId);
        let msgs = msgMap.value.get(userId);
        // lastId (oldest id)
        let lastId = BigInt("9223372036854775807");
        msgs.forEach((msg) => {
            if(msg.id && BigInt(msg.id) < lastId){
                lastId = BigInt(msg.id);
            }
        })
        if(lastId === BigInt("9223372036854775807")){
            lastId = null;
        }
        let lastIdStr = lastId === null? null : lastId.toString();
        // query
        let res = await apiGetMoreOldMessage(userId, lastIdStr);
        msgs.unshift(... res);
    }
    function initMessage(userId){
        let msgs = msgMap.value.get(userId);
        if(msgs === null || msgs === undefined) {
            msgs = [];
            msgMap.value.set(userId, msgs);
            return true;
        }
        return false;
    }
    function clearUnread(userId){
        let conversation = conversationMap.value.get(userId);
        conversation.unread = 0;
        stompClient.value.send("/ws/clear", {}, JSON.stringify({
            receiverId: userId
        }));
    }

    // WebSocket
    function connect(){
        socket = new SockJS("/api/chat/connect");
        stompClient.value = StompJs.Stomp.over(socket);
        stompClient.value.connect({
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }, (frame) => {
            const toastStore = useToastStore();
            const userStore = useUserStore();
            const meId = userStore.userInfo.id;
            // system msg
            stompClient.value.subscribe("/topic/system", (res) => {
                console.log(res);
            })
            // chat message
            stompClient.value.subscribe("/user/queue/chat/message", (res) => {
                const body = JSON.parse(res.body);
                const receiverId = body.senderId === meId? body.receiverId: body.senderId;
                initMessage(receiverId);
                msgMap.value.get(receiverId).push(body);
                if(body.senderId === meId){
                    sending.value = false;
                }
            })
        });
    }

    function disconnect(){
        stompClient.value.disconnect();
    }

    let connected = computed(() => {
        return stompClient.value.connected;
    })

    return { connected, disconnect, connect, loadMoreConversation, loadMoreOldMessage, conversationMap, msgMap, initMessage,
    initConversation, sendTextMsg, sending, clearUnread};
});
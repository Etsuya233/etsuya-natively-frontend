import {defineStore} from 'pinia';
import {computed, ref} from "vue";
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import {apiGetConversations, apiGetMoreOldMessage} from "@/api/chat.js";
import {useUserStore} from "@/stores/userStore.js";
import {useToast} from "@/utils/toast.js";

const toast = useToast();

export const useChatStore = defineStore('chat', () => {
    let socket;
    const connected = ref(false);
    let stompClient = ref(new StompJs.Client({
        connectHeaders: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        reconnectDelay: 5000,
        webSocketFactory: () => {
            socket = new SockJS("/api/chat/connect");
            return socket;
        },
        onConnect: (frame) => {
            connected.value = true;
            const userStore = useUserStore();
            const meId = userStore.userInfo.id;
            // system msg
            stompClient.value.subscribe("/topic/system", (res) => {
                console.log(JSON.parse(res.body));
            });
            // chat message
            stompClient.value.subscribe("/user/queue/chat/message", (res) => {
                const response = JSON.parse(res.body);
                if(response.code === 200){
                    const body = response.data;
                    const receiverId = body.senderId === meId? body.receiverId: body.senderId;
                    initMessage(receiverId);
                    msgMap.value.get(receiverId).push(body);
                    if(body.senderId === meId){
                        sending.value = false;
                    }
                } else {
                    toast.add({
                        title: `Error: ${response.code}`,
                        content: response.msg,
                        type: 'error',
                        timeout: 3000
                    })
                    sending.value = false;
                }
            })
        },
        onDisconnect: () => {
            console.log('Disconnected');
            connected.value = false;
        },
        onStompError: (frame) => {
            console.log('Stomp error:', frame);
            connected.value = stompClient.value.connected;
        },
        onWebSocketError: (event) => {
            console.log('WebSocket error:', event);
            connected.value = stompClient.value.connected;
        },
        onWebSocketClose: () => {
            console.log('WebSocket closed');
            connected.value = stompClient.value.connected;
        }
    }));

    let conversationMap = ref(new Map());
    let msgMap = ref(new Map());
    let sending = ref(false); // TODO multi tab

    function $reset(){
        // 断开 WebSocket 连接
        if (stompClient.value && stompClient.value.connected) {
            try {
                stompClient.value.disconnect();
            } catch (e) {
                console.error('Error while disconnecting:', e);
            }
        }
        // 清空 WebSocket 客户端和 socket 实例
        stompClient.value.deactivate();
        // 清空会话映射表
        conversationMap.value.clear();
        // 清空消息映射表
        msgMap.value.clear();
        // 重置发送状态
        sending.value = false;
    }

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
        stompClient.value.publish({
            destination: "/ws/msg",
            body: JSON.stringify({
                receiverId: receiverId,
                type: 1,
                content: content,
            })
        })
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
        stompClient.value.publish({
            destination: "/ws/clear",
            body: JSON.stringify({
                receiverId: userId
            })
        });
    }

    // WebSocket
    function connect(){
        // todo upgrade stompjs usage
        stompClient.value.activate();
    }

    function disconnect(){
        stompClient.value.deactivate();
    }

    return { connected, disconnect, connect, loadMoreConversation, loadMoreOldMessage, conversationMap, msgMap, initMessage,
        initConversation, sendTextMsg, sending, clearUnread, $reset};
});
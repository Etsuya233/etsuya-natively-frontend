import {defineStore} from 'pinia';
import {ref, watch} from "vue";
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import * as StompJs from '@stomp/stompjs';
import {getCurrentLanguage} from "@/utils/language.js";
import {useToast} from "@/utils/toast.js";

const toast = useToast();

export const useWsStore = defineStore('ws', () => {

    /**
     * 是否已连接
     */
    const connected = ref(false);

    /**
     * StompClient
     */
    let stompClient = ref(new StompJs.Client({
        connectHeaders: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            Language: getCurrentLanguage()
        },
        reconnectDelay: 5000,
        webSocketFactory: () => {
            return new SockJS("/api/websocket/connect");
        },
        onConnect: (frame) => {
            connected.value = true;
            stompClient.value.subscribe("/user/queue/system", (res) => {
                const body = JSON.parse(res.body);
                if(body.code === 200){
                    toast.add({
                        title: `System: ${body.code}`,
                        content: body.msg,
                        type: 'info',
                        timeout: 3000
                    })
                } else {
                    toast.add({
                        title: `Error: ${body.code}`,
                        content: body.msg,
                        type: 'error',
                        timeout: 3000
                    })
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

    /**
     * 重置
     */
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
    }

    /**
     * 连接至 WebSocket
     */
    const connect = () => {
        stompClient.value.activate();
    }

    /**
     * 断开 WebSocket 连接
     */
    const disconnect = () => {
        stompClient.value.deactivate();
    }

    const registeredCallback = new Set();

    /**
     * 添加监听者
     * @param callback StompClient的回调函数
     */
    const register = (callback) => {
        registeredCallback.add(callback);
        if(stompClient.value.connected){
            callback.onConnect();
        }
    }

    /**
     * 移除监听者
     * @param callback StompClient的回调函数
     */
    const unregister = (callback) => {
        registeredCallback.delete(callback);
        callback.onDisconnect();
    }

    watch(connected, (newVal, oldVal) => {
        if(newVal && newVal !== oldVal){
            registeredCallback.forEach(callback => {
                callback.onConnect();
            });
        } else if(!newVal && newVal !== oldVal){
            registeredCallback.forEach(callback => {
                callback.onDisconnect();
            });
        }
    })

    const publish = (options) => {
        options.headers = {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            Language: getCurrentLanguage()
        }
        stompClient.value.publish(options);
    }

    return { stompClient, connected, $reset, connect, disconnect, register, unregister, publish }

});
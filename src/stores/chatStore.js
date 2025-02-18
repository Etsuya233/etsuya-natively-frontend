import {defineStore} from 'pinia';
import {computed, ref, watch} from "vue";
import {apiGetConversations, apiGetMoreOldMessage} from "@/api/chat.js";
import {useUserStore} from "@/stores/userStore.js";
import {useToast} from "@/utils/toast.js";
import {useWsStore} from "@/stores/wsStore.js";
import {apiGetUser} from "@/api/user.js";
import ChatNotification from "@/components/natively/ChatNotification.vue";
import {formatDate} from "@/utils/date.js";
import {stompConstant} from "@/constant/stompConstant.js";

const toast = useToast();

export const useChatStore = defineStore('chat', () => {

    const init = async () => {
        const wsStore = useWsStore();
        wsStore.register({
            onConnect: () => {
                const userStore = useUserStore();
                const meId = userStore.userInfo.id;

                // chat message
                wsStore.stompClient.subscribe(stompConstant.userChat, async (res) => {
                    const response = JSON.parse(res.body);
                    if(response.code === 200){

                        // basic infomation
                        const body = response.data;
                        const receiverId = body.senderId === meId? body.receiverId: body.senderId;

                        // make sure conversation exist
                        const conversation = await getConversation(receiverId);

                        // make sure user msg list exists
                        const msgList = getMessageList(receiverId);

                        // time
                        body.time = formatDate(body.timestamp);

                        // save msg
                        msgList.push(body);

                        // notification
                        if(body.senderId !== meId){
                            const userInfo = userInfoMap.get(receiverId);
                            toast.addRaw(ChatNotification, {
                                autoClose: 2000,
                                icon: false,
                                closeButton: false,
                                expandCustomProps: true,
                                contentProps: {
                                    nickname: userInfo.nickname,
                                    content: body.content,
                                    avatar: userInfo.avatar,
                                    userId: receiverId
                                },
                                onClick: () => {

                                }
                            })
                        }

                        // conversation
                        conversation.lastId = body.id;
                        conversation.timestamp = body.timestamp;
                        conversation.time = formatDate(body.timestamp);
                        conversation.content = body.content;

                        // unread
                        conversation.unread ++;

                        // sending state
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
                $reset();
            }
        })
    }

    let conversationMap = ref(new Map());
    let msgMap = ref(new Map());
    let sending = ref(false); // TODO multi tab

    function $reset(){
        // 清空会话映射表
        conversationMap.value.clear();
        // 清空消息映射表
        msgMap.value.clear();
        // 重置发送状态
        sending.value = false;
    }

    // User
    const userInfoMap = new Map();
    const getUserInfo = async (userId) => {
        let userInfo = userInfoMap.get(userId);
        if(!userInfo){
            userInfo = await apiGetUser(userId);
            userInfoMap.set(userInfo.id, userInfo);
        }
        return userInfo;
    }

    // Conversation
    const loadingMoreConversation = ref(false);
    async function getConversation(receiverId){
        let user = await getUserInfo(receiverId);
        let conversation = conversationMap.value.get(receiverId);
        if(!conversation){
            conversation = {
                receiverId, nickname: user.nickname, avatar: user.avatar, unread: 0, timestamp: 0
            };
            conversationMap.value.set(receiverId, conversation);
            conversation = conversationMap.value.get(receiverId);
        }
        return conversation;
    }
    async function loadMoreConversation(){
        loadingMoreConversation.value = true;
        try {
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
                conversation.time = formatDate(conversation.timestamp);
                conversationMap.value.set(conversation.receiverId, conversation);
            })
        } catch (e){} finally {
            loadingMoreConversation.value = false;
        }
    }
    function isConversationEmpty(){
        return conversationMap.value.size === 0;
    }

    // Messages
    function sendTextMsg(content, receiverId){
        const wsStore = useWsStore();
        sending.value = true;
        wsStore.stompClient.publish({
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
        getMessageList(userId);
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
        res.forEach((msg) => {
            msg.time = formatDate(msg.timestamp);
        });
        msgs.unshift(... res);
    }

    /**
     * 获取用户消息映射表存在
     * @param userId
     * @returns {Array}
     */
    function getMessageList(userId){
        let msgs = msgMap.value.get(userId);
        if(msgs === null || msgs === undefined) {
            msgs = [];
            msgMap.value.set(userId, msgs);
        }
        return msgs;
    }

    const orderedConversation = computed(() => {
        return Array.from(conversationMap.value.values()).sort((a, b) => {
            return parseInt(b.timestamp, 10) - parseInt(a.timestamp, 10);
        })
    })

    /**
     * 清除未读消息
     * @param userId
     */
    async function clearUnread(userId){
        const wsStore = useWsStore();
        let conversation = await getConversation(userId);
        conversation.unread = 0;
        wsStore.stompClient.publish({
            destination: "/ws/clear",
            body: JSON.stringify({
                receiverId: userId
            })
        });
    }

    return { init, loadMoreConversation, loadMoreOldMessage, conversationMap, msgMap, getMessageList, loadingMoreConversation,
        orderedConversation, isConversationEmpty, sendTextMsg, sending, clearUnread, $reset, getUserInfo};
});
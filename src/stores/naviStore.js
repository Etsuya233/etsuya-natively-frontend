import {defineStore} from 'pinia';
import {nextTick, ref} from "vue";
import {useWsStore} from "@/stores/wsStore.js";
import {getCurrentLanguage} from "@/utils/language.js";
import {stompConstant} from "@/constant/stompConstant.js";

export const useNaviStore = defineStore('naviStore', () => {

    // counter
    const counter = ref(0);

    // current stream output
    const streamOutput = ref(new Map());
    const streamStatus = ref(new Map());

    // ui
    const visible = ref(false);
    const menu = ref(['translation', 'ask', 'explain', 'pronounce', 'bookmark']);
    const page = ref(1);

    // quote
    const quoteMode = ref(false);
    const quote = ref('');

    // specific
    const bookmarkMode = ref(false);

    // todo stream identifier should not repeat easily.
    /**
     * Launch Navi
     * @param userQuote the quote
     * @param menuDisplay the menu items should be display
     * */
    function launch(userQuote, menuDisplay = ['translation', 'ask', 'explain', 'pronounce', 'bookmark']){
        menu.value = menuDisplay;
        quote.value = '';
        quoteMode.value = false;
        page.value = 1;
        streamOutput.value.clear();
        if(userQuote){
            quoteMode.value = true;
            quote.value = userQuote;
        } else {
            const selection = window.getSelection().toString();
            if(selection){
                console.log(selection);
                quoteMode.value = true;
                quote.value = selection;
            }
            window.getSelection().removeAllRanges();
        }
        visible.value = true;
    }

    function awakeBookmark(){
        bookmarkMode.value = false;
        nextTick(() => {
            bookmarkMode.value = true;
        })
    }

    function close(){
        visible.value = false;
    }

    // init todo error handling
    const init = () => {
        const wsStore = useWsStore();
        wsStore.register({
            onConnect: () => {
                wsStore.stompClient.subscribe(stompConstant.userNavi, (res) => {
                    const response = JSON.parse(res.body);
                    const body = response.data;
                    if(response.code === 200){
                        const id = body.id, status = body.status, message = body.message;
                        if(status === 'message'){
                            const output = streamOutput.value.get(id) || '';
                            streamOutput.value.set(id, output + message);
                        } else if(status === 'error') {
                            streamStatus.value.set(id, 'error');
                            streamOutput.value.set(id, message);
                        } else if(status === 'done') {
                            streamStatus.value.set(id, 'done');
                        }
                    } else {
                        console.log(response);
                    }
                });
            },
            onDisconnect: () => {
                streamOutput.value.clear();
            }
        })
    }

    const sendAskStreamRequest = (question, quote, count) => {
        const wsStore = useWsStore();
        wsStore.publish({
            destination: "/ws/ask/stream",
            body: JSON.stringify({
                quote, question, id: count
            })
        });
    }

    const sendExplainStreamRequest = (quote, count) => {
        const wsStore = useWsStore();
        wsStore.publish({
            destination: "/ws/explain/stream",
            body: JSON.stringify({
                quote, id: count
            })
        });
    }

    const sendTranslateFastStreamRequest = (content, targetLanguage, id) => {
        const wsStore = useWsStore();
        wsStore.publish({
            destination: "/ws/translate/stream",
            body: JSON.stringify({
                id, content, targetLanguage
            })
        });
    }

    const getStreamOutput = (id) => {
        return streamOutput.value.get(id.toString());
    }

    const getStreamStatus = (id) => {
        return streamStatus.value.get(id.toString());
    }

    return { visible, menu, quoteMode, quote, page, launch, counter, streamOutput, streamStatus, init, close, bookmarkMode, awakeBookmark,
    sendAskStreamRequest, getStreamOutput, getStreamStatus, sendExplainStreamRequest, sendTranslateFastStreamRequest};

});
import {defineStore} from 'pinia';
import {nextTick, ref} from "vue";
import {apiGetTranslation} from "@/api/language.js";
import {Translation} from "vue-i18n";
import {apiAskNavi, apiSpeak} from "@/api/navi.js";

export const useNaviStore = defineStore('navi', () => {

    let showing = ref(false);
    let question = ref('');
    let quote = ref('');
    let type = ref(0); // 0 auto between custom and selection 1 custom 2 quote with invoke
    let loading = ref(false);
    let answer = ref('');
    let page = ref(1); // 1 main menu 2 intermediate 3 final
    let mode = ref(1); // 1 ask 2 translate 3 explain
    let count = ref(1);
    let audioBlob = ref();
    let audioUrl = ref('');

    function open(input){
        if(input.type === 0){
            const selection = window.getSelection().toString();
            console.log(selection);
            if(selection){
                quote.value = selection;
                type.value = 2;
            } else {
                type.value = 1;
            }
        } else {
            quote.value = input.quote;
            type.value = input.type;
        }
        page.value = 1;
        question.value = '';
        showing.value = true;
    }

    // when click at the menu item invoke
    function operate(input){
        mode.value = input;
        goNext();
    }

    function goNext(){
        if(type.value === 1){ // custom mode
            if(mode.value === 1){ //ask
                if(page.value === 1){
                    page.value = 2;
                } else if(page.value >= 2){
                    const cc = ++count.value;
                    loading.value = true;
                    apiAskNavi({
                        type: 0,
                        question: question.value,
                        quote: ''
                    }).then(res => {
                        if(count.value === cc){
                            answer.value = res.answer;
                            loading.value = false
                        }
                    })
                    page.value = 3;
                }
            } else if(mode.value === 2){ //translate
                if(page.value === 1){
                    page.value = 2;
                } else if(page.value >= 2){
                    const cc = ++count.value;
                    loading.value = true;
                    apiAskNavi({
                        type: 1,
                        quote: question.value,
                    }).then(res => {
                        if(count.value === cc){
                            let obj = JSON.parse(res.answer);
                            console.log(obj);
                            answer.value = obj.final_translation;
                            loading.value = false;
                        }
                    })
                    page.value = 3;
                }
            } else if(mode.value === 3){ //explain
                if(page.value === 1){
                    page.value = 2;
                } else if(page.value >= 2){
                    const cc = ++count.value;
                    loading.value = true;
                    apiAskNavi({
                        type: 2,
                        quote: question.value,
                    }).then(res => {
                        if(count.value === cc){
                            answer.value = res.answer;
                            loading.value = false
                        }
                    })
                    page.value = 3;
                }
            } else if(mode.value === 4){
                if(page.value === 1){
                    page.value = 2;
                } else if(page.value >= 2){
                    const cc = ++count.value;
                    loading.value = true;
                    apiSpeak({
                        content: question.value,
                    }).then(res => {
                        if(count.value === cc){
                            loading.value = false;
                            audioBlob.value = new Blob([res.data], { type: 'audio/ogg' });
                            audioUrl.value = URL.createObjectURL(audioBlob.value);
                        }
                    });
                    page.value = 3;
                }
            }
        } else if(type.value === 2){ // quote mode
            if(mode.value === 1){ //ask
                if(page.value === 1){
                    page.value = 2;
                } else if(page.value >= 2){
                    const cc = ++count.value;
                    loading.value = true;
                    apiAskNavi({
                        type: 0,
                        question: question.value,
                        quote: quote.value
                    }).then(res => {
                        if(count.value === cc){
                            answer.value = res.answer;
                            loading.value = false;
                        }
                    })
                    page.value = 3;
                }
            } else if(mode.value === 2){
                if(page.value >= 1){
                    const cc = ++count.value;
                    loading.value = true;
                    apiAskNavi({
                        type: 1,
                        quote: quote.value,
                    }).then(res => {
                        if(count.value === cc){
                            let obj = JSON.parse(res.answer);
                            console.log(obj);
                            answer.value = obj.final_translation;
                            loading.value = false;
                        }
                    })
                    page.value = 3;
                }
            } else if(mode.value === 3){
                if(page.value >= 1){
                    const cc = ++count.value;
                    loading.value = true;
                    apiAskNavi({
                        type: 2,
                        quote: quote.value,
                    }).then(res => {
                        if(count.value === cc){
                            answer.value = res.answer;
                            loading.value = false;
                        }
                    })
                    page.value = 3;
                }
            } else if(mode.value === 4){
                if(page.value >= 1){
                    const cc = ++count.value;
                    loading.value = true;
                    apiSpeak({
                        content: quote.value,
                    }).then(res => {
                        if(count.value === cc){
                            loading.value = false;
                            audioBlob.value = new Blob([res.data], { type: 'audio/ogg' });
                            audioUrl.value = URL.createObjectURL(audioBlob.value);
                        }
                    });
                    page.value = 3;
                }
            }
        }
    }

    function goBack(){
        if(type.value === 1){
            page.value--;
        } else if(type.value === 2){
            if(mode.value === 1){
                page.value--;
            } else {
                page.value -= 2;
            }
        }
    }



    return {showing, open, question, quote, type, loading, answer, page, mode, goNext, operate, goBack, audioBlob, audioUrl};

});
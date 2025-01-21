import {defineStore} from 'pinia';
import {ref} from "vue";

export const useNaviStoreV2 = defineStore('naviStoreV2', () => {

    // ui
    const visible = ref(true);
    const menu = ref(['translation', 'ask', 'explain', 'pronounce', 'bookmark']);
    const page = ref(1);

    // quote
    const quoteMode = ref(false);
    const quote = ref('');

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
        if(userQuote){
            quoteMode.value = true;
            quote.value = userQuote;
        } else {
            const selection = window.getSelection().toString();
            if(selection){
                quoteMode.value = true;
                quote.value = selection;
            }
        }
        visible.value = true;
    }

    return { visible, menu, quoteMode, quote, page, launch };

});
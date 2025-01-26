import {defineStore} from 'pinia';
import {ref} from "vue";

export const useNaviStore = defineStore('naviStore', () => {

    // ui
    const visible = ref(false);
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
                console.log(selection);
                quoteMode.value = true;
                quote.value = selection;
            }
            window.getSelection().removeAllRanges();
        }
        visible.value = true;
    }

    return { visible, menu, quoteMode, quote, page, launch };

});
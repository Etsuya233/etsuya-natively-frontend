import {toast} from "vue3-toastify";
import NormalNotification from "@/components/natively/NormalNotification.vue";

export function useToast(){
    const add = ({ title= '', content = '', timeout = 3000, type = 'info', onClick = null } = {}) => {
        toast(NormalNotification ,{
            autoClose: timeout,
            type: type,
            expandCustomProps: true,
            contentProps: {
                title,
                content
            },
            onClick
        })
    }

    const addRaw = (componentOrText, options) => {
        toast(componentOrText, options);
    }

    return {add, addRaw};
}
import {defineStore} from 'pinia';
import {ref} from "vue";
import {useToast} from "primevue/usetoast";

export const useToastStore = defineStore('toast', () => {
    const toast = useToast();

    function add(options){
        toast.add(options);
    }

    return {add};
});
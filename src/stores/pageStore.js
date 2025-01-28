import {defineStore} from 'pinia';
import {computed, ref} from "vue";

export const usePageStore = defineStore('page', () => {

    const cachedComponent = ref(new Set());

    const cachedComponentArray = computed(() => {
        return Array.from(cachedComponent.value);
    })

    const addComponent = (name) => {
        cachedComponent.value.add(name);
    }

    const removeComponent = (name) => {
        cachedComponent.value.delete(name);
    }

    return { cachedComponent, cachedComponentArray, addComponent, removeComponent };
});
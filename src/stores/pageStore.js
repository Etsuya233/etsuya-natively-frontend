import {defineStore} from 'pinia';
import {computed, ref} from "vue";

export const usePageStore = defineStore('page', () => {

    const cachedComponent = ref(new Map());

    const cachedComponentArray = computed(() => {
        return Array.from(cachedComponent.value.keys());
    })

    const addComponent = (name) => {
        if(!cachedComponent.value.has(name)){
            const obj = { scrollY: 0 };
            cachedComponent.value.set(name, obj);
            return obj;
        }
        return cachedComponent.value.get(name);
    }

    const removeComponent = (name) => {
        cachedComponent.value.delete(name);
    }

    const setScrollY = (name, value) => {
        const obj = addComponent(name);
        obj.scrollY = value;
    }

    const getScrollY = (name) => {
        return cachedComponent.value.get(name)?.scrollY || 0;
    }

    return { cachedComponent, cachedComponentArray, addComponent, removeComponent, setScrollY, getScrollY };
});
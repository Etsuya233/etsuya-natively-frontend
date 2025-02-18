<template>
    <div class="w-full flex border-b border-surface items-center gap-4 h-14 px-2 bg-blur">
        <div class="hover:bg-surface-100/50 hover:dark:bg-surface-800/80 rounded-full h-12 w-12 transition-colors flex-shrink-0"
             @click="clickedBack" v-if="props.showBack" >
            <Button icon="pi pi-arrow-left !text-xl" rounded unstyled
                    pt:root:class="w-full h-full !flex !justify-center !items-center"
                    pt:label:class="hidden"
            />
        </div>
        <div class="text-lg font-bold flex-1 w-0 overflow-hidden" :class="{ 'ml-3': !props.showBack }">
            <div v-if="props.enableSlot">
                <slot></slot>
            </div>
            <div v-else>
                {{props.title}}
            </div>
        </div>
    </div>
</template>

<script setup>
import Button from "primevue/button";
import {useRoute, useRouter} from "vue-router";
const router = useRouter();
const route = useRoute();

let props = defineProps({
    title: {
        required: false,
        default: ''
    },
    showBack: {
        default: true
    },
    enableSlot: {
        default: false
    },
    backAction: {
        default: null
    }
});

const clickedBack = () => {
    if (props.backAction) {
        props.backAction();
    } else {
        router.back();
    }
}

</script>

<style scoped>

</style>
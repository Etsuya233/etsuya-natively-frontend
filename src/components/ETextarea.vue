<template>
    <textarea @input="textareaKeyDown"
              v-model="value"
              ref="textarea"
              class="w-full outline-none align-top bg-white/0 resize-none"
              :placeholder="props.placeholder">
    </textarea>
</template>

<script setup>
import {onMounted, ref} from "vue";

const value = defineModel('value');
const props = defineProps({
    minHeight: {
        required: false,
        default: 1
    },
    placeholder: {
        required: false,
        default: ''
    }
})

const textarea = ref();
const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
const textAreaMinHeight = props.minHeight * rootFontSize;
const textareaKeyDown = (e) => {
    textarea.value.style.height = '1px';
    let height = textarea.value.scrollHeight;
    textarea.value.style.height = Math.max(height, textAreaMinHeight) + 'px';
}

onMounted(() => {
    textareaKeyDown();
})

</script>

<style scoped>

</style>
<template>
    <div :id="`vditor-${props.id}`" ref="editor"></div>
</template>

<script setup>
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import {onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";

const props = defineProps({
    placeholder: {
        default: ''
    },
    id: {
        default: 'default'
    }
})
const { t, locale, availableLocales } = useI18n();
const editor = ref();

//editor
let toolbar;
const isMd = window.matchMedia('(min-width: 768px)');
if(isMd.matches){
    toolbar = [
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "|",
        "list",
        "ordered-list",
        "check",
        "|",
        "quote",
        "line",
        "code",
        "table",
        "|",
        "fullscreen",
        "edit-mode",
        {
            name: "more",
            toolbar: [
                "both",
                "undo",
                "redo",
                "export",
                "outline",
                "info",
                "help",
            ],
        },
    ]
} else {
    toolbar = [
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "|",
        "list",
        "ordered-list",
        "|",
        "fullscreen",
        "edit-mode",
        {
            name: "more",
            toolbar: [
                "both",
                "undo",
                "redo",
                "check",
                "quote",
                "line",
                "code",
                "table",
                "export",
                "outline",
                "info",
                "help",
            ],
        },
    ]
}

const getValue = () => {
    return editor.value.getValue();
}

onMounted(() => {
    editor.value = new Vditor('vditor-' + props.id, {
        height: '100%',
        width: '100%',
        placeholder: props.placeholder,
        toolbar: toolbar,
    });
})

defineExpose({getValue});

</script>

<style scoped>

</style>
<template>
    <div class="w-full h-full">
        <article class="prose prose-slate prose-code:font-mono dark:prose-invert" >
            <div v-html="rendered"></div>
        </article>
    </div>
</template>

<script setup>
import MarkdownIt from "markdown-it";
import {ref, watch} from "vue";

const md = new MarkdownIt();

const props = defineProps({
    markdown: {
        default: ''
    },
    dynamic: {
        default: false
    }
});
let rendered = ref(md.render(props.markdown));

watch(() => props.markdown, () => {
    if(props.dynamic){
        rendered.value = md.render(props.markdown);
    }
})

</script>

<style>
* {
    user-select: text;
}
</style>
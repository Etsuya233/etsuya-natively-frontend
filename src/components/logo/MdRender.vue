<template>
    <div class="w-full h-full">
        <article class="prose prose-code:font-mono dark:prose-invert prose-p:my-2" >
            <div v-html="rendered"></div>
        </article>
    </div>
</template>

<script setup>
import MarkdownIt from "markdown-it";
import {ref} from "vue";

const md = new MarkdownIt();

const props = defineProps(["markdown"]);
const rendered = ref(md.render(props.markdown));

</script>

<style>

</style>
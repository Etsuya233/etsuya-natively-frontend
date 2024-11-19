<template>
    <div>
        <MdEditor v-model="val" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

let val = ref('');


</script>

<style scoped>
.md-editor-icon {
    width: 1.5rem !important;
    height: 1.5rem !important;
}
</style>
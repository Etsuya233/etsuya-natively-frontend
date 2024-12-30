<template>
    <div class="w-full">
        <div class="flex w-full p-4">
            <div class="w-14 h-14 bg-slate-200 flex-shrink-0"></div>
            <div class="flex flex-col pl-2 w-0 flex-1">
                <div class="overflow-hidden min-w-0">
                    <div class="w-full flex">
                        <div class="text-ellipsis whitespace-nowrap overflow-hidden">
                            Text overflow in css flexBoxqweqw
                        </div>
                        <div class="flex-shrink-0">
                            &nbsp;12:25
                        </div>
                    </div>
                </div>
                <div>Content</div>
            </div>
        </div>
        <div class="w-full">
            {{file}}
            <input type="file" accept="image/*" multiple ref="fileInput" />
        </div>
    </div>
</template>

<script setup>
import EProgress from "@/components/ELangProgress.vue";
import {onMounted, ref} from "vue";

const fileInput = ref();
let file;

const change = (event) => {
    console.log(event, event.target.files);
}

onMounted(() => {
    console.log(fileInput.value);
    fileInput.value.addEventListener("change", change);
    file = ref(fileInput.value.files);
})
</script>

<style>

</style>
<template>
    <br><br><br><br><br>
    <Button @click="notify">toast</Button>
    <Button @click="update">update</Button>
</template>

<script setup>
import {useToast} from "@/utils/toast.js";
import Button from "primevue/button";

const toast = useToast();

const notify = () => {

}

const update = () => {

}
</script>

<style>
:root {
    --toastify-color-info: theme('colors.primary');
    --toastify-color-success: theme('colors.primary');
}
</style>
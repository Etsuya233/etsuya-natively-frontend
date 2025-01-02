<template>
    <div>
        loading...
    </div>
</template>

<script setup>
import {onMounted} from "vue";
import {useChatStore} from "@/stores/chatStore.js";
import {useUserStore} from "@/stores/userStore.js";
import {useRouter} from "vue-router";

const router = useRouter();

onMounted(() => {
    localStorage.clear();
    sessionStorage.clear();
    const chatStore = useChatStore();
    const userStore = useUserStore();
    chatStore.$reset();
    userStore.$reset();
    router.replace({ name: 'Welcome'});
})
</script>

<style scoped>

</style>
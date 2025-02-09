<template>
    <div class="w-full">
        <EHeader class='sticky top-0 z-10 transition-opacity transform-gpu hover:!opacity-100' :title="t('chat.contact')" />
        <div class="w-full">
            <div class="flex flex-col divide-y">
                <UserEntry class="px-4 py-2" v-for="item in contacts" :value="item" @click="router.push({ name: 'Chat', params: { id: item.id }})" />
                <div></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import EHeader from "@/components/etsuya/EHeader.vue";
import {useI18n} from "vue-i18n";
import {onMounted, ref} from "vue";
import {apiGetContact} from "@/api/user.js";
import Avatar from "primevue/avatar";
import {useRouter} from "vue-router";
import UserEntry from "@/components/natively/UserEntry.vue";

const router = useRouter();
const { t, locale, availableLocales } = useI18n();

// mounted
const pageLoading = ref(false);
const contacts = ref([]);

// lifespan
onMounted(() => {
    pageLoading.value = true;
    apiGetContact().then((res) => {
        contacts.value.push(... res);
        pageLoading.value = false;
    });
})

</script>

<style scoped>

</style>
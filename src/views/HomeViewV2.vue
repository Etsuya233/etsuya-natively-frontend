<template>
    <div class="relative">
        <!--        Header-->
        <div class="w-full gap-2 md:gap-4 flex flex-col md:flex-row py-2 px-4 sticky top-0 bg-white z-10 border-surface border-b transition-opacity transform-gpu
                    hover:!opacity-100 dark:bg-surface-900"
             :class="{'opacity-30': isScrollDown}">
            <div class="md:hidden">
                <Logo position="center" size="sm" />
            </div>
            <SelectButton class="flex-1" :options="options" v-model="selected" option-label="name" option-value="value"
                          :allow-empty="false"
                          :pt="{ root: '*:w-full'}"/>
            <div class="hidden md:block">
                <Button icon="pi pi-pencil" rounded as="router-link" :to="{ name: 'PostType'}" />
            </div>
        </div>
        
        <!--        Recommendation-->
        <div class="flex flex-col w-full divide-y dark:divide-gray-700">
            <div v-if="selected === 1" v-for="(item, index) in recommendationPosts" :key="item.id" @click="postClicked(item)"
                 class="w-full flex flex-col gap-1 px-4 py-2">
                
                <PostCard v-model="recommendationPosts[index]" />
                
            </div>
        </div>
        
        <!--        Post-->
        <div class="fixed right-4 bottom-[4.5rem] md:hidden transition" :class="{ 'opacity-0': isScrollDown, 'pointer-events-none': isScrollDown }">
            <Button icon="pi pi-pencil !text-xl" class="!p-7 shadow-lg" rounded as="router-link" :to="{ name: 'PostType'}" />
        </div>
    </div>
</template>

<script setup>
import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';
import {onMounted, ref} from 'vue';
import router from "@/router/router.js";
import {useI18n} from "vue-i18n";
import {useScroll} from "@/utils/scroll.js";
import Tag from "primevue/tag";
import ELangProgress from "@/components/ELangProgress.vue";
import {apiGetPostRecommendation} from "@/api/postV2.js";
import Logo from "@/components/logo/Logo.vue";
import {useToast} from "primevue/usetoast";
import PostCard from "@/components/PostCard.vue";

const { t, locale, availableLocales } = useI18n();
const {isScrollDown} = useScroll();
const toastStore = useToast();

const getButtonSeverity = (vote, value) => {
    if(vote === value) return "primary";
    else return "secondary";
}

//options
let options = ref([
    { name: 'Following', value: 0},
    { name: 'Flow', value: 1},
    { name: 'Trending', value: 2},
])
let selected = ref(1);

//posts
let recommendationPosts = ref([]);
const postClicked = (post) => {
    router.push({ name: 'Post', params: { id: post.id }});
}

// vote
const vote = (item, type) => {
    if(item.vote === type){
        
        return;
    }
}

// lifespan
onMounted(async () => {
    let res = await apiGetPostRecommendation();
    recommendationPosts.value.push(... res);
})

</script>

<style scoped>

</style>
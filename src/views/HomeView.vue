<template>
    <div class="relative">
<!--        Header-->
        <div class="w-full gap-4 flex py-2 px-4 sticky top-0 bg-white z-10 border-surface border-b transition-opacity transform-gpu
                    hover:!opacity-100 dark:bg-surface-900"
             :class="{'opacity-30': isScrollDown}">
            <SelectButton class="flex-1" :options="options" v-model="selected" option-label="name" option-value="value"
                          :allow-empty="false"
                          :pt="{ root: '*:w-full'}"/>
            <div class="hidden md:block">
                <Button icon="pi pi-pencil" rounded as="router-link" :to="{ name: 'PostType'}" />
            </div>
        </div>
        
<!--        Recommendation-->
        <div class="flex flex-col gap-2 *:cursor-pointer w-full divide-y">
            <div v-if="selected === 1" v-for="item in recommendationPosts" :key="item.id" @click="postClicked(item)"
                 class="w-full flex flex-col gap-1 px-4 pt-2">
                <PostInfoCard :item="item" @vote="postVote" />
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
import {apiGetRecommendations, apiVote} from "@/api/post.js";
import Tag from 'primevue/tag';
import router from "@/router/router.js";
import Image from "primevue/image";
import {useI18n} from "vue-i18n";
import {useScroll} from "@/utils/scroll.js";
import PostInfoCard from "@/components/PostInfoCard.vue";
import Popover from 'primevue/popover';
const { t, locale, availableLocales } = useI18n();
const {isScrollDown} = useScroll();


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

//add post


//vote
const getButtonSeverity = (vote, value) => {
    if(vote === value) return "primary";
    else return "secondary";
}
const postVote = async (post, vote, isComment) => {
    try {
        let res = await apiVote({
            id: post.id,
            type: vote,
            post: isComment
        });
        if(res){
            if(vote === 1){
                if(post.vote === -1){
                    post.downvote--;
                    post.vote = 1;
                } else if(post.vote === 1){
                    post.upvote--;
                    post.vote = 0;
                } else {
                    post.upvote++;
                    post.vote = 1;
                }
            } else {
                if(post.vote === 1){
                    post.upvote--;
                    post.vote = -1;
                } else if(post.vote === -1){
                    post.downvote--;
                    post.vote = 0;
                } else {
                    post.downvote++;
                    post.vote = -1;
                }
            }
        }
    } catch (e) {}
}

onMounted(async () => {
    let res = await apiGetRecommendations();
    recommendationPosts.value.push(... res);
})

//test
let testBlur = ref(false);


</script>

<style scoped>

</style>
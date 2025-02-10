<template>
    <div class="relative">
        <!--        Header-->
        <div class="w-full gap-2 md:gap-4 flex flex-col md:flex-row py-2 px-4 sticky top-0 bg-blur z-30 border-surface border-b transition-opacity transform-gpu
                    hover:!opacity-100 dark:bg-surface-900"
             :class="{'opacity-30': isScrollDown}">
            <div class="md:hidden">
                <Logo position="center" size="sm" />
            </div>
            <SelectButton class="flex-1" :options="options" v-model="optionSelectionProxy" option-label="name" option-value="value"
                          :allow-empty="false"
                          :pt="{ root: '*:w-full'}"/>
            <div class="hidden md:block">
                <Button icon="pi pi-pencil" rounded as="router-link" :to="{ name: 'Compose'}" />
            </div>
        </div>
        
        <!--        Recommendation-->
        <div class="flex flex-col w-full">
            <div v-if="selected === 0">
                <div v-for="(item, index) in followingPosts" :key="item.id" @click="postClicked(item)"
                     class="w-full flex flex-col gap-1 px-4 py-2 border-b">
                    <PostCard v-model="followingPosts[index]" />
                </div>
            </div>
            <div v-else-if="selected === 1">
                <div v-for="(item, index) in recommendationPosts" :key="item.id" @click="postClicked(item)"
                     class="w-full flex flex-col gap-1 px-4 py-2 border-b">
                    <PostCard v-model="recommendationPosts[index]" />
                </div>
            </div>
            <div v-else-if="selected === 2">
                <div v-for="(item, index) in trendingPost" :key="item.id" @click="postClicked(item)"
                     class="w-full flex flex-col gap-1 px-4 py-2 border-b">
                    <PostCard v-model="trendingPost[index]" :rank="index + 1" />
                </div>
            </div>
            <div class="w-full select-none">
                <ELoadMore :loading="isLoadingMore" @click="loadMore" />
            </div>
        </div>
        
        
        <!--        Post-->
        <div class="fixed right-4 bottom-[4.5rem] md:hidden transition z-10" :class="{ 'opacity-0': isScrollDown, 'pointer-events-none': isScrollDown }">
            <Button icon="pi pi-pencil !text-xl" class="!p-7 shadow-lg" rounded as="router-link" :to="{ name: 'Compose'}" />
        </div>
    </div>
</template>

<script setup>
import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';
import {nextTick, onActivated, onMounted, ref, watch} from 'vue';
import router from "@/router/router.js";
import {useI18n} from "vue-i18n";
import {useScroll} from "@/utils/scroll.js";
import Tag from "primevue/tag";
import ELangProgress from "@/components/etsuya/ELangProgress.vue";
import {apiGetFollowing, apiGetPostRecommendation, apiGetTrending} from "@/api/postV2.js";
import Logo from "@/components/natively/Logo.vue";
import {useToast} from "primevue/usetoast";
import PostCard from "@/components/natively/PostCard.vue";
import {useRoute} from "vue-router";
import ETransition from "@/components/etsuya/ETransition.vue";
import ELoadMore from "@/components/etsuya/ELoadMore.vue";

const { t, locale, availableLocales } = useI18n();
const { isScrollDown, isAtBottom, isAtBottomSoon } = useScroll();

//options
let options = ref([
    { name: 'Following', value: 0, top: 0},
    { name: 'Flow', value: 1, top: 0},
    { name: 'Trending', value: 2, top: 0},
])
let optionSelectionProxy = ref(1);
let selected = ref(1);

//posts
let recommendationPosts = ref([]);
let followingPosts = ref([]);
const trendingPost = ref([]);
const postClicked = (post) => {
    router.push({ name: 'Post', params: { id: post.id }});
}
const loadMoreRecommendation = async () => {
    let res = await apiGetPostRecommendation(recommendationPosts.value.length === 0? null:
        recommendationPosts.value[recommendationPosts.value.length - 1].id);
    recommendationPosts.value.push(... res);
}
const loadMoreFollowing = async () => {
    let res = await apiGetFollowing(followingPosts.value.length === 0? null:
        followingPosts.value[followingPosts.value.length - 1].id);
    followingPosts.value.push(... res);
}
const loadMoreTrending = async () => {
    let res = await apiGetTrending(trendingPost.value.length + 1);
    trendingPost.value.push(... res);
}
watch(optionSelectionProxy, (newVal, oldVal) => {
    if(newVal !== oldVal){
        options.value[oldVal].top = window.scrollY;
        selected.value = newVal;
        nextTick(() => {
            window.scrollTo({
                top: options.value[newVal].top,
                behavior: 'auto'
            });
        })
    }
    if(newVal === 0){
        if(followingPosts.value.length === 0){
            loadMoreFollowing();
        }
    } else if(newVal === 1){
        if(recommendationPosts.value.length === 0){
            loadMoreRecommendation();
        }
    } else if(newVal === 2){
        if(trendingPost.value.length === 0){
            loadMoreTrending();
        }
    }
    
})

// load more
const isLoadingMore = ref(false);
const loadMore = async () => {
    if(isLoadingMore.value){
        return;
    }
    isLoadingMore.value = true;
    try {
        if(selected.value === 0){
            await loadMoreFollowing();
        } else if(selected.value === 1){
            await loadMoreRecommendation();
        } else if(selected.value === 2){
            await loadMoreTrending();
        }
    } catch (e) {
    
    } finally {
        isLoadingMore.value = false;
    }
}


// lifespan
onMounted(async () => {
    if(recommendationPosts.value.length === 0){
        let res = await apiGetPostRecommendation();
        loadMore();
    }
    
})

</script>

<style scoped>

</style>
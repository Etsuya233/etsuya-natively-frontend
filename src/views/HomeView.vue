<template>
    <div class="relative">
<!--        Header-->
        <div class="w-full gap-4 flex p-4 sticky top-0 bg-white z-10 dark:bg-surface-900 transition-opacity transform-gpu
                    hover:!opacity-100"
             :class="{'opacity-30': isScrollDown}">
            <SelectButton class="flex-1" :options="options" v-model="selected" option-label="name" option-value="value"
                          :allow-empty="false"
                          :pt="{ root: '*:w-full'}"/>
            <div class="hidden md:block">
                <Button icon="pi pi-pencil" rounded as="router-link" :to="{ name: 'Compose'}" />
            </div>
        </div>
        
<!--        Recommendation-->
        <div class="px-4 flex flex-col gap-4 *:cursor-pointer w-full">
            <div v-if="selected === 1" v-for="item in recommendationPosts" :key="item.id" @click="postClicked(item)"
                 class="w-full bg-white dark:bg-surface-900 border-surface border rounded-lg p-3 flex flex-col gap-1">
                <div class="pb-2 flex w-full">
                    <div class="h-11 w-11 flex-shrink-0 rounded-full overflow-hidden">
                        <img class="h-full w-full object-cover" :src="item.avatar" alt="avatar"/>
                    </div>
                    <div class="w-0 overflow-clip flex-1">
                        <div class="pl-3 items-center w-full overflow-x-hidden whitespace-nowrap text-ellipsis">
                            {{item.nickname}}
                        </div>
                        <div class="h-4 pl-3 text-sm w-full text-surface-500">
                            {{item.createTime}}
                        </div>
                    </div>
                </div>
                <div v-if="item.title">
                    <div class="inline-block mr-2 align-top" v-if="item.type === 2">
                        <Tag value="Question" class="h-6"/>
                    </div>
                    <div class="inline font-bold text-lg md:select-text">
                        {{item.title}}
                    </div>
                </div>
                <div class="md:select-text whitespace-pre-line overflow-clip">{{item.content}}
                    <div class="inline-block mr-2 align-top" v-if="item.contentHasMore">
                        <Tag :value="t('post.hasMore')" class="h-6" severity="secondary" />
                    </div>
                </div>
<!--                <div class="md:select-text">-->
<!--                    <md-render :markdown="item.content"></md-render>-->
<!--                </div>-->
                <div class="mt-1 mb-1" v-if="item.voice">
                    <audio controls :src="item.voice.url">
                        Your browser doesn't support Audio.
                    </audio>
                </div>
                <div class="mt-1 flex flex-wrap gap-2" v-if="item.images && item.images.length > 0">
                    <div v-for="img in item.images" class="h-24 w-24 border border-surface rounded-lg overflow-hidden">
                        <Image @click.stop :preview="true" :src="img.url" class="w-full h-full object-cover"/>
                    </div>
                </div>
                <div class="flex gap-2 mt-1">
                    <Button icon="pi pi-thumbs-up" :label="item.upvote" :severity="getButtonSeverity(item.vote, 1)" size="small" @click.stop="" />
                    <Button icon="pi pi-thumbs-down" :label="item.downvote" :severity="getButtonSeverity(item.vote, -1)" size="small" @click.stop="" />
                    <Button class="ml-auto" icon="pi pi-comment" :label="item.commentCount" severity="secondary" size="small" @click.stop="" />
                </div>
            </div>
        </div>
        
<!--        Post-->
        <div class="fixed right-4 bottom-[4.5rem] md:hidden transition" :class="{ 'opacity-0': isScrollDown, 'pointer-events-none': isScrollDown }">
            <Button icon="pi pi-pencil !text-xl" class="!p-7 shadow-lg" rounded as="router-link" :to="{ name: 'Compose'}" />
        </div>
    </div>
</template>

<script setup>
import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';
import {onMounted, ref} from 'vue';
import {apiGetRecommendations} from "@/api/post.js";
import Tag from 'primevue/tag';
import router from "@/router/router.js";
import Image from "primevue/image";
import {useI18n} from "vue-i18n";
import {useScroll} from "@/utils/scroll.js";
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

//vote
const getButtonSeverity = (vote, value) => {
    if(vote === value) return "primary";
    else return "secondary";
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
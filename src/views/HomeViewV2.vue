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
        <div class="flex flex-col w-full divide-y">
            <div v-if="selected === 1" v-for="item in recommendationPosts" :key="item.id" @click="postClicked(item)"
                 class="w-full flex flex-col gap-1 px-4 py-2">
                
                <div class="w-full bg-white dark:bg-surface-900 rounded-lg flex flex-col gap-2 cursor-pointer">
                    <div class="flex w-full">
                        <div class="h-13 w-11 flex-shrink-0 overflow-hidden flex justify-center items-start">
                            <div class="h-11 w-11 rounded-full overflow-hidden mt-1">
                                <img class="w-full h-full object-cover" :src="item.avatar" alt="avatar"/>
                            </div>
                        </div>
                        <div class="flex flex-col w-0 flex-1">
                            <div class="pl-3 overflow-hidden min-w-0">
                                <div class="w-full flex items-center cursor-text">
                                    <div class="text-ellipsis overflow-hidden break-words whitespace-nowrap">{{item.nickname}}</div>
                                    <div class="text-sm text-slate-600 flex-shrink-0">&nbsp;·&nbsp;{{item.createTime}}</div>
                                </div>
                            </div>
                            <div class="min-h-5 flex flex-wrap gap-2 pl-[0.675rem] w-full mt-[0.25rem]">
                                <ELangProgress v-for="lang in item.userLanguages" :lang="lang.language" :proficiency="lang.proficiency" />
                            </div>
                        </div>
                    </div>
                    <div v-if="item.title">
                        <div class="inline-block mr-2 align-top" v-if="item.type === 2">
                            <Tag value="Question" class="h-6"/>
                        </div>
                        <div class="inline font-bold text-lg text-slate-900 md:select-text cursor-text">
                            {{item.title}}
                        </div>
                    </div>
                    <div class="line-clamp-5 cursor-text text-slate-800">
                        <span class="md:select-text whitespace-pre-line">{{item.text}}</span>
                        <span class="inline mr-2 align-top" v-if="item.hasMore">
                            …
                        </span>
                    </div>
                    <div class="w-full" v-if="item.image">
                        <img :src="item.image" class="w-full max-h-[20rem] rounded-xl border object-cover" alt="image"/>
                    </div>
                    <div class="mt-1 mb-1" v-if="item.voice">
                        <audio controls :src="item.voice.url" @click.stop>
                            Your browser doesn't support Audio.
                        </audio>
                    </div>
                    <div class="flex gap-2">
                        <Button rounded icon="pi pi-thumbs-up" :label="item.upvote.toString()" :severity="getButtonSeverity(item.vote, 1)"
                                size="small" pt:icon:class="pl-1" pt:label:class="pr-1" />
                        <Button rounded icon="pi pi-thumbs-down" :label="item.downvote.toString()" :severity="getButtonSeverity(item.vote, -1)"
                                size="small" pt:icon:class="pl-1" pt:label:class="pr-1" />
                        <Button rounded icon="pi pi-comment" :label="item.commentCount" severity="secondary" size="small"
                                @click.stop="" pt:icon:class="pl-1" pt:label:class="pr-1" />
                    </div>
                </div>
                
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

const { t, locale, availableLocales } = useI18n();
const {isScrollDown} = useScroll();

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

//vote
onMounted(async () => {
    let res = await apiGetPostRecommendation();
    recommendationPosts.value.push(... res);
})

</script>

<style scoped>

</style>
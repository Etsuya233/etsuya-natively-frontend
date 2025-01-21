<template>
    <div>
        <EHeader class='sticky top-0 z-10 transition-opacity transform-gpu hover:!opacity-100' :title="t('post.post')"
                 :class="{'opacity-30': isScrollDown}" />
        
        <!--        Post Info-->
        <div v-if="postLoading" class="px-4 py-2 flex flex-col">
            <div class="pb-4 flex w-full">
                <div class="h-12 w-12">
                    <Skeleton width="100%" height="100%" shape="circle"/>
                </div>
                <div class="w-full flex flex-col gap-1">
                    <div class="pl-3 h-6 items-center w-[7rem]">
                        <Skeleton height="100%" />
                    </div>
                    <div class="h-5 pl-3 w-[10rem] pt-1">
                        <Skeleton height="100%" />
                    </div>
                </div>
            </div>
            <div class="h-6 mb-2">
                <Skeleton height="100%" />
            </div>
            <div class="flex flex-col gap-1 w-full">
                <Skeleton />
                <Skeleton />
                <Skeleton width="40%" />
            </div>
            <div class="flex gap-2 mt-4 w-full">
                <Skeleton height="2rem" width="4rem" />
                <Skeleton height="2rem" width="4rem" />
                <Skeleton class="ml-auto" height="2rem" width="4rem" />
            </div>
        </div>
        <div v-else>
            <div class="w-full px-4 py-2 bg-white dark:bg-surface-900 rounded-lg flex flex-col gap-2 cursor-pointer"
                 id="history-0"
                 @click="postClicked">
                <div class="flex w-full">
                    <div class="h-13 w-11 flex-shrink-0 overflow-hidden flex justify-center items-start">
                        <div class="h-11 w-11 rounded-full overflow-hidden mt-1">
                            <img class="w-full h-full object-cover" :src="postInfo.avatar" alt="avatar"/>
                        </div>
                    </div>
                    <div class="flex flex-col w-0 flex-1">
                        <div class="pl-3 overflow-hidden min-w-0">
                            <div class="w-full flex items-center cursor-text">
                                <div class="text-ellipsis overflow-hidden break-words whitespace-nowrap">{{postInfo.nickname}}</div>
                                <div class="text-sm text-slate-600 flex-shrink-0">&nbsp;·&nbsp;{{postInfo.createTime}}</div>
                            </div>
                        </div>
                        <div class="min-h-5 flex flex-wrap gap-2 pl-[0.675rem] w-full mt-[0.25rem]">
                            <ELangProgress v-for="lang in postInfo.userLanguages" :lang="lang.language" :proficiency="lang.proficiency" />
                        </div>
                    </div>
                </div>
                <div v-if="postInfo.title">
                    <div class="inline-block mr-2 align-top" v-if="postInfo.type === 2">
                        <Tag value="Question" class="h-6"/>
                    </div>
                    <div class="inline font-bold text-lg text-slate-900 md:select-text cursor-text">
                        {{postInfo.title}}
                    </div>
                </div>
                <div class="cursor-text text-slate-800">
                    <PostRenderer :content="JSON.parse(postInfo.content)" />
                </div>
                <div class="w-full" v-if="postInfo.image">
                    <img :src="postInfo.image" class="w-full max-h-[20rem] rounded-xl border object-cover" alt="image"/>
                </div>
                <div class="mt-1 mb-1" v-if="postInfo.voice">
                    <audio controls :src="postInfo.voice.url" @click.stop>
                        Your browser doesn't support Audio.
                    </audio>
                </div>
                <div class="flex gap-2" v-show="history.length === 1">
                    <Button rounded icon="pi pi-thumbs-up" :label="postInfo.upvote.toString()" :severity="getButtonSeverity(postInfo.vote, 1)"
                            size="small" pt:icon:class="pl-1" pt:label:class="pr-1" @click="vote(true, id, postInfo.vote)" />
                    <Button rounded icon="pi pi-thumbs-down" :label="postInfo.downvote.toString()" :severity="getButtonSeverity(postInfo.vote, -1)"
                            size="small" pt:icon:class="pl-1" pt:label:class="pr-1" />
                    <Button rounded icon="pi pi-comment" :label="postInfo.commentCount" severity="secondary" size="small"
                            @click.stop="" pt:icon:class="pl-1" pt:label:class="pr-1" @click="comment2Post" />
                    <Button text icon="pi pi-ellipsis-v" class="ml-auto" severity="secondary" size="small"
                            @click.stop="" pt:icon:class="pl-1" pt:label:class="pr-1" @click="postMenuVisible = true" />
                </div>
            </div>
        </div>
        
<!--        <div class="border-slate-100 border-4" />-->
        
<!--        History -->
        <div class="flex flex-col">
            <div v-for="(item, index) in history"
                 :key="item.id"
                 @click="historyClicked(index)">
                <div v-if="index !== 0" :id="`history-${index}`" class="border-primary-200 border-[0.25rem] ml-[2.125rem] h-12 w-0 rounded-full"></div>
                <div v-if="index > 0" class="px-4 py-2 w-full bg-white dark:bg-surface-900 rounded-lg flex flex-col gap-2 cursor-pointer">
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
                    <div class="cursor-text text-slate-800">
                        {{ item.content }}
                    </div>
                    <div class="w-full" v-if="item.compare">
                        <span v-for="d in item.change"
                              class="font-bold rounded select-text"
                              :class="{ 'bg-red-200': d.removed, 'text-red-500': d.removed, 'bg-primary-100': d.added, 'text-primary-700': d.added }">
                            {{ d.value }}
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
                    <div class="flex gap-2" v-show="history.length - 1 === index">
                        <Button rounded icon="pi pi-thumbs-up" :label="item.upvote.toString()" :severity="getButtonSeverity(item.vote, 1)"
                                size="small" pt:icon:class="pl-1" pt:label:class="pr-1" />
                        <Button rounded icon="pi pi-thumbs-down" :label="item.downvote.toString()" :severity="getButtonSeverity(item.vote, -1)"
                                size="small" pt:icon:class="pl-1" pt:label:class="pr-1" />
                        <Button rounded icon="pi pi-comment" :label="item.commentCount" severity="secondary" size="small"
                                @click.stop="" pt:icon:class="pl-1" pt:label:class="pr-1" />
                        <Button text icon="pi pi-ellipsis-v" class="ml-auto" severity="secondary" size="small"
                                @click.stop="" pt:icon:class="pl-1" pt:label:class="pr-1" @click="commentMenuVisible = true" />
                    </div>
                </div>
            </div>
        </div>
        
        <div class="border-slate-100 border-4" />
        
        <!--        Comments-->
        <div class="p-4 text-xl font-bold">
            {{ t('post.comments') }}
        </div>
        <div class="flex flex-col divide-y">
            <div v-for="(item, index) in comment[comment.length - 1]"
                 :key="item.id"
                 :id="`comment-${item.id}`"
                 @click="commentClicked(index)">
                <div class="px-4 py-2 w-full bg-white dark:bg-surface-900 rounded-lg flex flex-col gap-2 cursor-pointer">
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
                    <div class="cursor-text text-slate-800">
                        {{ item.content }}
                    </div>
                    <div class="w-full" v-if="item.compare">
                        <span v-for="d in item.change"
                              class="font-bold rounded select-text"
                              :class="{ 'bg-red-200': d.removed, 'text-red-500': d.removed, 'bg-primary-100': d.added, 'text-primary-700': d.added }">
                            {{ d.value }}
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
                        <Button text icon="pi pi-ellipsis-v" class="ml-auto" severity="secondary" size="small"
                                @click.stop="" pt:icon:class="pl-1" pt:label:class="pr-1" @click="commentMenuVisible = true" />
                    </div>
                </div>
            </div>
            <div class="h-4"></div>
        </div>
        
        <div class="h-10"></div>
        
<!--        <Teleport defer to="#aside">-->
<!--            <div>Hey!</div>-->
<!--        </Teleport>-->
        
        <!--        Menu -->
        <Drawer v-model:visible="postMenuVisible" position="bottom" class="rounded-t-2xl !h-auto" :header="t('post.menu')">
            <EList>
                <EListItem icon="pi-bookmark" :title="t('post.bookmark')" />
                <EListItem icon="pi-sparkles" :title="t('post.navi')" />
                <EListItem icon="pi-flag" :title="t('post.report')" />
            </EList>
        </Drawer>
        <Drawer v-model:visible="commentMenuVisible" position="bottom" class="rounded-t-2xl !h-auto" :header="t('post.menu')">
            <EList>
                <EListItem icon="pi-bookmark" :title="t('post.bookmark')" />
                <EListItem icon="pi-sparkles" :title="t('post.navi')" />
                <EListItem icon="pi-flag" :title="t('post.report')" />
            </EList>
        </Drawer>
    
    </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {nextTick, onBeforeMount, onMounted, ref} from "vue";
import EHeader from "@/components/logo/EHeader.vue";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Skeleton from 'primevue/skeleton';
import {useI18n} from "vue-i18n";
import {useToastStore} from "@/stores/toastStore.js";
import {useScroll} from "@/utils/scroll.js";
import ELangProgress from "@/components/ELangProgress.vue";
import PostRenderer from "@/components/PostRenderer.vue";
import {apiGetCommentList, apiGetPostById} from "@/api/postV2.js";
import Diff from "diff/dist/diff.js";
import Menu from "primevue/menu";
import Popover from "primevue/popover";
import {useNaviStore} from "@/stores/naviStore.js";
import EListItem from "@/components/EListItem.vue";
import Drawer from "primevue/drawer";
import EList from "@/components/EList.vue";

const {isScrollDown} = useScroll();
const { t, locale, availableLocales } = useI18n();
const route = useRoute();
const router = useRouter();
const toastStore = useToastStore();
const naviStore = useNaviStore();

//loading
let postLoading = ref(true);
let commentLoading = ref(false);

//post
let id = ref(null);
let postInfo = ref({
    "id": 0, "title": '', "content": '', "type": 1,
    "userId": 0, "nickname": '', "avatar": '', "bookmarked": 0,
    "upvote": 0, "downvote": 0, "commentCount": 0, "createTime": '',
    images: [], voice: null, contentHasMore: false, vote: 0
});
const postClicked = () => {
    // remove the history after the clicked history comment
    history.value.splice(1);
    // remove the comment belongs to the comment after the clicked history comment
    comment.value.splice(1);
    // scroll to the right position
    nextTick(() => {
        window.scrollTo({
            behavior: "smooth",
            top: 0
        });
    })
}

// history
const history = ref([{id: 0}]); // 0:comment1 1:comment2
const historyClicked = (index) => {
    if(index === history.value.length - 1){
        const currentHistoryId = history.value[index].id;
        // remove the history after the clicked history comment
        history.value.splice(index);
        // remove the comment belongs to the comment after the clicked history comment
        comment.value.splice(index);
        // scroll to the right position
        nextTick(() => {
            document.getElementById(`comment-${currentHistoryId}`).scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        })
    } else {
        // remove the history after the clicked history comment
        history.value.splice(index + 1);
        // remove the comment belongs to the comment after the clicked history comment
        comment.value.splice(index + 1);
        // scroll to the right position
        nextTick(() => {
            document.getElementById(`history-${index}`).scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        })
    }
}

// comment
const comment = ref([]); // 0:post 1:comment1 2:comment2
const comment2Post = () => {
    router.push({
        name: 'ComposeComment',
        query: {
            postId: id.value,
            post: true,
            id: id.value,
        }
    });
}
/**
 * Process the comment got from backend.
 * @param res The response array.
 */
const commentInit = (res) => {
    res.forEach(item => {
        if(item.compare != null){
            const compareObj = JSON.parse(item.compare);
            item.change = Diff.diffChars(compareObj.oldValue, compareObj.newValue);
        }
    })
}
const commentClicked = (index) => {
    const commentWhichClicked = comment.value[comment.value.length - 1][index];
    history.value.push(commentWhichClicked);
    // scroll
    nextTick(() => {
        nextTick(() => {
            document.getElementById(`history-${history.value.length - 1}`).scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        })
    })
    // comment loading
    commentLoading.value = true;
    // init load comments
    comment.value.push([]);
    apiGetCommentList(false, commentWhichClicked.id, null).then((res) => {
        commentInit(res);
        comment.value[history.value.length - 1].push(... res);
    })
    commentLoading.value = false;
}

//vote
const vote = (post, id, type) => {

}
const getButtonSeverity = (vote, value) => {
    if(vote === value) return "primary";
    else return "secondary";
}

// menu
const postMenuVisible = ref(false);
const commentMenuVisible = ref(false);

//lifespans
onBeforeMount(() => {
    let postId = route.params.id;
    if(postId === null || postId === undefined) {
        router.push({ name: 'Home'});
    }
    id.value = route.params.id;
})

onMounted(async () => {
    postLoading.value = true;
    try {
        postInfo.value = await apiGetPostById(id.value);
    } catch (e) {}
    postLoading.value = false;
    commentLoading.value = true;
    comment.value.push([]);
    try {
        let res = await apiGetCommentList(true, id.value, null);
        commentInit(res);
        comment.value[0].push(... res);
    } catch (e){}
    commentLoading.value = false;
})

</script>

<style scoped>

</style>
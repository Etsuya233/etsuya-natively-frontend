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
            <div class="w-full px-4 py-3 rounded-lg flex flex-col gap-2 cursor-pointer"
                 id="history-0"
                 @click="postClicked">
                <PostCard v-model="postInfo" :full-mode="true" :show-footer="history.length === 1" :show-footer-lite="history.length !== 1" :show-more="true" @commented="addOneCommentAtFirst" />
            </div>
        </div>
        
<!--        History -->
        <div class="flex flex-col">
            <div v-for="(item, index) in history"
                 :key="item.id"
                 class="relative"
                 @click="historyClicked(index)">
                <div v-if="index !== 0" class="border-surface-200 dark:border-surface-700 border-[0.25rem] ml-[2.125rem] !h-8 w-0 rounded-full"></div>
                <div class="absolute -top-14" :id="`history-${index}`"></div>
                <div v-if="index > 0" class="px-4 py-2 w-full rounded-lg flex flex-col gap-2 cursor-pointer">
                    <CommentCard v-model="history[index]" :show-footer="index === history.length - 1" :show-footer-lite="index !== history.length - 1" @commented="addOneCommentAtFirst" />
                </div>
            </div>
        </div>
        
        <div class="border-surface-100 dark:border-surface-800 border-4" />
        
        <!--        Comments-->
        <div class="p-4 w-full flex items-center">
            <span class="text-xl font-bold">
                {{ t('post.comments') }}
            </span>
            <div class="ml-auto" v-show="history.length === 1" @click="postCommentMode = (postCommentMode + 1) % 3">
                <span class="pi pi-sort-alt"></span>
                <span class="pl-2">{{ postCommentModes[postCommentMode].label }}</span>
            </div>
        </div>
        <div class="flex flex-col">
            <div v-for="(item, index) in comment[comment.length - 1]"
                 :key="item.id"
                 class="relative border-b border-surface"
                 :class="{ 'bg-primary-50 dark:bg-primary-800': item.commented }"
                 @click="commentClicked(index)">
                <div class="absolute -top-14" :id="`comment-${item.id}`"></div>
                <CommentCard class="px-4 py-3" v-model="comment[comment.length - 1][index]" />
                <div v-if="lastCommentId === item.id" class="border-t text-center text-slate-600 text-sm py-1">
                    {{ t('post.continueReading') }}
                </div>
            </div>
            <div class="w-full select-none">
                <ELoadMore :loading="isLoadingMore" @click="loadMoreComment" />
            </div>
            <div class="h-4"></div>
        </div>
        
        <div class="h-10"></div>
    
    </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {computed, nextTick, onActivated, onBeforeMount, onMounted, ref, watch} from "vue";
import EHeader from "@/components/etsuya/EHeader.vue";
import Button from "primevue/button";
import Skeleton from 'primevue/skeleton';
import {useI18n} from "vue-i18n";
import {useScroll} from "@/utils/scroll.js";
import {apiGetCommentList, apiGetCommentListHot, apiGetCommentParentChain, apiGetPostById} from "@/api/postV2.js";
import Diff from "diff/dist/diff.js";
import {useNaviStore} from "@/stores/naviStore.js";
import PostCard from "@/components/natively/PostCard.vue";
import CommentCard from "@/components/natively/CommentCard.vue";
import {useSelect} from "@/utils/selection.js";
import ELoadMore from "@/components/etsuya/ELoadMore.vue";
import {useUserStore} from "@/stores/userStore.js";
import ESelect from "@/components/etsuya/ESelect.vue";

const { isScrollDown, isAtBottom, isAtBottomSoon } = useScroll();
const { t, locale, availableLocales } = useI18n();
const route = useRoute();
const router = useRouter();
const naviStore = useNaviStore();
const { selected } = useSelect();
const userStore = useUserStore();

//loading
let postLoading = ref(true);
let commentLoading = ref(false);

//post
let id = ref(null);
const commentMode = ref(false);
let postInfo = ref({
    "id": 0, "title": '', "content": '', "type": 1,
    "userId": 0, "nickname": '', "avatar": '', "bookmarked": 0,
    "upvote": 0, "downvote": 0, "commentCount": 0, "createTime": '',
    images: [], voice: null, contentHasMore: false, vote: 0
});
const postClicked = () => {
    if(selected.value){
        return;
    }
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
    if(comment.value[0].length === 0){
        loadMoreComment();
    }
}

// history
const history = ref([{id: 0}]);
/**
 * lastCommentId is the id of the last comment you clicked to see the detail, use to find the right position
 * @type {Ref<UnwrapRef<number>, UnwrapRef<number> | number>}
 */
const lastCommentId = ref(-1);
const historyClicked = (index) => {
    if(selected.value){
        return;
    }
    if(index === history.value.length - 1){
        const currentHistoryId = history.value[index].id;
        // remove the history after the clicked history comment
        history.value.splice(index);
        // remove the comment belongs to the comment after the clicked history comment
        comment.value.splice(index);
        
        lastCommentId.value = currentHistoryId;
        
        // scroll to the right position
        nextTick(() => {
            document.getElementById(`comment-${currentHistoryId}`).scrollIntoView({
                // behavior: "smooth",
                block: "start",
            });
        })
    } else {
        lastCommentId.value = -1;
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
    if(comment.value[comment.value.length - 1].length === 0){
        loadMoreComment();
    }
}

// comment
const isLoadingMore = ref(false);
const postCommentMode = ref(0); // 0 time 1 hot
const postCommentModes = ref([
    { label: t('post.hotOrder'), value: 0 },
    { label: t('post.oldest'), value: 1 },
    { label: t('post.latest'), value: 2 }
])
// todo optimize the variable using compute
const comment = ref([]); // 0:post 1:comment1 2:comment2
const lastId = computed(() => {
    return comment.value[comment.value.length - 1].length === 0?
            null:
            comment.value[comment.value.length - 1][comment.value[comment.value.length - 1].length - 1].id;
});
const loadMoreComment = async () => {
    if(isLoadingMore.value){
        return;
    }
    isLoadingMore.value = false;
    try{
        if(history.value.length === 1){
            // post
            if(postCommentMode.value !== 0){
                const res = await apiGetCommentList(true, postInfo.value.id, lastId.value, postCommentMode.value);
                comment.value[0].push(... res);
            } else {
                const res = await apiGetCommentListHot(postInfo.value.id, comment.value[0].length);
                comment.value[0].push(... res);
            }
        } else {
            // comment
            const res = await apiGetCommentList(false, history.value[history.value.length - 1].id, lastId.value);
            comment.value[comment.value.length - 1].push(... res);
        }
    } catch (e){
        console.log(e);
    } finally {
        isLoadingMore.value = false;
    }
}
watch(postCommentMode, (newVal, oldVal) => {
    if(newVal !== oldVal){
        comment.value[0].splice(0, comment.value[0].length);
        loadMoreComment();
    }
})
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
        // commentInit(res);
        comment.value[history.value.length - 1].push(... res);
    })
    commentLoading.value = false;
}
const addOneCommentAtFirst = (res) => {
    res.nickname = userStore.userInfo.nickname;
    res.userId = userStore.userInfo.id;
    res.avatar = userStore.userInfo.avatar;
    res.userLanguages = userStore.userInfo.languages;
    res.commented = true; // flag whether this is not query from scroll request
    
    // add to top
    comment.value[comment.value.length - 1].unshift(res);
    nextTick(() => {
        window.scroll({
            behavior: "smooth",
            top: 0
        })
    })
}

//lifespans
onBeforeMount(async () => {
    let postId = route.params.id;
    if(postId === null || postId === undefined) {
        router.push({ name: 'Home'});
    }
    commentMode.value = !!route.query.comment;
    id.value = route.params.id;
    
    // data loading
    postLoading.value = true;
    if(commentMode.value){
        try{
            let res = await apiGetCommentParentChain(id.value);
            postInfo.value = res.post;
            id.value = postInfo.value;
            const comments = res.comments;
            comments.forEach((item) => {
                history.value.push(item);
                comment.value.push([]);
            })
            postLoading.value = false;
        } catch (e){}
        commentLoading.value = false;
    } else {
        try {
            postInfo.value = await apiGetPostById(id.value);
        } catch (e) {}
        postLoading.value = false;
        commentLoading.value = true;
        comment.value.push([]);
        nextTick(async () => {
            // scroll to the bottom
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth' // 平滑滚动
            });
            // comment
            try {
                let res = await apiGetCommentListHot(id.value, 0);
                comment.value[0].push(... res);
            } catch (e){} finally {
                commentLoading.value = false;
            }
        })
    }
})

onMounted(async () => {

})

</script>

<style scoped>

</style>
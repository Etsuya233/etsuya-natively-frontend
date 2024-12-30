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
        <div v-else class="px-4 py-2 flex flex-col gap-1">
            <PostInfoCard :item="postInfo" @vote="vote" :show-bookmark="true" />
        </div>
        <Divider v-if="!postLoading" class="!mt-0 !mb-0" />
        
<!--        Post Add Comments, Ready for deprecated -->
        <div class="p-4 pb-2 flex flex-col gap-2 border-b border-surface">
            <div class="h-40">
                <EEditor :placeholder="t('post.addAComment')" ref="postCommentEditor" />
            </div>
            <div class="flex md:hidden justify-end gap-2">
                <Button :badge="images.length === 0? '': images.length.toString()" badgeSeverity="contrast" icon="pi pi-image" size="small" severity="secondary" @click="openImageDialog" />
                <Button :badge="voice? '1': ''" badgeSeverity="contrast" icon="pi pi-microphone" size="small" severity="secondary" @click="openVoiceDialog"/>
                <Button :label="t('post.comment')" size="small" @click="addPostCommentNew" />
            </div>
            <div class="hidden md:flex justify-end gap-2">
                <Button :badge="images.length === 0? '': images.length.toString()" badgeSeverity="contrast" :label="t('post.addImage')" size="small" severity="secondary" @click="openImageDialog" />
                <Button :badge="voice? '1': ''" badgeSeverity="contrast" :label="t('post.addVoice')" size="small" severity="secondary" @click="openVoiceDialog"  />
                <Button :label="t('post.comment')" size="small" @click="addPostCommentNew" />
            </div>
            <Dialog v-model:visible="imageDialogVisible" modal :header="t('post.addImage')" class="min-w-80 md:min-w-[30rem]">
                <ImageUploader :images="images" :image-src="imageSrc" />
            </Dialog>
            <Dialog v-model:visible="voiceDialogVisible" modal :header="t('post.addVoice')" class="min-w-80 max-w-[35rem]">
                <VoiceRecorder v-model:value="voice" v-model:url="voiceUrl" />
            </Dialog>
        </div>
        
        <!--        Comments-->
        <div class="flex flex-col divide-y">
            <div v-for="item in comment" :key="item.id" class="px-4 py-2">
                <PostInfoCard :item="item" :is-post="false" @vote="vote" :show-bookmark="true" @click-bookmark="clickedCommentBookmark" />
            </div>
            <div class="h-4"></div>
        </div>
        
        <div class="h-10"></div>
        
        <Teleport defer to="#aside">
            <div>Hey!</div>
        </Teleport>
    
    </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {nextTick, onBeforeMount, onMounted, ref, toRaw} from "vue";
import EHeader from "@/components/logo/EHeader.vue";
import Button from "primevue/button";
import Tag from "primevue/tag";
import {
    apiAddBookmark,
    apiAddComment,
    apiAddCommentNew,
    apiCreatePost,
    apiGetComment,
    apiGetPost, apiRemoveBookmark,
    apiVote
} from "@/api/post.js";
import Divider from "primevue/divider";
import Skeleton from 'primevue/skeleton';
import EEditor from "@/components/logo/EEditor.vue";
import {useI18n} from "vue-i18n";
import {useToastStore} from "@/stores/toastStore.js";
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import Image from 'primevue/image';
import ImageUploader from "@/components/ImageUploader.vue";
import MdRender from "@/components/logo/MdRender.vue";
import {useScroll} from "@/utils/scroll.js";
import VoiceRecorder from "@/components/VoiceRecorder.vue";
import PostInfoCard from "@/components/PostInfoCard.vue";

const {isScrollDown} = useScroll();
const { t, locale, availableLocales } = useI18n();
const route = useRoute();
const router = useRouter();
const toastStore = useToastStore();

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

//add images
let images = ref([]);
let imageSrc = ref([]); //used for preview
let imageDialogVisible = ref(false);
const openImageDialog = () => {
    imageDialogVisible.value = true;
}

//add voice
let voice = ref();
let voiceUrl = ref();
let voiceDialogVisible = ref(false);
const openVoiceDialog = () => {
    voiceDialogVisible.value = true;
}

//bookmark
let bookmarkLoading = ref(false);
const clickPostBookmark = async () => {
    bookmarkLoading.value = true;
    try {
        if(postInfo.value.bookmarked === 1){
            let res = await apiRemoveBookmark(id, 1);
            if(res) postInfo.value.bookmarked = 0;
        } else {
            let res = await apiAddBookmark(id, 1);
            if(res) postInfo.value.bookmarked = 1;
        }
    } catch (error) { } finally {
        bookmarkLoading.value = false;
    }
}
const clickedCommentBookmark = async (obj) => {
    obj.bookmarkLoading = true;
    try {
        if(obj.bookmarked === 1){
            let res = await apiRemoveBookmark(obj.id, 2);
            if(res) obj.bookmarked = 0;
        } else {
            let res = await apiAddBookmark(obj.id, 2);
            if(res) obj.bookmarked = 1;
        }
    } catch (error) { } finally {

        obj.bookmarkLoading = false;
    }
}


//comments
let comment = ref([]);
let postCommentEditor = ref();
let postCommentInfo = ref({
    postId: id.value,
    content: ''
})
const addPostComment = async () => {
    let content = postCommentEditor.value.getValue();
    let errMsg = '';
    if(content === ''){
        errMsg = t('post.commentNotBlank');
    } else if([... content].length > 4096){
        errMsg = t('post.commentContentLimit');
    } else if(images.value.length > 4){
        errMsg = t('post.imageContentLimit')
    }
    if(errMsg){
        toastStore.add({
            severity: "error",
            summary: t('common.error'),
            detail: errMsg,
            life: 3000
        });
        return;
    }
    postCommentInfo.value.content = content;
    postCommentInfo.value.postId = id.value;
    try {
        let res = await apiAddComment(toRaw(postCommentInfo.value));
        comment.value.push(res);
    } catch (e) {}
    //TODO 跳转评论
}
const addPostCommentNew = async () => {
    let content = postCommentEditor.value.getValue();
    let errMsg = '';
    if(content === ''){
        errMsg = t('post.commentNotBlank');
    } else if([... content].length > 4096){
        errMsg = t('post.commentContentLimit');
    } else if(images.value.length > 4){
        errMsg = t('post.imageContentLimit')
    }
    if(errMsg){
        toastStore.add({
            severity: "error",
            summary: t('common.error'),
            detail: errMsg,
            life: 3000
        });
        return;
    }
    const formData = new FormData();
    formData.append('postId', id.value);
    formData.append('content', content);
    images.value.forEach((item, index) => {
        formData.append(`images`, item);
    });
    if(voice.value !== null){
        formData.append(`voice`, voice.value);
    }
    if(voice.value) formData.append('voice', voice.value);
    try {
        let res = await apiAddCommentNew(formData);
        comment.value.push(res);
    } catch (e) {}
    //TODO 跳转评论
}

//vote
const getButtonSeverity = (vote, value) => {
    if(vote === value) return "primary";
    else return "secondary";
}
const vote = async (post, vote, isPost) => {
    try {
        let res = await apiVote({
            id: post.id,
            type: vote,
            post: isPost
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

//overflow

//lifespans
onBeforeMount(() => {
    let postId = route.params.id;
    postId = route.params.id;
    if(postId === null || postId === undefined) {
        router.push({ name: 'Home'});
    }
    id.value = route.params.id;
})

onMounted(async () => {
    postLoading.value = true;
    try {
        let res = await apiGetPost(id.value);
        postInfo.value = res;
    } catch (e) {}
    postLoading.value = false;
    commentLoading.value = true;
    try {
        let res = await apiGetComment({
            id: id.value,
        });
        comment.value.push(... res);
    } catch (e){}
    commentLoading.value = false;
})

</script>

<style scoped>

</style>
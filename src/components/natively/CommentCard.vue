<template>
    <div class="w-full rounded-lg flex flex-col gap-2 cursor-pointer">
        <div class="flex w-full" @click.stop="router.push({ name: 'User', params: { id: comment.userId } })">
            <div class="h-13 w-11 flex-shrink-0 overflow-hidden flex justify-center items-start">
                <div class="h-11 w-11 rounded-full overflow-hidden mt-1">
                    <img class="w-full h-full object-cover" :src="comment.avatar" alt="avatar"/>
                </div>
            </div>
            <div class="flex flex-col w-0 flex-1">
                <div class="pl-3 overflow-hidden min-w-0">
                    <div class="w-full flex items-center cursor-text">
                        <div class="text-ellipsis overflow-hidden break-words whitespace-nowrap">{{comment.nickname}}</div>
                        <div class="text-sm text-surface-600 dark:text-surface-400 flex-shrink-0">&nbsp;·&nbsp;{{comment.createTime}}</div>
                    </div>
                </div>
                <div class="min-h-5 flex flex-wrap gap-2 pl-[0.675rem] w-full mt-[0.25rem]">
                    <ELangProgress v-for="lang in comment.userLanguages" :lang="lang.language" :proficiency="lang.proficiency" />
                </div>
            </div>
        </div>
        <div class="cursor-text text-surface-800 dark:text-surface-100 whitespace-pre-line break-words">
            {{ comment.content }}
        </div>
        <div class="w-full" v-if="comment.compare">
            <span v-for="d in comment.change"
                  class="font-bold rounded select-text"
                  :class="{ 'bg-red-200': d.removed, 'text-red-500': d.removed, 'bg-primary-100': d.added, 'text-primary-700': d.added }">
                {{ d.value }}
            </span>
        </div>
        <div class="w-full" v-if="comment.image">
            <img :src="comment.image" class="w-full max-h-[20rem] rounded-xl border object-cover" alt="image"/>
        </div>
        <div class="mt-1 mb-1" v-if="comment.voice">
            <audio controls :src="comment.voice" @click.stop>
                Your browser doesn't support Audio.
            </audio>
        </div>
        <div v-if="props.showFooter" class="flex gap-2">
            <Button rounded icon="pi pi-thumbs-up" :label="comment.upvote.toString()" :severity="getButtonSeverity(comment.vote, 1)"
                    size="small" @click.stop="vote(1)" :loading="comment.voteLoading" pt:icon:class="pl-1" pt:label:class="pr-1" />
            <Button rounded icon="pi pi-thumbs-down" :label="comment.downvote.toString()" :severity="getButtonSeverity(comment.vote, -1)"
                    size="small" @click.stop="vote(-1)" :loading="comment.voteLoading" pt:icon:class="pl-1" pt:label:class="pr-1" />
            <Button rounded icon="pi pi-comment" :label="comment.commentCount.toString()" severity="secondary" size="small"
                    @click.stop="doComposeComment" pt:icon:class="pl-1" pt:label:class="pr-1" />
            <Button text icon="pi pi-ellipsis-v" class="ml-auto" severity="secondary" size="small"
                    pt:icon:class="pl-1" pt:label:class="pr-1" @click.stop="moreVisible = true" />
        </div>
        <div v-if="props.showFooterLite" class="text-sm text-slate-600">
            <div class="flex items-center space-x-2">
                <div class="flex items-center">
                    <span class="pi pi-thumbs-up !text-sm"></span>&nbsp;
                    <span>{{ comment.upvote.toString() }}</span>
                </div>
                <span>·</span>
                <div class="flex items-center">
                    <span class="pi pi-thumbs-down !text-sm"></span>&nbsp;
                    <span>{{ comment.downvote.toString() }}</span>
                </div>
                <span>·</span>
                <div class="flex items-center">
                    <span class="pi pi-comment"></span>&nbsp;
                    <span>{{ comment.commentCount.toString() }}</span>
                </div>
            </div>
        </div>
        <Drawer v-model:visible="moreVisible" position="bottom" :header="t('common.more')"
                class="!rounded-t-2xl !z-20 !h-auto !max-h-[90dvh] !max-w-[35rem]">
            <EList>
                <EListItem icon="pi-bookmark" :title="t('post.bookmark')" @click="bookmarkClicked" />
                <EListItem icon="pi-trash" v-if="userStore.userInfo.id === comment.userId" :title="deleteButtonInfo.label" :danger="deleteButtonInfo.danger" :loading="deleteButtonInfo.loading" @click="deletePost" />
            </EList>
        </Drawer>
        <Drawer v-model:visible="bookmarkVisible" position="bottom" :header="t('post.bookmark')"
                class="!rounded-t-2xl !z-20 !h-auto !max-h-[90dvh] !max-w-[35rem]">
            <div class="flex flex-col gap-4">
                <div>
                    {{t('post.bookmarkPostPrompt')}}
                </div>
                <EList :title="t('bookmark.note')" icon="pi pi-pencil">
                    <EListItem enable-slot>
                        <ETextarea v-model="bookmarkNote" />
                    </EListItem>
                </EList>
                <div class="flex *:flex-1 gap-4 sticky bottom-0 drop-shadow-2xl">
                    <Button :label="t('navi.ok')" @click="doBookmark" :loading="bookmarkLoading" icon="pi pi-check" class="!rounded-xl" />
                </div>
            </div>
        </Drawer>
        <Drawer v-model:visible="commentVisible" position="bottom" :header="t('post.comment')"
                class="!rounded-t-2xl !z-20 !h-auto !max-h-[90dvh] !max-w-[35rem]">
            <ComposeComment :post-id="comment.postId" :is-post="false" :id="comment.id" @commented="commented" />
        </Drawer>
    </div>
</template>

<script setup>
import ELangProgress from "@/components/etsuya/ELangProgress.vue";
import Button from "primevue/button";
import {computed, onBeforeMount, onMounted, ref} from "vue";
import {apiCreateBookmark, apiDeleteComment, apiDeletePost, apiVote} from "@/api/postV2.js";
import Drawer from "primevue/drawer";
import EList from "@/components/etsuya/EList.vue";
import EListItem from "@/components/etsuya/EListItem.vue";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import ETextarea from "@/components/etsuya/ETextarea.vue";
import ComposeComment from "@/views/tab/home/ComposeComment.vue";
import Diff from "diff/dist/diff.js";
import {useUserStore} from "@/stores/userStore.js";

const { t, locale, availableLocales } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const emits = defineEmits(['commented']);

const comment = defineModel();
const props = defineProps({
    showFooter: {
        default: true,
    },
    showMore: {
        default: true,
    },
    showFooterLite: {
        default: false,
        type: Boolean
    }
})

const getButtonSeverity = (vote, value) => {
    if(vote === value) return "primary";
    else return "secondary";
}

// more
const moreVisible = ref(false);
const bookmarkVisible = ref(false);
const bookmarkLoading = ref(false);
const bookmarkNote = ref("");
const bookmarkClicked = () => {
    moreVisible.value = false;
    bookmarkVisible.value = true;
}
const doBookmark = () => {
    bookmarkLoading.value = true;
    apiCreateBookmark(2, comment.value.id, null, bookmarkNote.value).then(res => {
        bookmarkVisible.value = false;
    }).catch((err) => {}).finally(() => {
        bookmarkLoading.value = false;
    })
}
const deleteClickedCount = ref(0);
const deleteButtonInfo = computed(() => {
    if(deleteClickedCount.value === 0){
        return {
            label: t('post.delete'),
            danger: false,
            loading: false
        }
    } else if(deleteClickedCount.value === 1) {
        return {
            label: t('post.deleteConfirm'),
            danger: true,
            loading: false,
        }
    } else {
        return {
            label: t('post.deleting'),
            danger: true,
            loading: true,
        }
    }
})
const deletePost = () => {
    if(deleteClickedCount.value === 0){
        deleteClickedCount.value++;
    } else {
        deleteClickedCount.value++;
        apiDeleteComment(comment.value.id).then(res => {
            router.go(-1);
        });
    }
}

// vote
const vote = (type) => {
    if(type === comment.value.vote){
        type = 0;
    }
    comment.value.voteLoading = true;
    apiVote(comment.value.id, false, type).then((res) => {
        comment.value.upvote = res.upvoteCount;
        comment.value.downvote = res.downvoteCount;
        comment.value.vote = res.vote;
    }).catch((e) => {}).finally(() => {
        comment.value.voteLoading = false;
    })
}

// comment
const commentVisible = ref(false);
const doComposeComment = () => {
    commentVisible.value = true;
    // router.push({
    //     name: 'ComposeComment',
    //     query: {
    //         post: false,
    //         postId: comment.value.postId,
    //         id: comment.value.id,
    //     }
    // });
}
const commented = (res) => {
    commentVisible.value = false;
    comment.value.commentCount ++;
    emits('commented', res);
}

onBeforeMount(() => {
    if(comment.value.compare != null){
        const compareObj = JSON.parse(comment.value.compare);
        comment.value.change = Diff.diffChars(compareObj.oldValue, compareObj.newValue);
    }
})

</script>

<style scoped>

</style>
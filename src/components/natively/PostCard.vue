<template>
    <div class="w-full bg-white dark:bg-inherit rounded-lg flex flex-col gap-2 cursor-pointer">
        <div v-if="props.showUser" class="flex w-full" @click.stop="router.push({ name: 'User', params: { id: post.userId }})">
            <div class="h-13 w-11 flex-shrink-0 overflow-hidden flex justify-center items-start">
                <div class="h-11 w-11 rounded-full overflow-hidden mt-1">
                    <img class="w-full h-full object-cover" :src="post.avatar" alt="avatar"/>
                </div>
            </div>
            <div class="flex flex-col w-0 flex-1">
                <div class="pl-3 overflow-hidden min-w-0">
                    <div class="w-full flex items-center cursor-text">
                        <div class="text-ellipsis overflow-hidden break-words whitespace-nowrap">{{post.nickname}}</div>
                        <div v-if="post.createTime" class="text-sm text-slate-600 dark:text-slate-100 flex-shrink-0">&nbsp;·&nbsp;{{post.createTime}}</div>
                    </div>
                </div>
                <div class="min-h-5 flex flex-wrap gap-2 pl-[0.675rem] w-full mt-[0.25rem]">
                    <ELangProgress v-for="lang in post.userLanguages" :lang="lang.language" :proficiency="lang.proficiency" />
                </div>
            </div>
        </div>
        <div v-if="post.title">
            <div class="inline-block mr-2 align-top" v-if="post.type === 2">
                <Tag value="Question" class="h-6"/>
            </div>
            <div class="inline font-bold text-lg text-slate-900 dark:text-inherit md:select-text cursor-text">
                {{post.title}}
            </div>
        </div>
        <div v-if="props.fullMode" class="cursor-text text-slate-800">
            <PostRenderer :content="post.content" />
        </div>
        <div v-if="props.searchMode" class="line-clamp-3">
            <div class="searchContent" v-html="post.highlightedContent"></div>
        </div>
        <div v-if="!props.fullMode && !props.searchMode" class="line-clamp-5 cursor-text text-slate-800 dark:text-inherit">
            <span class="md:select-text whitespace-pre-line">{{post.content}}</span>
            <span class="inline mr-2 align-top" v-if="post.hasMore">…</span>
        </div>
        <div class="w-full" v-if="!props.fullMode && props.showAttachment && post.image">
            <img :src="post.image" class="w-full max-h-[20rem] rounded-xl border object-cover" alt="image"/>
        </div>
        <div class="mt-1 mb-1" v-if="!props.fullMode && props.showAttachment && post.voice">
            <audio controls :src="post.voice.url" @click.stop>
                Your browser doesn't support Audio.
            </audio>
        </div>
        <div v-if="props.showFooter" class="flex gap-2">
            <Button rounded icon="pi pi-thumbs-up" :label="post.upvote.toString()" :severity="getButtonSeverity(post.vote, 1)"
                    size="small" :loading="post.voteLoading" pt:icon:class="pl-1" pt:label:class="pr-1" @click.stop="vote(1)" />
            <Button rounded icon="pi pi-thumbs-down" :label="post.downvote.toString()" :severity="getButtonSeverity(post.vote, -1)"
                    size="small" :loading="post.voteLoading" pt:icon:class="pl-1" pt:label:class="pr-1" @click.stop="vote(-1)" />
            <Button rounded icon="pi pi-comment" :label="post.commentCount" severity="secondary" size="small" @click="doComposeComment"
                    @click.stop="" pt:icon:class="pl-1" pt:label:class="pr-1" />
            <Button v-if="props.showMore" class="ml-auto" text severity="secondary" size="small" icon="pi pi-ellipsis-v" @click.stop="moreVisible = true" />
        </div>
        <Drawer v-model:visible="moreVisible" position="bottom" :header="t('post.more')"
                class="!rounded-t-2xl !z-20 !h-auto !max-h-[90dvh] !max-w-[35rem]">
            <EList>
                <EListItem icon="pi-bookmark" :title="t('post.bookmark')" @click="bookmarkClicked" />
                <EListItem icon="pi-sparkles" :title="t('post.navi')" />
                <EListItem icon="pi-flag" :title="t('post.report')" />
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
    </div>
</template>

<script setup>
import Tag from "primevue/tag";
import ELangProgress from "@/components/etsuya/ELangProgress.vue";
import Button from "primevue/button";
import Drawer from "primevue/drawer";
import {onMounted, ref, watch} from "vue";
import PostRenderer from "@/components/natively/PostRenderer.vue";
import EListItem from "@/components/etsuya/EListItem.vue";
import EList from "@/components/etsuya/EList.vue";
import {useI18n} from "vue-i18n";
import {apiCreateBookmark, apiVote} from "@/api/postV2.js";
import {useRouter} from "vue-router";
import ETextarea from "@/components/etsuya/ETextarea.vue";

const { t, locale, availableLocales } = useI18n();
const router = useRouter();

// props
const post = defineModel();
const props = defineProps({
    showUser: {
        default: true,
    },
    showFooter: {
        default: true,
    },
    showAttachment: {
        default: true,
    },
    showMore: {
        default: false,
    },
    fullMode: {
        default: false,
    },
    searchMode: {
        default: false
    }
})

// ui
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
    apiCreateBookmark(1, post.value.id, null, bookmarkNote.value).then(res => {
        bookmarkVisible.value = false;
    }).catch((err) => {}).finally(() => {
        bookmarkLoading.value = false;
    })
}

// vote
const vote = (type) => {
    if(type === post.value.vote){
        type = 0;
    }
    post.value.voteLoading = true;
    apiVote(post.value.id, true, type).then((res) => {
        post.value.upvote = res.upvoteCount;
        post.value.downvote = res.downvoteCount;
        post.value.vote = res.vote;
    }).catch((e) => {}).finally(() => {
        post.value.voteLoading = false;
    })
}

// comment
const doComposeComment = () => {
    router.push({
        name: 'ComposeComment',
        query: {
            post: true,
            postId: post.value.id,
            id: post.value.id,
        }
    });
}

</script>

<style>
.searchContent > em {
    font-style: normal;
    background-color: theme('colors.primary-100');
    border-radius: 0.25em;
    font-weight: bold;
    color: theme('colors.primary-700');
    overflow: hidden;
}
</style>
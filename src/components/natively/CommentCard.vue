<template>
    <div class="w-full bg-white dark:bg-surface-900 rounded-lg flex flex-col gap-2 cursor-pointer">
        <div class="flex w-full">
            <div class="h-13 w-11 flex-shrink-0 overflow-hidden flex justify-center items-start">
                <div class="h-11 w-11 rounded-full overflow-hidden mt-1">
                    <img class="w-full h-full object-cover" :src="comment.avatar" alt="avatar"/>
                </div>
            </div>
            <div class="flex flex-col w-0 flex-1">
                <div class="pl-3 overflow-hidden min-w-0">
                    <div class="w-full flex items-center cursor-text">
                        <div class="text-ellipsis overflow-hidden break-words whitespace-nowrap">{{comment.nickname}}</div>
                        <div class="text-sm text-slate-600 flex-shrink-0">&nbsp;·&nbsp;{{comment.createTime}}</div>
                    </div>
                </div>
                <div class="min-h-5 flex flex-wrap gap-2 pl-[0.675rem] w-full mt-[0.25rem]">
                    <ELangProgress v-for="lang in comment.userLanguages" :lang="lang.language" :proficiency="lang.proficiency" />
                </div>
            </div>
        </div>
        <div class="cursor-text text-slate-800 whitespace-pre-line">
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
            <Button rounded icon="pi pi-comment" :label="comment.commentCount" severity="secondary" size="small"
                    @click.stop="doComposeComment" pt:icon:class="pl-1" pt:label:class="pr-1" />
            <Button text icon="pi pi-ellipsis-v" class="ml-auto" severity="secondary" size="small"
                    pt:icon:class="pl-1" pt:label:class="pr-1" @click.stop="moreVisible = true" />
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
import ELangProgress from "@/components/etsuya/ELangProgress.vue";
import Button from "primevue/button";
import {onMounted, ref} from "vue";
import {apiCreateBookmark, apiVote} from "@/api/postV2.js";
import Drawer from "primevue/drawer";
import EList from "@/components/etsuya/EList.vue";
import EListItem from "@/components/etsuya/EListItem.vue";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import ETextarea from "@/components/etsuya/ETextarea.vue";

const { t, locale, availableLocales } = useI18n();
const router = useRouter();

const comment = defineModel();
const props = defineProps({
    showFooter: {
        default: true,
    },
    showMore: {
        default: true,
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
const doComposeComment = () => {
    router.push({
        name: 'ComposeComment',
        query: {
            post: false,
            postId: comment.value.postId,
            id: comment.value.id,
        }
    });
}

</script>

<style scoped>

</style>
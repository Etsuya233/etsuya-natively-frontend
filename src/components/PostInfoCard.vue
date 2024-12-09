<template>
    <div class="w-full bg-white dark:bg-surface-900 rounded-lg  flex flex-col gap-1" :class="{'cursor-pointer': props.isPost}">
        <div class="pb-2 flex w-full">
            <div class="h-11 w-11 flex-shrink-0 rounded-full overflow-hidden">
                <img class="h-full w-full object-cover" :src="props.item.avatar" alt="avatar"/>
            </div>
            <div class="w-0 overflow-clip flex-1">
                <div class="pl-3 items-center w-full overflow-x-hidden whitespace-nowrap text-ellipsis">
                    {{props.item.nickname}}
                </div>
                <div class="h-4 pl-3 text-sm w-full text-surface-500">
                    {{props.item.createTime}}
                </div>
            </div>
        </div>
        <div v-if="props.item.title">
            <div class="inline-block mr-2 align-top" v-if="props.item.type === 2">
                <Tag value="Question" class="h-6"/>
            </div>
            <div class="inline font-bold text-lg md:select-text">
                {{props.item.title}}
            </div>
        </div>
        <div v-if="props.item.parentId" class="cursor-pointer py-1">
            <div class="bg-slate-100 rounded-lg text-sm p-2 text-slate-600">
                <span class="pi pi-reply !text-sm"></span>&nbsp;&nbsp;
                <span>{{props.item.parentContent}}</span>
                <span v-if="props.item.parentHasMore"> ...</span>
            </div>
        </div>
        <div class="whitespace-pre-line overflow-clip">
            <span class="md:select-text">{{props.item.content}}</span>&nbsp;
            <span class="inline-block mr-2 align-top" v-if="props.item.contentHasMore">
                <Tag :value="t('post.hasMore')" class="h-6" severity="secondary" />
            </span>
        </div>
        <div class="mt-1 mb-1" v-if="props.item.voice">
            <audio controls :src="props.item.voice.url">
                Your browser doesn't support Audio.
            </audio>
        </div>
        <div class="mt-1 flex flex-wrap gap-2" v-if="props.item.images && props.item.images.length > 0">
            <div v-for="img in props.item.images" class="h-24 w-24 border border-surface rounded-lg overflow-hidden">
                <Image @click.stop :preview="true" :src="img.url" class="w-full h-full object-cover"/>
            </div>
        </div>
        <div class="flex gap-2 mt-1">
            <Tag :value="props.tag" v-if="showTag && props.tag" :icon="props.tagIcon" />
            <Button icon="pi pi-thumbs-up" :label="props.item.upvote.toString()" :severity="getButtonSeverity(props.item.vote, 1)"
                    size="small" @click.stop="emit('vote', props.item, 1, isPost)" v-if="props.showSummary" />
            <Button icon="pi pi-thumbs-down" :label="props.item.downvote.toString()" :severity="getButtonSeverity(props.item.vote, -1)"
                    size="small" @click.stop="emit('vote', props.item, -1, isPost)" v-if="props.showSummary" />
            <Button icon="pi pi-comment" :label="props.item.commentCount" severity="secondary" size="small"
                    @click.stop="" v-if="props.showSummary" />
            <Button class="ml-auto" icon="pi pi-bookmark" size="small" v-if="props.showBookmark" :loading="props.item.bookmarkLoading"
                    :severity="getButtonSeverity(props.item.bookmarked, 1)" @click.stop="emit('clickBookmark', props.item)"/>
        </div>
    </div>
</template>

<script setup>
import Button from "primevue/button";
import Image from "primevue/image";
import Tag from "primevue/tag";
import {useI18n} from "vue-i18n";

const props = defineProps({
    item: {},
    isPost: {
        default: true,
    },
    showSummary: {
        default: true
    },
    showBookmark: {
        default: false,
    },
    tag: {
        default: ''
    },
    showTag: {
        default: false
    },
    tagIcon: {
        default: ''
    }
});
const emit = defineEmits(['vote', 'clickBookmark']);
const { t, locale, availableLocales } = useI18n();

const getButtonSeverity = (vote, value) => {
    if(vote === value) return "primary";
    else return "secondary";
}

</script>

<style scoped>

</style>
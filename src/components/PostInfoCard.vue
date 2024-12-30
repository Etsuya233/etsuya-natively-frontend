<template>
    <div class="w-full bg-white dark:bg-surface-900 rounded-lg flex flex-col gap-2" :class="{'cursor-pointer': props.isPost}">
        <div class="flex w-full" v-if="header">
            <div class="h-13 w-11 flex-shrink-0 overflow-hidden flex justify-center items-end">
                <div class="h-11 w-11 rounded-full overflow-hidden">
                    <img class="w-full h-full object-cover" :src="props.item.avatar" alt="avatar"/>
                </div>
            </div>
            <div class="flex flex-col w-0 flex-1">
                <div class="pl-3 overflow-hidden min-w-0">
                    <div class="w-full flex items-center">
                        <div class="text-ellipsis overflow-hidden break-words whitespace-nowrap">{{props.item.nickname}}</div>
                        <div class="text-sm text-slate-600 flex-shrink-0">&nbsp;·&nbsp;{{props.item.createTime}}</div>
                    </div>
                </div>
                <div class="h-5 flex gap-2 pl-[0.675rem] w-full mt-[0.25rem]">
                    <ELangProgress v-for="lang in props.item.userLanguages" :lang="lang.language" :proficiency="lang.proficiency" />
                </div>
            </div>
        </div>
        <div v-if="props.item.title">
            <div class="inline-block mr-2 align-top" v-if="props.item.type === 2">
                <Tag value="Question" class="h-6"/>
            </div>
            <div class="inline font-bold text-lg text-slate-900 md:select-text">
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
        <div class="max-h-[48rem] whitespace-pre-wrap overflow-clip" ref="contentContainer" :class="{ 'max-h-none': expanded }" >
            <div v-if="props.markdown"><MdRender :markdown="props.item.content" /></div>
            <span class="md:select-text text-slate-800">{{props.item.content}}</span>&nbsp;
            <span class="inline-block mr-2 align-top" v-if="props.item.contentHasMore">
                <Tag :value="t('post.hasMore')" class="h-6" severity="secondary" />
            </span>
            <div class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/100 to-white/0" v-if="isOverflow && !expanded" />
        </div>
        <div class="flex justify-center -translate-y-4" v-if="isOverflow && !expanded">
            <Button icon="pi pi-angle-down" label="Expand" severity="secondary" @click="expandContent" />
        </div>
        <div class="flex justify-center mb-4 sticky bottom-16" v-if="isOverflow && expanded">
            <Button icon="pi pi-angle-up" label="Collapse" severity="secondary" @click="expandContent" />
        </div>
        <div class="mt-1 mb-1" v-if="props.item.voice">
            <audio controls :src="props.item.voice.url" @click.stop>
                Your browser doesn't support Audio.
            </audio>
        </div>
        <div class="flex flex-wrap gap-2" v-if="props.item.images && props.item.images.length > 0">
            <div v-for="img in props.item.images" class="h-24 w-24 border border-surface rounded-lg overflow-hidden">
                <Image @click.stop :preview="true" :src="img.url" class="w-full h-full object-cover"/>
            </div>
        </div>
        <div class="flex gap-2">
            <Tag :value="props.tag" v-if="showTag && props.tag" :icon="props.tagIcon" />
            <Button rounded icon="pi pi-thumbs-up" :label="props.item.upvote.toString()" :severity="getButtonSeverity(props.item.vote, 1)"
                    size="small" @click.stop="emit('vote', props.item, 1, isPost)" v-if="props.showSummary" pt:icon:class="pl-1" pt:label:class="pr-1" />
            <Button rounded icon="pi pi-thumbs-down" :label="props.item.downvote.toString()" :severity="getButtonSeverity(props.item.vote, -1)"
                    size="small" @click.stop="emit('vote', props.item, -1, isPost)" v-if="props.showSummary" pt:icon:class="pl-1" pt:label:class="pr-1" />
            <Button rounded icon="pi pi-comment" :label="props.item.commentCount" severity="secondary" size="small"
                    @click.stop="" v-if="props.showSummary" pt:icon:class="pl-1" pt:label:class="pr-1" />
            <Button class="ml-auto" icon="pi pi-bookmark" size="small" v-if="props.showBookmark" :loading="props.item.bookmarkLoading"
                    :severity="getButtonSeverity(props.item.bookmarked, 1)" @click.stop="emit('clickBookmark', props.item)" pt:root:class="!rounded-full !px-[0.375rem] !w-[2.25rem]"/>
        </div>
    </div>
</template>

<script setup>
import Button from "primevue/button";
import Image from "primevue/image";
import Tag from "primevue/tag";
import {useI18n} from "vue-i18n";
import ELangProgress from "@/components/ELangProgress.vue";
import MdRender from "@/components/logo/MdRender.vue";
import {nextTick, onMounted, onUpdated, ref} from "vue";

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
    },
    header: {
        default: true
    },
    markdown: {
        default: false
    }
});
const emit = defineEmits(['vote', 'clickBookmark']);
const { t, locale, availableLocales } = useI18n();

const getButtonSeverity = (vote, value) => {
    if(vote === value) return "primary";
    else return "secondary";
}

//overflow
const contentContainer = ref();
let isOverflow = ref(false);
const isContentOverflow = () => {
    console.log('activated')
    if(contentContainer.value){
        const el = contentContainer.value;
        console.log(el.scrollHeight , el.clientHeight);
        isOverflow.value = el.scrollHeight > el.clientHeight;
    }
}
let expanded = ref(false);
const expandContent = () => {
    expanded.value = !expanded.value;
}

onMounted(() => {
    nextTick(() => {
        isContentOverflow();
    })
})

</script>

<style scoped>

</style>
<template>
    <div class="w-full">
        <EHeader class='sticky top-0 z-10 transition-opacity transform-gpu hover:!opacity-100' :show-back="false" :title="t('bookmark.bookmark')"
                 :class="{'opacity-30': isScrollDown}" />
        <div class="w-full flex flex-col divide-y *:border-surface min-h-[calc(100dvh-8rem)] md:min-h-[calc(100dvh-8rem)]">
            <div v-for="(item, index) in bookmarks" class="px-4 py-3 relative">
                
                <div class="absolute right-4 top-2 -z-10">
                    <div class="text-surface-200/70 dark:text-surface-700/70  font-bold">
                        <span v-if="item.type === 1" class="pi pi-align-right !text-6xl"></span>
                        <span v-else-if="item.type === 2" class="pi pi-comment !text-6xl"></span>
                        <span v-else class="pi pi-pencil !text-6xl"></span>
                    </div>
                </div>
                
<!--                Post-->
                <div v-if="item.type === 1" class="w-full" @click="router.push({ name: 'Post', params: { id: item.referenceId } })">
                    <PostCard v-model="bookmarks[index]" :show-footer="false" />
                </div>
                
<!--                Comment -->
                <div v-else-if="item.type === 2" class="w-full rounded-lg flex flex-col gap-2 cursor-pointer"
                     @click="router.push({ name: 'Post', params: { id: item.referenceId }, query: { 'comment': 1 }})">
                    <CommentCard v-model="bookmarks[index]" :show-footer="false" />
                </div>
                
<!--                Text-->
                <div v-else class="" @click="noteEdit(item)" >
                    {{ item.content }}
                </div>
                
                <div class="mt-2" v-if="item.note">
                    <EListItem enable-slot rounded>
                        <div class="!text-slate-600 dark:!text-surface-400 leading-4">
                            <span class="pi pi-pencil !text-xs"></span><span class="ml-2 text-sm">{{t('bookmark.note')}}</span>
                        </div>
                        <div class="w-full overflow-hidden">
                            {{ item.note }}
                            <div class="inline-block float-right translate-y-1/4 text-slate-600 dark:text-surface-400 text-sm">{{ item.createTime }}</div>
                        </div>
                    </EListItem>
                </div>
                
                <div class="mt-2 flex gap-2">
<!--                    <Tag class="!rounded-2xl ml-auto" @click.stop severity="secondary"-->
<!--                            :value="item.type === 1? t('bookmark.post'): item.type === 2? t('bookmark.comment'): t('bookmark.note')" />-->
                    <Button rounded severity="secondary" size="small" icon="pi pi-pencil" :label="t('bookmark.edit')" @click.stop="noteEdit(item)" />
                    <Button rounded severity="secondary" size="small" icon="pi pi-trash" :label="t('bookmark.remove')" :loading="item.removeLoading" @click.stop="deleteBookmark(item)" />
                </div>
            </div>
            <ELoadMore :loading="loadingMore" @click="loadMore" />
        </div>
        
        <!--        Add-->
        <div class="sticky float-right pr-4 w-fit bottom-[4.5rem] md:bottom-6 transition z-10">
            <Button icon="pi pi-pencil !text-xl" class="!p-7 shadow-lg" rounded @click="addBookmark"/>
        </div>
        
        <Drawer v-model:visible="noteEditorVisible" position="bottom" :header="t('bookmark.edit')"
                class="!rounded-t-2xl !z-20 !h-auto !max-h-[90dvh] !max-w-[35rem]">
            <div class="w-full flex flex-col gap-4">
                <EList v-if="textEditorVisible" :title="t('bookmark.text')" icon="pi pi-align-left">
                    <EListItem enable-slot>
                        <ETextarea v-model="textEditValue"></ETextarea>
                    </EListItem>
                </EList>
                <EList :title="t('bookmark.note')" icon="pi pi-pencil">
                    <EListItem enable-slot>
                        <ETextarea v-model="noteEditValue"></ETextarea>
                    </EListItem>
                </EList>
                <div class="drop-shadow-2xl flex *:flex-1 gap-4">
                    <Button class="!rounded-2xl" severity="secondary" :label="t('bookmark.close')" />
                    <Button class="!rounded-2xl" :label="t('bookmark.update')" @click="updateBookmark" :loading="selectedBookmark.updateLoading" />
                </div>
            </div>
        </Drawer>
    </div>
</template>

<script setup>
import EHeader from "@/components/etsuya/EHeader.vue";
import {useScroll} from "@/utils/scroll.js";
import {onBeforeMount, ref} from "vue";
import {apiDeleteBookmark, apiGetBookmarkList, apiUpdateBookmark} from "@/api/postV2.js";
import Tag from "primevue/tag";
import Button from "primevue/button";
import {useI18n} from "vue-i18n";
import PostCard from "@/components/natively/PostCard.vue";
import CommentCard from "@/components/natively/CommentCard.vue";
import EListItem from "@/components/etsuya/EListItem.vue";
import Drawer from "primevue/drawer";
import EList from "@/components/etsuya/EList.vue";
import ETextarea from "@/components/etsuya/ETextarea.vue";
import {useRouter} from "vue-router";
import ELoadMore from "@/components/etsuya/ELoadMore.vue";
import {useNaviStore} from "@/stores/naviStore.js";

const {isScrollDown} = useScroll();
const { t, locale, availableLocales } = useI18n();
const router = useRouter();
const naviStore = useNaviStore();

const loadingMore = ref(false);

const bookmarks = ref([]);

const noteEditorVisible = ref();
const noteEditValue = ref('');
const textEditValue = ref('');
const textEditorVisible = ref(false);
const selectedBookmark = ref(null);
const noteEdit = (item) => {
    selectedBookmark.value = item;
    noteEditorVisible.value = true;
    noteEditValue.value = item.note;
    textEditValue.value = item.content;
    if(item.type === 0){
        textEditorVisible.value = true;
    } else {
        textEditorVisible.value = false;
    }
}

const addBookmark = () => {
    naviStore.awakeBookmark();
}

const updateBookmark = () => {
    selectedBookmark.value.updateLoading = true;
    apiUpdateBookmark(selectedBookmark.value.id, textEditValue.value, noteEditValue.value).then((res) => {
        selectedBookmark.value.note = noteEditValue.value;
        selectedBookmark.value.content = textEditValue.value;
        noteEditorVisible.value = false;
    }).catch((err) => {}).finally(() => {
        selectedBookmark.value.updateLoading = false;
    })
}

const deleteBookmark = (item) => {
    item.removeLoading = true;
    apiDeleteBookmark(item.id).then(() => {
        // todo
    }).catch((err) => {}).finally(() => {
        item.removeLoading = false;
    })
}

const loadMore = () => {
    if(loadingMore.value){
        return;
    }
    loadingMore.value = true;
    const lastId = bookmarks.value.length > 0 ? bookmarks.value[bookmarks.value.length - 1].id : null;
    apiGetBookmarkList(lastId).then((res) => {
        res.forEach(item => {
            item.removeLoading = false;
            item.updateLoading = false;
        })
        bookmarks.value.push(... res);
    }).catch(e => {}).finally(() => {
        loadingMore.value = false;
    })
}

onBeforeMount(() => {
    loadMore();
})

</script>

<style scoped>

</style>
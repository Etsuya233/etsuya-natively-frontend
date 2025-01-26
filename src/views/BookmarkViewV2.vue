<template>
    <div class="w-full`">
        <EHeader class='sticky top-0 z-10 transition-opacity transform-gpu hover:!opacity-100' :show-back="false" :title="t('bookmark.bookmark')"
                 :class="{'opacity-30': isScrollDown}" />
        <div class="w-full flex flex-col divide-y">
            <div v-for="(item, index) in bookmarks" class="px-4 py-2">
<!--                Post-->
                <div v-if="item.type === 1" class="w-full" @click="router.push({ name: 'Post', params: { id: item.referenceId } })">
                    <PostCard v-model="bookmarks[index]" :show-footer="false" />
                </div>
                
<!--                Comment -->
                <div v-else-if="item.type === 2" class="w-full bg-white dark:bg-surface-900 rounded-lg flex flex-col gap-2 cursor-pointer">
                    <CommentCard v-model="bookmarks[index]" :show-footer="false" />
                </div>
                
<!--                Text-->
                <div v-else class="" @click="noteEdit(item)" >
                    {{ item.content }}
                </div>
                
                <div class="mt-2">
                    <EListItem enable-slot rounded>
                        <div class="w-full overflow-hidden">
                            {{ item.note }}
                            <div class="inline-block float-right translate-y-1/4 text-slate-600 text-sm">{{ item.createTime }}</div>
                        </div>
                    </EListItem>
                </div>
                
                <div class="mt-2 flex gap-2">
                    <Tag class="!rounded-2xl mr-auto" @click.stop
                            :value="item.type === 1? t('bookmark.post'): item.type === 2? t('bookmark.comment'): t('bookmark.note')" />
                    <Button rounded severity="secondary" size="small" icon="pi pi-pencil" :label="t('bookmark.editNote')" @click.stop="noteEdit(item)" />
                    <Button rounded severity="warn" size="small" icon="pi pi-trash" :label="t('bookmark.remove')" :loading="item.removeLoading" @click.stop="deleteBookmark(item)" />
                </div>
            </div>
            
            <div></div>
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
import EHeader from "@/components/logo/EHeader.vue";
import {useScroll} from "@/utils/scroll.js";
import {onBeforeMount, ref} from "vue";
import {apiDeleteBookmark, apiGetBookmarkList, apiUpdateBookmark} from "@/api/postV2.js";
import Tag from "primevue/tag";
import Button from "primevue/button";
import {useI18n} from "vue-i18n";
import PostCard from "@/components/PostCard.vue";
import CommentCard from "@/components/CommentCard.vue";
import EListItem from "@/components/EListItem.vue";
import Drawer from "primevue/drawer";
import EList from "@/components/EList.vue";
import ETextarea from "@/components/ETextarea.vue";
import {useRouter} from "vue-router";

const {isScrollDown} = useScroll();
const { t, locale, availableLocales } = useI18n();
const router = useRouter();

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

onBeforeMount(() => {
    apiGetBookmarkList(null).then((res) => {
        res.forEach(item => {
            item.removeLoading = false;
            item.updateLoading = false;
        })
        bookmarks.value = res;
    });
})

</script>

<style scoped>

</style>
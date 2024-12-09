<template>
    <div class="w-full">
        <EHeader class='sticky top-0 z-10 transition-opacity transform-gpu hover:!opacity-100' :title="t('bookmark.bookmark')"
                 :class="{'opacity-30': isScrollDown}" />
        <div class="flex flex-col gap-3 divide-y">
            <div v-for="item in bookmarks" class="p-4 pb-0">
                <PostInfoCard :show-tag="true" :tag="item.type === 1? ' Post': ' Comment'" :tag-icon="item.type === 1? 'pi pi-align-left': 'pi pi-comment'"
                              :item="item" :show-summary="false" :show-bookmark="true" @click-bookmark="clickBookmark"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import EHeader from "@/components/logo/EHeader.vue";
import {useScroll} from "@/utils/scroll.js";
import {useI18n} from "vue-i18n";
import {onMounted, ref} from "vue";
import {apiAddBookmark, apiGetBookmarks, apiRemoveBookmark} from "@/api/post.js";
import PostInfoCard from "@/components/PostInfoCard.vue";

const {isScrollDown} = useScroll();
const { t, locale, availableLocales } = useI18n();

let bookmarks = ref([]);

const clickBookmark = async (obj) => {
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

onMounted(async () => {
    let res = await apiGetBookmarks()
    res.forEach(item => {
        item.bookmarked = 1;
    })
    bookmarks.value.push(... res);
})
</script>

<style scoped>

</style>
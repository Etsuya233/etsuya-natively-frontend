<template>
    <div class="w-full flex flex-col">
        <!-- Search -->
        <div class="z-[1] pt-3 px-4 border-b sticky top-0 bg-white/90 backdrop-blur-2xl">
            <div class="w-full">
                <div ref="searchContainer" class="relative z-[3]">
                    <div class="w-full flex items-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 active:bg-slate-300">
                        <div class="h-10 w-10 mr-1 ml-1 rounded-full bg-white flex justify-center items-center cursor-pointer" @click="goBack">
                            <span class="pi pi-arrow-left !text-sm"></span>
                        </div>
                        <input
                                v-model="searchData.content"
                                class="flex-1 outline-none bg-none pl-4 py-3 bg-transparent min-w-0"
                                type="text"
                                :placeholder="t('search.placeholder')"
                                @focus="showHistory = true"
                                ref="searchBar"
                        />
                        <div class="h-10 px-4 mr-1 ml-2 rounded-full bg-white flex items-center cursor-pointer" @click="handleSearch">
                            <span class="pi pi-search !text-sm"></span><span class="text-sm ml-2">{{t('search.search')}}</span>
                        </div>
                    </div>
                    <!-- 历史记录容器 -->
                    <ETransition>
                        <div
                                ref="historyContainer"
                                class="-z-[3] absolute -top-2 -left-2 -right-2 rounded-3xl shadow-lg border bg-white overflow-hidden"
                                v-show="showHistory"
                        >
                            <div class="mt-14 p-2">
                                <EList :title="t('search.history')" icon="pi pi-history">
                                    <EListItem v-for="(item, index) in searchHistory"
                                               @click="selectHistory(item)"
                                               :title="item"
                                               :key="index" />
                                </EList>
                            </div>
                        </div>
                    </ETransition>
                </div>
                <div class="flex z-[1]">
                    <div v-for="item in searchModes" class="pt-2 pb-1 px-2" @click="changeSearchMode(item.mode)"
                         :class="{ 'border-b-4': item.mode === searchData.mode, 'border-primary': item.mode === searchData.mode, 'text-primary-emphasis': item.mode === searchData.mode }">
                        <span :class="item.icon" class="mr-2 !text-sm"></span><span>{{ item.name }}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!--        Result-->
        <div v-if="searchData.mode === 'post'" class="">
            <PostCard class="px-4 py-2 border-b" v-for="(item, index) in searchResult.post" v-model="searchResult.post[index]" :show-footer="false" :show-attachment="false" :search-mode="true" />
        </div>
        <div v-else-if="searchData.mode === 'user'" class="">
            <PostCard class="px-4 py-2 border-b" v-for="(item, index) in searchResult.user" v-model="searchResult.user[index]" :show-footer="false" :show-attachment="false" :search-mode="true" />
        </div>
        <ELoadMore :loading="loading" />
    </div>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {ref, onMounted, onUnmounted, onBeforeMount, watch, nextTick, onActivated} from "vue";
import EList from "@/components/etsuya/EList.vue";
import EListItem from "@/components/etsuya/EListItem.vue";
import ETransition from "@/components/etsuya/ETransition.vue";
import {apiSearch} from "@/api/search.js";
import PostCard from "@/components/natively/PostCard.vue";
import {useRoute, useRouter} from "vue-router";
import ELoadMore from "@/components/etsuya/ELoadMore.vue";
import {useScroll} from "@/utils/scroll.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { isAtBottomSoon } = useScroll();

// 搜索相关
const loading = ref(false);
const showHistory = ref(false);
const searchContainer = ref(null);
const historyContainer = ref(null);
const searchBar = ref(null);
const searchModes = ref([
    { mode: 'post', name: t('search.post'), icon: 'pi pi-align-left' },
    { mode: 'user', name: t('search.user'), icon: 'pi pi-user' },
])
const searchData = ref({
    content: '',
    mode: 'post',
});
const searchResult = ref({
    post: [],
    user: [],
    bookmark: []
})
const searchYPosition = ref({ post: 0, user: 0, bookmark: 0 });
const changeSearchMode = (mode) => {
    searchData.value.mode = mode;
};
const handleSearch = () => {
    if (searchData.value.content.trim()) {
        router.push({ name: 'SearchResult', params: { content: searchData.value.content }});
        showHistory.value = false;
    }
};
const goBack = () => {
    router.go(-1);
}
const loadMore = async () => {
    if(loading.value) return;
    loading.value = true;
    const from = searchResult.value[searchData.value.mode].length;
    try {
        let res;
        if(searchData.value.mode === 'post'){
            res = await apiSearch({ ...searchData.value, from });
        } else if(searchData.value.mode === 'user'){
        
        }
        searchResult.value[searchData.value.mode].push(... res);
    } catch (e){
        console.log(e);
    } finally {
        loading.value = false;
    }
}
watch(() => searchData.value.mode, (newVal, oldValue) => {
    if(newVal === oldValue) return;
    searchYPosition.value[oldValue] = window.scrollY;
    if(searchResult.value[oldValue].length === 0){
        loadMore();
    }
    nextTick(() => {
        window.scrollTo({
            top: searchYPosition.value[newVal],
            behavior: 'auto'
        });
    })
})
watch(isAtBottomSoon, (newVal, oldVal) => {
    console.log(newVal, oldVal, searchData.value);
    if(newVal && !oldVal) {
        loadMore();
    }
})

// 新增搜索历史相关逻辑
const searchHistory = ref([]);
const HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;
const loadHistory = () => {
    try {
        const history = localStorage.getItem(HISTORY_KEY);
        searchHistory.value = history ? JSON.parse(history) : [];
    } catch (e) {
        console.error('读取搜索历史失败:', e);
        searchHistory.value = [];
    }
};
const saveSearchHistory = (content) => {
    if (!content.trim()) return;

    // 去重并保留最新记录
    const newHistory = [
        content.trim(),
        ...searchHistory.value.filter(item => item !== content.trim())
    ].slice(0, MAX_HISTORY_ITEMS);

    searchHistory.value = newHistory;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
};
const selectHistory = (content) => {
    searchData.value.content = content;
    showHistory.value = true;
};

// 点击外部区域处理
const handleClickOutside = (event) => {
    if (!showHistory.value) return;

    const isInsideSearch = searchContainer.value?.contains(event.target);
    const isInsideHistory = historyContainer.value?.contains(event.target);

    if (!isInsideSearch && !isInsideHistory) {
        showHistory.value = false;
    }
};

// 生命周期
onBeforeMount(async () => {
    searchData.value.content = route.params.content;
    
    // history
    loadHistory();
    saveSearchHistory(searchData.value.content);

    loadMore();
})
onActivated(() => {
    searchData.value.content = route.params.content;
})
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>
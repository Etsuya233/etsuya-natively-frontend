<template>
    <div class="w-full flex flex-col">
        <!-- Search -->
        <div class="py-3 px-4 border-b sticky top-0 bg-white/90 backdrop-blur-2xl">
            <div class="w-full relative z-30">
                <div ref="searchContainer" class="w-full flex items-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 active:bg-slate-300">
                    <input
                            v-model="searchData.content"
                            class="flex-1 outline-none bg-none pl-4 py-3 bg-transparent min-w-0"
                            type="text"
                            :placeholder="t('search.placeholder')"
                            @focus="showHistory = true"
                            ref="searchBar"
                    />
                    <div class="h-10 px-4 mr-1 ml-2 rounded-full bg-white flex items-center" @click="handleSearch">
                        <span class="pi pi-search !text-sm"></span><span class="text-sm ml-2">{{t('search.search')}}</span>
                    </div>
                </div>
                <!-- 历史记录容器 -->
                <ETransition>
                    <div
                            ref="historyContainer"
                            class="absolute -top-2 -left-2 -right-2 rounded-3xl shadow-lg border bg-white -z-10 overflow-hidden"
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
        </div>
        
<!--        Result-->
        <div class="">
            <PostCard class="px-4 py-2 border-b" v-for="(item, index) in searchResult" v-model="searchResult[index]" :show-footer="false" :show-attachment="false" :search-mode="true" />
        </div>
    </div>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {ref, onMounted, onUnmounted} from "vue";
import EList from "@/components/etsuya/EList.vue";
import EListItem from "@/components/etsuya/EListItem.vue";
import ETransition from "@/components/etsuya/ETransition.vue";
import {apiSearch} from "@/api/search.js";
import PostCard from "@/components/natively/PostCard.vue";

const { t } = useI18n();

// 搜索相关
const showHistory = ref(false);
const searchContainer = ref(null);
const historyContainer = ref(null);
const searchBar = ref(null);
const searchData = ref({
    content: ''
});
const searchResult = ref([]);
const handleSearch = () => {
    if (searchData.value.content.trim()) {
        saveSearchHistory(searchData.value.content);
        
        apiSearch({
            content: searchData.value.content
        }).then((res) => {
            searchResult.value.splice(0, searchResult.value.length, ...res);
        });
        
        showHistory.value = false;
    }
};

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
onMounted(() => {
    loadHistory();
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>
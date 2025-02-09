<template>
    <div>
        <EHeader class='sticky top-0 z-10 transition-opacity transform-gpu hover:!opacity-100' :enable-slot="true">
            <div v-if="userInfo.id && userInfo.relationship !== -2" class="flex items-center">
                <div class="h-10 w-10 mr-4 flex-shrink-0">
                    <img :src="userInfo.avatar" class="object-cover rounded-full" alt="avatar"/>
                </div>
                <div class="overflow-hidden text-ellipsis">{{userInfo.nickname}}</div>
            </div>
            <div v-if="userInfo.relationship === -2" class="">
                :(
            </div>
        </EHeader>
        
        <div v-if="userInfo.id && userInfo.relationship !== -2" class="relative w-full">
            <div class="h-32 w-full overflow-hidden">
                <img class="w-full h-full object-cover blur scale-125" :src="userInfo.avatar" alt="banner"/>
            </div>
            <div class="absolute top-[4.5rem] left-4">
                <img class="w-28 h-28 rounded-full ring-4 ring-white" :src="userInfo.avatar" alt="avatar"/>
            </div>
            <div class="w-full h-12 flex">
                <div class="ml-auto mt-2 mr-3 *:ml-2">
                    <Button v-if="!isMe" rounded
                            :icon="userFollowButtonInfo.icon"
                            :severity="userFollowButtonInfo.severity"
                            :label="userFollowButtonInfo.label"
                            :loading="followLoading"
                            @click="followClicked"/>
                    <Button class="!border-none" outlined rounded icon="pi pi-ellipsis-v" severity="secondary" size="small" />
                </div>
            </div>
            <div class="px-4 flex flex-col pt-4 pb-3 w-full">
                <div class="flex w-full">
                    <div class="overflow-hidden text-ellipsis w-0 flex-1">
                        <div class="text-3xl font-bold whitespace-nowrap overflow-x-hidden text-ellipsis">
                            {{userInfo.nickname}}
                        </div>
                    </div>
                </div>
                <div class="text-slate-600">@{{userInfo.username}}</div>
                <div class="pt-2 flex gap-2">
                    <ELangProgress v-for="(lang, index) in userInfo.languages" :key="index" :lang="lang.lang" :proficiency="lang.proficiency" />
                </div>
                <div class="pt-2">
                    <span class="hover:underline" @click="router.push({ name: 'UserFollowing', params: { id: userInfo.id }})">
                        <span class="font-bold">{{userInfo.following}}</span>
                        <span class="text-slate-600 pr-4">&nbsp{{t('user.following')}}</span>
                    </span>
                    <span class="hover:underline" @click="router.push({ name: 'UserFollower', params: { id: userInfo.id }})">
                        <span class="font-bold">{{userInfo.followers}}</span>
                        <span class="text-slate-600">&nbsp{{t('user.followers')}}</span>
                    </span>
                </div>
            </div>
            <Divider class="!my-0" />
            
            
            <div class="flex flex-col divide-surface-200">
                <div v-for="(item, index) in posts" :key="item.id" @click="postClicked(item)" class="w-full px-4 py-2 border-b">
                    <PostCard v-model="posts[index]" :show-user="false" />
                </div>
                <ELoadMore :loading="postLoading" />
            </div>
            
            
        </div>
        
        <div class="max-md:h-14"></div>
        
        <div v-if="userInfo.relationship === -2" class="p-4">
            <div class="text-4xl font-bold">
                {{t('user.oops')}}
            </div>
            <div class="mt-4 text-xl">
                {{ t('user.bannedPrompt', { username: userInfo.username }) }}
            </div>
        </div>
    </div>
</template>

<script setup>
import EHeader from "@/components/etsuya/EHeader.vue";
import {useI18n} from "vue-i18n";
import {computed, onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/stores/userStore.js";
import {apiFollow, apiGetCurrent, apiGetUser} from "@/api/user.js";
import Divider from "primevue/divider";
import Button from "primevue/button";
import ELangProgress from "@/components/etsuya/ELangProgress.vue";
import {apiGetUserPostList} from "@/api/postV2.js";
import PostCard from "@/components/natively/PostCard.vue";
import ELoadMore from "@/components/etsuya/ELoadMore.vue";
import {cloneDeep} from "lodash";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const { t, locale, availableLocales } = useI18n();

//user info
let id = ref('');
let isMe = ref(false);
let userInfo = ref({
    "id": '',
    "username": "",
    "nickname": "",
    "password": "",
    "email": "",
    "gender": '1',
    "location": "",
    "timezone": "",
    "avatar": "",
    following: 0,
    followers: 0,
    "status": 1,
    "version": 1,
    "createTime": "",
    "updateTime": "",
    languages: [],
    relationship: 0
});

// follow
const followLoading = ref(false);
const userFollowButtonInfo = computed(() => {
    const { relationship } = userInfo.value;
    // 定义映射关系
    const followButtonMap = {
        0: { label: t('user.follow'), icon: 'pi pi-plus', severity: 'secondary' },
        1: { label: t('user.following'), icon: 'pi pi-heart', severity: 'primary' },
        2: { label: t('user.followBack'), icon: 'pi pi-plus', severity: 'info' },
        3: { label: t('user.mutualFollowing'), icon: 'pi pi-heart-fill', severity: 'primary' },
        // -2: { label: t('user.unblock'), icon: 'pi pi-ban', severity: 'warn' },
        // -1: { label: t('user.unblock'), icon: 'pi pi-ban', severity: 'warn' },
    };
    // 返回默认值或对应关系
    return followButtonMap[relationship] || { label: t('user.follow'), icon: 'pi pi-plus', severity: 'primary' };
});
const followClicked = () => {
    if(userInfo.value.relationship === -1){
        //unblock
    } else if(userInfo.value.relationship >= 0){
        followLoading.value = true;
        const followOrNot = userInfo.value.relationship === 0 || userInfo.value.relationship === 2;
        apiFollow(userInfo.value.id, followOrNot).then((res) => {
            userInfo.value.followers = res.followers;
            userInfo.value.following = res.following;
            userInfo.value.relationship = res.relationship;
        }).catch().finally(() => followLoading.value = false);
    }
}

//user post
let posts = ref([]);
const postClicked = (post) => {
    router.push({ name: 'Post', params: { id: post.id }});
}
const postLoading = ref(false);

//lifespans
onBeforeMount(async () => {
    //user info
    id.value = route.params.id || userStore.userInfo.id;
    if(!id.value){
        await router.push({ name: 'Welcome'});
        return;
    }
    let res;
    if(id.value === userStore.userInfo.id){
        isMe.value = true;
        res = await userStore.update();
    } else {
        res = await apiGetUser(id.value);
    }
    userInfo.value = res;
    //posts
    res = await apiGetUserPostList(id.value, null);
    posts.value.splice(0, posts.value.length);
    res.forEach(post => {
        post.avatar = userInfo.value.avatar;
        post.nickname = userInfo.value.nickname;
        post.userLanguages = userInfo.value.languages;
    })
    posts.value.push(... res);
})

</script>

<style scoped>

</style>
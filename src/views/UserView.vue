<template>
    <div>
        <EHeader class='sticky top-0 z-10 transition-opacity transform-gpu hover:!opacity-100' :title="userInfo.nickname" />
        
        <div v-if="userInfo.id" class="relative w-full">
            <div class="h-32 w-full overflow-hidden">
                <img class="w-full h-full object-cover blur scale-125" :src="userInfo.avatar" alt="banner"/>
            </div>
            <div class="absolute top-[4.5rem] left-4">
                <img class="w-28 h-28 rounded-full ring-4 ring-white" :src="userInfo.avatar" alt="avatar"/>
            </div>
            <div class="w-full h-12 flex">
                <div class="ml-auto mt-2 mr-3" v-if="isMe">
                    <Button severity="secondary" icon="pi pi-pencil" rounded :label="t('common.edit')" outlined />
                </div>
            </div>
            <div class="pl-4 flex flex-col py-4 w-full pr-4">
                <div class="flex w-full">
                    <div class="overflow-hidden text-ellipsis w-0 flex-1">
                        <div class="text-3xl font-bold whitespace-nowrap overflow-x-hidden text-ellipsis">
                            {{userInfo.nickname}}
                        </div>
                    </div>
                </div>
                <div class="text-slate-600">@{{userInfo.username}}</div>
                <div class="pt-2">
                    <span class="hover:underline">
                        <span class="font-bold">{{userInfo.following}}</span>
                        <span class="text-slate-600 pr-4">&nbsp{{t('user.following')}}</span>
                    </span>
                    <span class="hover:underline">
                        <span class="font-bold">{{userInfo.followers}}</span>
                        <span class="text-slate-600">&nbsp{{t('user.followers')}}</span>
                    </span>
                </div>
            </div>
            <Divider class="!my-0" />
            <div class="flex flex-col gap-4 divide-y divide-surface-200">
                <div v-for="item in posts" :key="item.id" @click="postClicked(item)" class="w-full pt-4 px-4">
                    <PostInfoCard :item="item" @vote="postVote" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import EHeader from "@/components/logo/EHeader.vue";
import {useI18n} from "vue-i18n";
import {onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/stores/userStore.js";
import {apiGetCurrent, apiGetUser} from "@/api/user.js";
import Divider from "primevue/divider";
import Button from "primevue/button";
import {apiGetUserPosts, apiVote} from "@/api/post.js";
import PostInfoCard from "@/components/PostInfoCard.vue";

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
});

//user post
let posts = ref([]);
const postClicked = (post) => {
    router.push({ name: 'Post', params: { id: post.id }});
}
const getButtonSeverity = (vote, value) => {
    if(vote === value) return "primary";
    else return "secondary";
}

//vote
const postVote = async (post, vote, isComment) => {
    try {
        let res = await apiVote({
            id: post.id,
            type: vote,
            post: isComment
        });
        console.log(res === true, res === false);
        if(res){
            if(vote === 1){
                if(post.vote === -1){
                    post.downvote--;
                }
                post.upvote++;
            } else {
                if(post.vote === 1){
                    post.upvote--;
                }
                post.downvote++;
            }
            post.vote = vote;
        }
    } catch (e) {}
}

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
        res = await apiGetCurrent();
        isMe.value = true;
        userStore.userInfo = res;
    } else {
        res = await apiGetUser(id.value);
    }
    userInfo.value = res;
    //posts
    res = await apiGetUserPosts(id.value, null);
    posts.value.splice(0, posts.value.length);
    res.forEach(post => {
        post.avatar = userInfo.value.avatar;
        post.nickname = userInfo.value.nickname;
    })
    posts.value.push(... res);
})

</script>

<style scoped>

</style>
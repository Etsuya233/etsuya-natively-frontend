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
                            :icon="userFollowButtonIcon"
                            :severity="userFollowButtonSeverity"
                            :label="userFollowButtonLabel"
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
            <div class="flex flex-col divide-y divide-surface-200">
                <div v-for="item in posts" :key="item.id" @click="postClicked(item)" class="w-full px-4 py-2">
                    <PostInfoCard :item="item" :header="false" @vote="postVote" />
                </div>
            </div>
        </div>
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
import EHeader from "@/components/logo/EHeader.vue";
import {useI18n} from "vue-i18n";
import {computed, onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/stores/userStore.js";
import {apiFollow, apiGetCurrent, apiGetUser} from "@/api/user.js";
import Divider from "primevue/divider";
import Button from "primevue/button";
import {apiGetUserPosts, apiVote} from "@/api/post.js";
import PostInfoCard from "@/components/PostInfoCard.vue";
import ELangProgress from "@/components/ELangProgress.vue";

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
const userFollowButtonLabel = computed(() => {
    switch (userInfo.value.relationship) {
        case -2: return t('user.unblock');
        case -1: return t('user.unblock');
        case 0: return t('user.follow');
        case 1: return t('user.following');
        case 2: return t('user.followBack');
        case 3: return t('user.mutualFollowing');
        default: return t('user.follow');
    }
})
const userFollowButtonIcon = computed(() => {
    switch (userInfo.value.relationship) {
        case -2: return 'pi pi-ban';
        case -1: return 'pi pi-ban';
        case 0: return 'pi pi-plus';
        case 1: return 'pi pi-heart';
        case 2: return 'pi pi-plus';
        case 3: return 'pi pi-heart-fill';
        default: return 'pi pi-plus';
    }
})
const userFollowButtonSeverity = computed(() => {
    switch (userInfo.value.relationship) {
        case -2: return 'warn';
        case -1: return 'warn';
        case 0: return 'secondary';
        case 1: return 'primary';
        case 2: return 'info';
        case 3: return 'primary'
        default: return 'primary';
    }
})
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
        post.userLanguages = userInfo.value.languages;
    })
    posts.value.push(... res);
})

</script>

<style scoped>

</style>
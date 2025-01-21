import {defineStore} from 'pinia';
import {ref} from "vue";

export const usePostStore = defineStore('post', () => {
    const post = ref({
        "id": 0, "title": '', "content": '', "type": 1,
        "userId": 0, "nickname": '', "avatar": '', "bookmarked": 0,
        "upvote": 0, "downvote": 0, "commentCount": 0, "createTime": '',
        images: [], voice: null, contentHasMore: false, vote: 0
    });

    function $reset(){
        post.value = {
            "id": 0, "title": '', "content": '', "type": 1,
            "userId": 0, "nickname": '', "avatar": '', "bookmarked": 0,
            "upvote": 0, "downvote": 0, "commentCount": 0, "createTime": '',
            images: [], voice: null, contentHasMore: false, vote: 0
        };
    }

    function setPost(post){
        post.value = post;
    }

    return {$reset, post, setPost};
});
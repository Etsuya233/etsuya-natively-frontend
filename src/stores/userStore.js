import {defineStore} from 'pinia';
import {ref} from "vue";

export const useUserStore = defineStore('user', () => {
    let emptyUser = {
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
        "updateTime": ""
    };

    let userInfo = ref(JSON.parse(JSON.stringify(emptyUser)));

    userInfo.value.id = localStorage.getItem("userId");

    return {userInfo}
});
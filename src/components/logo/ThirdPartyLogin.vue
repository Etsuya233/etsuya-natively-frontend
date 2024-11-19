<template>
    <div class="flex gap-2 justify-center">
        <Button severity="secondary" icon="pi pi-google" label="Google" @click="googleRedirect" />
        <Button severity="secondary" icon="pi pi-github" label="GitHub" @click="githubRedirect" />
        <Button severity="secondary" label="Gitee" @click="giteeRedirect" />
    </div>
</template>

<script setup>
import Button from "primevue/button";

const googleRedirect = () => {
    location.href = "https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=215926351170-a68j733ru3iaupngn50hjpkae6j69h1i.apps.googleusercontent.com&redirect_uri=http://localhost:5173/oauth/google&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email";
}

const githubRedirect = () => {
    location.href = "https://github.com/login/oauth/authorize?client_id=Ov23lib6QLmYD6zH8wU3&redirect_uri=http://localhost:5173/oauth/github&scope=user:email%20read:user";
}

const giteeRedirect = () => {
    location.href = "https://gitee.com/oauth/authorize?client_id=f01d74beed0ddd12cabcdd494978b9487ec373a1144f50f8102d629123089db7&redirect_uri=http://localhost:5173/oauth/gitee&response_type=code&scope=user_info%20emails";
}

</script>

<style>

</style>
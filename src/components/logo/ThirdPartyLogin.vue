<template>
    <div class="flex gap-2 justify-center">
        <Button severity="secondary" icon="pi pi-google" @click="googleRedirect" />
        <Button severity="secondary" icon="pi pi-twitter" />
        <Button severity="secondary" icon="pi pi-github" />
    </div>
</template>

<script setup>
import Button from "primevue/button";

const googleRedirect = () => {
    location.href = "https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=215926351170-a68j733ru3iaupngn50hjpkae6j69h1i.apps.googleusercontent.com&redirect_uri=http://localhost:5173/oauth/google&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email";
}

</script>

<style>

</style>
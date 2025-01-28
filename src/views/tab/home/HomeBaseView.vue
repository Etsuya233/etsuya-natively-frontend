<template>
    <div class="w-full">
        <RouterView v-slot="{ Component, route }">
            <KeepAlive include="HomeView">
                <Component :is="Component" :key="undefined" />
            </KeepAlive>
        </RouterView>
    </div>
</template>

<script setup>

</script>

<style scoped>

</style>
<template>
    <div class="w-full">
        <RouterView v-slot="{ Component }">
<!--            <KeepAlive include="Home">-->
                <Component :is="Component" />
<!--            </KeepAlive>-->
        </RouterView>
    </div>
</template>

<script setup>

</script>

<style scoped>

</style>
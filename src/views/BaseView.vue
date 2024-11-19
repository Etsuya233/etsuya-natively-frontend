<template>
    <div class="flex justify-center">
        <div class="flex w-full max-w-screen-xl">
        
<!--            Navigation-->
            <div class="fixed left-0 right-0 bottom-0 flex justify-evenly p-1 border-t border-surface bg-white/70 z-10
            backdrop-blur-xl h-14 transition-opacity transform-gpu
            md:sticky md:top-0 md:right-auto md:flex-col md:justify-normal md:border-t-0 md:border-r md:p-4 md:gap-2
            md:h-dvh
            dark:bg-surface-900/70" :class="{ 'max-sm:opacity-30': isScrollDown }" >
                <div class="px-4 py-2 hidden md:block" >
                    <Logo position="center" />
                </div>
                <div v-for="item in menuItem" :key="item.name">
                    <RouterLink :to="item.to" class="p-2 flex items-center hover:bg-surface-100
                        rounded-full cursor-pointer transition-colors
                        md:px-4 md:py-2
                        hover:dark:bg-surface-800"
                        v-slot="{isActive}"
                    >
                        <Button v-if="isActive" unstyled :label="item.name" :icon="item.icon"
                                pt:root:class="flex items-center"
                                pt:label:class="text-xl ml-4 hidden md:block !font-bold"
                                pt:icon:class="!text-2xl w-8 !font-bold" />
                        <Button v-else unstyled :label="item.name" :icon="item.icon"
                                pt:root:class="flex items-center"
                                pt:label:class="text-xl ml-4 hidden md:block"
                                pt:icon:class="!text-2xl w-8" />
                    </RouterLink>
                </div>
            </div>
            
<!--            Router-->
            <div class="w-full">
                <div class="w-full">
                    <RouterView class="w-full" />
                </div>
                <div class="max-md:h-20 md:hidden"></div>
            </div>
            
<!--            Sidebar-->
            <div class="hidden p-4 border-surface
                        lg:block md:sticky md:h-dvh md:top-0 md:border-l md:max-w-sm">
                <Card>
                    <template #title>Simple Card</template>
                    <template #content>
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                            quas!
                        </p>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import {ref} from 'vue';
import Logo from "@/components/logo/Logo.vue";
import Button from 'primevue/button';
import {useScroll} from "@/utils/scroll.js";

const {isScrollDown} = useScroll();

let menuItem = ref([
    { name: 'Home', icon: 'pi pi-home', to: { name: 'Home'}},
    { name: 'Search', icon: 'pi pi-search', to: { name: 'Search'}},
    { name: 'Chat', icon: 'pi pi-envelope', to: { name: 'Chat'}},
    { name: 'Bookmark', icon: 'pi pi-bookmark', to: { name: 'Bookmark'}},
    { name: 'Me', icon: 'pi pi-user', to: { name: 'Me'}},
])



</script>

<style scoped>

</style>
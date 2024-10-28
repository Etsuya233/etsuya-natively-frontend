<template>
    <div class="w-full p-4">
        <SelectButton class="!w-full" :options="options" v-model="selected"
        :pt="{
            root: '*:w-full'
        }"/>
    </div>
    <div class="w-full p-4">
        <Panel header="Lorem ipsum" toggleable>
            <p class="m-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </Panel>
    </div>
</template>

<script setup>
import SelectButton from 'primevue/selectbutton';
import Panel from 'primevue/panel';
import {ref} from 'vue';

let options = ref(['热门', '最新'])
let selected = ref('热门');

</script>

<style scoped>

</style>
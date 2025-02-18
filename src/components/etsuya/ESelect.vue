<template>
    <div class="w-full">
        <div class="py-3 px-4  bg-slate-100 dark:bg-surface-800 transition-colors transform-gpu
        text-slate-800 dark:text-surface-100 hover:bg-slate-200 hover:dark:bg-surface-700 active:bg-slate-300 active:dark:bg-surface-600"
             :class="{ 'rounded-2xl': props.rounded }"
             @click="listVisible = true">
            {{ selected[props.displayField] }}
        </div>
        <Drawer v-model:visible="listVisible"
                position="bottom"
                class="rounded-t-2xl !h-auto"
                :header="props.header">
            <EList>
                <EListItem v-for="(item, index) in props.data"
                           :key="props.keyField? item[props.key]: index"
                           :title="item[props.displayField]"
                           :selected="item[props.valueField] === value"
                           @click="select(item)" />
            </EList>
        </Drawer>
    </div>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import Drawer from "primevue/drawer";
import EList from "@/components/etsuya/EList.vue";
import EListItem from "@/components/etsuya/EListItem.vue";

const emits = defineEmits(["afterSelect"]);
const props = defineProps({
    data: {
        default: []
    },
    displayField: {
        default: 'key',
    },
    valueField: {
        default: 'value',
    },
    keyField: {
        default: null,
    },
    header: {
        default: ':)',
    },
    rounded: {
        default: true,
        type: Boolean
    }
});
const listVisible = ref(false);
const value = defineModel();
const selected = computed(() => {
    return props.data.find(item => item[props.valueField] === value.value) || {};
})
const select = (item) => {
    value.value = item[props.valueField];
    listVisible.value = false;
    emits('afterSelect');
}
const open = () => {
    listVisible.value = true;
}


defineExpose({ open });
</script>

<style scoped>

</style>
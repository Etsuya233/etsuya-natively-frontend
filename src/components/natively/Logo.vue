<template>
    <div class="text-primary-500" :class="{...colorClass, ...positionClass}">
        <RouterLink class="font-logo" v-if="props.clickable" :to="{ name: 'Welcome'}">Natively</RouterLink>
        <div class="font-logo" v-if="!props.clickable">Natively</div>
    </div>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
    size: {
        type: String,
        default: 'md',
    },
    clickable: {
        type: Boolean,
        default: true,
    },
    position: {
        type: String,
        default: 'left',
    }
});

let colorClass = computed(() => {
    if(props.size === 'md') return {'text-2xl': true};
    else if(props.size === 'lg') return {'text-4xl': true}
    else return {'text-lg': true}
})

let positionClass = computed(() => {
    if(props.position === 'left') return {'text-left': true};
    else if(props.position === 'right') return {'text-right': true}
    else return {'text-center': true}
})
</script>

<style scoped>
.font-logo {
    /* 可以添加其他样式 */
}
</style>

<template>
    <transition :name="props.name" mode="out-in">
        <slot></slot>
    </transition>
</template>

<script setup>
const props = defineProps({
    name: {
        default: 'fade'
    }
})

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.scale-enter-active, .scale-leave-active {
    transition: transform 0.2s ease, opacity 0.2s ease;
}
.scale-enter-from, .scale-leave-to {
    transform: scale(0.8);
    opacity: 0;
}

.slide-right-enter-active, .slide-right-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
}
.slide-right-enter-from, .slide-right-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.slide-down-enter-active, .slide-down-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

.rotate-enter-active, .rotate-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
}
.rotate-enter-from, .rotate-leave-to {
    transform: rotate(-180deg);
    opacity: 0;
}

.flip-enter-active, .flip-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
}
.flip-enter-from, .flip-leave-to {
    transform: rotateY(90deg);
    opacity: 0;
}

.zoom-enter-active, .zoom-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
}
.zoom-enter-from, .zoom-leave-to {
    transform: scale(1.5);
    opacity: 0;
}

.diagonal-enter-active, .diagonal-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
}
.diagonal-enter-from, .diagonal-leave-to {
    transform: translate(-50%, -50%);
    opacity: 0;
}
</style>

import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useScroll() {
    const isScrollDown = ref(false); // 响应式数据
    let lastScrollPosition = window.scrollY;
    let timeout;

    const handleScroll = () => {
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            const currentScrollPosition = window.scrollY;
            isScrollDown.value = currentScrollPosition > lastScrollPosition;
            lastScrollPosition = currentScrollPosition;
        }, 100);
    };

    onMounted(() => {
        window.addEventListener('scroll', handleScroll);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('scroll', handleScroll);
    });

    // 返回响应式数据
    return { isScrollDown };
}

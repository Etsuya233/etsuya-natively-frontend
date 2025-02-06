import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useScroll() {
    const isScrollDown = ref(false); // 判断是否向下滚动
    const isAtBottom = ref(false);   // 判断是否触底
    const isAtTop = ref(false);
    const isAtBottomSoon = ref(false);
    let lastScrollPosition = window.scrollY;
    let timeout;

    const handleScroll = () => {
        // if (timeout) clearTimeout(timeout);

        // timeout = setTimeout(() => {
            const currentScrollPosition = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;

            // 判断是否向下滚动
            isScrollDown.value = currentScrollPosition > lastScrollPosition;
            // console.log(currentScrollPosition, currentScrollPosition, isScrollDown.value);

            // 判断是否触底
            isAtBottom.value = (currentScrollPosition + windowHeight) >= (documentHeight - 1);

            // 判断快要触底
            isAtBottomSoon.value = (currentScrollPosition + windowHeight) >= (documentHeight - 50);

            // 判断是否触顶
            isAtTop.value = currentScrollPosition === 0;

            // 更新上次滚动位置
            lastScrollPosition = currentScrollPosition;
        // }, 100);
    };

    onMounted(() => {
        window.addEventListener('scroll', handleScroll);
        // console.log('scroll.js mounted!');
    });

    onBeforeUnmount(() => {
        window.removeEventListener('scroll', handleScroll);
        // console.log('scroll.js unmounted!');
    });

    // 返回响应式数据
    return { isScrollDown, isAtBottom, isAtTop, isAtBottomSoon };
}

import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useSelect() {
    const selected = ref(false);
    const selectedText = ref('');

    const handleSelect = () => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            selected.value = true;
            selectedText.value = selection.toString();
        } else {
            selected.value = false;
            selectedText.value = '';
        }
    }

    onMounted(() => {
        document.addEventListener('selectionchange', handleSelect);
        handleSelect(); // 初始化检查当前的选择状态
    })

    onBeforeUnmount(() => {
        document.removeEventListener('selectionchange', handleSelect);
    })

    return { selected, selectedText };
}

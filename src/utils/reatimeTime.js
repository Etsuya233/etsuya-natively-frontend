import {computed, onMounted, onUnmounted, ref} from "vue";

export function useRealtimeTime() {
    const currentTime = ref(new Date())
    let timer = null

    const updateTime = () => {
        currentTime.value = new Date()
    }

    onMounted(() => {
        timer = setInterval(updateTime, 1000)
    })

    onUnmounted(() => {
        clearInterval(timer)
    })

    // 当前时间 (hh:mm:ss)
    const formattedTime = computed(() => {
        const hours = currentTime.value.getHours().toString().padStart(2, '0')
        const minutes = currentTime.value.getMinutes().toString().padStart(2, '0')
        const seconds = currentTime.value.getSeconds().toString().padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
    })

    // 当前日期 (yyyy-MM-dd)
    const formattedDate = computed(() => {
        const year = currentTime.value.getFullYear()
        const month = (currentTime.value.getMonth() + 1).toString().padStart(2, '0')
        const day = currentTime.value.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    })

    // 本地化后的日期（依赖于浏览器默认语言）
    const localizedDate = computed(() => {
        return currentTime.value.toLocaleDateString()
    })

    // 本地化后的星期（例如 "Monday" 或根据浏览器语言显示为 "星期一"）
    const localizedWeekDay = computed(() => {
        return currentTime.value.toLocaleDateString(undefined, { weekday: 'long' })
    })

    return { formattedTime, formattedDate, localizedDate, localizedWeekDay }
}
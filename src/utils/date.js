export const formatDate = (timestamp) => {
    const timeNum = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;

    // 创建日期对象
    const date = new Date(timeNum);
    const now = new Date();

    // 提取各部分数据，并保证两位数字格式
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 注意：月份从0开始
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 构造 yyyy-MM-dd hh:mm:ss 格式的字符串
    const full = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    // 构造 yyyy-MM-dd 格式的日期字符串
    const dateStr = `${year}-${month}-${day}`;

    // 构造 hh:mm 格式的时间字符串
    const timeStr = `${hours}:${minutes}`;

    // 构造相对时间字符串
    let relative = '';
    // 如果是今天
    if (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    ) {
        relative = timeStr;
    }
    // 如果是今年但不是今天
    else if (date.getFullYear() === now.getFullYear()) {
        relative = `${month}-${day} ${timeStr}`;
    }
    // 如果是其他年份
    else {
        relative = `${year}-${month}-${day} ${timeStr}`;
    }

    return {
        full,      // 完整日期时间
        date: dateStr, // 日期部分
        time: timeStr, // 时间部分
        relative   // 相对时间字符串
    };
};

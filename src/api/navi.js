const baseUrl = '/navi';
import request from "@/utils/request.js";
import axioss from "@/utils/axioss.js";

export const apiAskNavi = (data) => {
    return request({
        url: `${baseUrl}/ask`,
        data: data,
        method: 'POST'
    })
}

export const apiSpeak = (data) => {
    return axioss.request({
        method: 'POST',
        url: `${baseUrl}/speak`,  // 替换为实际的API端点
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        data: data,
        responseType: 'arraybuffer',  // 设置响应类型为二进制数据
    });
}

/**
 * 注意这个的返回值！！！
 * @param data
 * @returns {Promise<unknown>}
 */
export const apiSpeakStream = (data) => {
    return axioss.request({
        method: 'POST',
        url: `${baseUrl}/speak`,  // 替换为实际的API端点
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        data: data,
        responseType: 'stream',  // 使用流式响应
        adapter: 'fetch'
    })
}
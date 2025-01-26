import axioss from "@/utils/axioss.js";

const baseUrl = '/naviV2';
import request from "@/utils/request.js";

export const apiNaviTranslate = (content, originalLanguage, targetLanguage) => {
    return request({
        url: `${baseUrl}/translate`,
        method: 'POST',
        data: {
            content, targetLanguage, originalLanguage
        }
    });
}

export const apiNaviAsk = (question, quote) => {
    return request({
        url: `${baseUrl}/ask`,
        method: 'POST',
        data: {
            question, quote
        }
    })
}

export const apiNaviExplain = (quote) => {
    return request({
        url: `${baseUrl}/explain`,
        method: 'POST',
        data: {
            quote
        }
    })
}

export const apiNaviPronounce = (quote) => {
    return axioss.request({
        method: 'POST',
        url: `${baseUrl}/pronounce`,  // 替换为实际的API端点
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        data: {
            content: quote
        },
        responseType: 'arraybuffer',  // 设置响应类型为二进制数据
    });
}
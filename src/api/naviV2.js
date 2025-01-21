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
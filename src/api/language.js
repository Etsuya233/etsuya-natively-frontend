import {getCurrentLanguage} from "@/utils/language.js";

const baseUrl = '/language';
import request from "@/utils/request.js";

export const apiGetLanguages = () => {
    return request({
        url: `${baseUrl}/lang/${getCurrentLanguage()}`,
        method: 'GET',
    })
}

export const apiGetLanguageInNative = () => {
    return request({
        url: `${baseUrl}/lang/native`,
    })
}

export const apiGetTranslation = (data) => {
    return request({
        url: `${baseUrl}/translation`,
        method: 'POST',
        data: data
    });
}

export const apiGetExplanation = (data) => {
    return request({
        url: `${baseUrl}/explanation`,
        method: 'POST',
        data: data
    });
}
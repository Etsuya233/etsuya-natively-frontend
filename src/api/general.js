import {getCurrentLanguage} from "@/utils/language.js";

const baseUrl = '/general';
import request from "@/utils/request.js";

export const apiGetLocations = () => {
    return request({
        url: `${baseUrl}/location/${getCurrentLanguage()}`
    })
}

export const apiGetLanguages = () => {
    return request({
        url: `${baseUrl}/language/${getCurrentLanguage()}`
    })
}
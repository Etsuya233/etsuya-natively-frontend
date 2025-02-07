import request from "@/utils/request.js";

const baseUrl = '/search';

export const apiSearch = (data) => {
    return request({
        url: `${baseUrl}`,
        method: 'POST',
        data
    })
}

export const apiSearchUser = (data) => {
    return request({
        url: `${baseUrl}/user`,
        method: 'POST',
        data
    })
}
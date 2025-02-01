import request from "@/utils/request.js";

const baseUrl = '/search';

export const apiSearch = (data) => {
    return request({
        url: `${baseUrl}`,
        method: 'POST',
        data
    })
}
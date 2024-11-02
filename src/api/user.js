import request from "@/utils/request.js";

const baseUrl = '/user';

export const apiLogin = (data) => {
    return request({
        url: `${baseUrl}/login`,
        method: 'POST',
        data: data
    });
}

export const apiRefreshToken = () => {
    return request({
        url: `${baseUrl}/refresh`,
        method: 'POST',
        data: {
            refreshToken: localStorage.getItem('accessToken')
        }
    });
}

export const apiHello = () => {
    return request({
        url: `${baseUrl}/hello`,
        method: 'GET',
    })
}
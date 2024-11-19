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

export const apiUsernameUnique = (data) => {
    return request({
        url: `${baseUrl}/username`,
        method: 'POST',
        data: data
    })
}

export const apiEmailUnique = (data) => {
    return request({
        url: `${baseUrl}/email`,
        method: 'POST',
        data: data
    })
}

export const apiRegister = (data) => {
    return request({
        url: `${baseUrl}/register`,
        method: 'POST',
        data: data
    })
}

export const apiOAuth2 = (data) => {
    return request({
        url: `${baseUrl}/oauth2`,
        method: 'POST',
        data: data
    })
}
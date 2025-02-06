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
            refreshToken: localStorage.getItem('refreshToken')
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

export const apiGetCurrent = () => {
    return request({
        url: `${baseUrl}`,
        method: 'GET'
    })
}

export const apiGetUser = (id) => {
    return request({
        url: `${baseUrl}/${id}`,
        method: 'GET'
    })
}

export const apiGetContact = () => {
    return request({
        url: `${baseUrl}/contact`,
        method: 'GET'
    });
}

export const apiFollow = (followeeId, follow) => {
    return request({
        url: `${baseUrl}/follow`,
        method: 'POST',
        data: { followeeId, follow }
    })
}

export const apiGetUserLinkedAccounts = () => {
    return request({
        url: `${baseUrl}/linked`,
        method: 'GET'
    })
}

export const apiOauthUnlink = (owner) => {
    return request({
        url: `${baseUrl}/unlink`,
        method: 'PUT',
        data: { owner }
    })
}

export const apiUserFollowings = (userId, lastId) => {
    return request({
        url: `${baseUrl}/following`,
        method: 'GET',
        params: {
            userId, lastId
        }
    })
}

export const apiUserFollowers = (userId, lastId) => {
    return request({
        url: `${baseUrl}/follower`,
        method: 'GET',
        params: {
            userId, lastId
        }
    })
}
import request from "@/utils/request.js";

const baseUrl = '/post';

export const apiCreatePost = (data) => {
    return request({
        method: 'POST',
        url: baseUrl,
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const apiGetRecommendations = (lastId) => {
    return request({
        url: `${baseUrl}/recommendation`,
        method: 'GET',
        params: {
            lastId,
        }
    })
}

export const apiGetPost = (id) => {
    return request({
        url: `${baseUrl}`,
        method: 'GET',
        params: { id }
    })
}

export const apiGetComment = (data) => {
    return request({
        url: `${baseUrl}/comment`,
        method: 'GET',
        params: data,
    })
}

export const apiAddComment = (data) => {
    return request({
        url: `${baseUrl}/comment`,
        method: 'POST',
        data: data,
    })
}

export const apiAddCommentNew = (data) => {
    return request({
        url: `${baseUrl}/commentNew`,
        method: 'POST',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const apiVote = (data) => {
    return request({
        url: `${baseUrl}/vote`,
        method: 'POST',
        data: data,
    })
}
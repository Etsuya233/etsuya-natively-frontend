import request from "@/utils/request.js";

const baseUrl = '/postV2';

export const apiGetPostVerificationCode = () => {
    return request({
        url: `${baseUrl}/postVerification`, // 拼接 baseUrl 和具体的 URL
        method: 'GET'
    });
}

export const apiUploadPostAttachment = (data) => {
    return request({
        url: `${baseUrl}/file`, // 拼接 baseUrl 和具体的 URL
        method: 'POST',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'  // 指定请求的内容类型
        }
    });
}

export const apiCreatePost = (data) => {
    return request({
        url: `${baseUrl}`, // 拼接 baseUrl 和具体的 URL（这里假设是创建帖子）
        method: 'POST',
        data: data
    });
}

export const apiGetPostRecommendation = (lastId) => {
    return request({
        url: `${baseUrl}/recommendation`,
        method: 'GET',
        data: {
            lastId: lastId,
        }
    })
}

export const apiVote = (id, post, type) => {
    return request({
        url: `${baseUrl}/vote`,
        method: 'POST',
        data: {
            id, post, type
        },
    })
}

export const apiCreateComment = (data) => {
    return request({
        url: `${baseUrl}/comment`,
        method: 'POST',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const apiGetCommentList = (post, id, lastId) => {
    return request({
        url: `${baseUrl}/comments`,
        method: 'GET',
        params: {
            post, id, lastId
        },
    })
}

export const apiGetPostById = (id) => {
    return request({
        url: `${baseUrl}`,
        method: 'GET',
        params: {
            id
        }
    })
}

export const apiGetCommentById = (id) => {
    return request({
        url: `${baseUrl}/comment`,
        method: 'GET',
        params: {
            id
        }
    })
}

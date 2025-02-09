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
        params: {
            lastId: lastId,
        }
    })
}

export const apiGetFollowing = (lastId) => {
    return request({
        url: `${baseUrl}/following`,
        method: 'GET',
        params: {
            lastId
        }
    })
}

export const apiGetTrending = (rank) => {
    return request({
        url: `${baseUrl}/trending`,
        method: 'GET',
        params: {
            rank
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

export const apiCreateBookmark = (type, referenceId, content, note) => {
    return request({
        url: `${baseUrl}/bookmark`,
        method: 'POST',
        data: {
            type, referenceId, content, note
        }
    })
}

export const apiGetBookmarkList = (lastId) => {
    return request({
        url: `${baseUrl}/bookmark`,
        method: 'GET',
        params: {
            lastId
        }
    })
};

export const apiUpdateBookmark = (id, content, note) => {
    return request({
        url: `${baseUrl}/bookmark`,
        method: 'PUT',
        data: {
            id, content, note
        }
    })
}

export const apiDeleteBookmark = (id) => {
    return request({
        url: `${baseUrl}/bookmark/${id}`,
        method: 'DELETE',
    })
}

export const apiGetUserPostList = (userId, lastId) => {
    return request({
        url: `${baseUrl}/user`,
        method: 'GET',
        params: {
            userId, lastId
        }
    })
}

export const apiDeletePost = (id) => {
    return request({
        url: `${baseUrl}`,
        method: 'DELETE',
        data: {
            id
        }
    })
}

export const apiDeleteComment = (id) => {
    return request({
        url: `${baseUrl}/comment`,
        method: 'DELETE',
        data: {
            id
        }
    })
}
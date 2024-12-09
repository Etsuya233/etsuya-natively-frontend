import request from "@/utils/request.js";

const baseUrl = '/chat';

export const apiGetConversations = (lastId) => {
    return request({
        url: `${baseUrl}/list`,
        method: 'GET',
        params: {
            lastId,
        }
    });
}

export const apiGetMoreOldMessage = (userId, lastId) => {
    return request({
        url: `${baseUrl}/msg`,
        method: 'GET',
        params: {
            userId,
            lastId,
        }
    });
}
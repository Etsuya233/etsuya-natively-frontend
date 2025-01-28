import {getCurrentLanguage} from "@/utils/language.js";
import router from "@/router/router.js";
import {apiRefreshToken} from "@/api/user.js";
import axioss from "@/utils/axioss.js";
import {useToast} from "@/utils/toast.js";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const language = getCurrentLanguage();
const toast = useToast();

let lock = false;
let refreshPromise = null;

const request = (options) => {
    //请求准备工作
    const authHeader = `Bearer ${localStorage.getItem('accessToken')}`;
    if (options.headers) {
        options.headers.Authorization = authHeader;
        options['Time-Zone'] = timeZone;
        options['Accept-Language'] = language;
    } else {
        options.headers = {
            Authorization: authHeader,
            'Time-Zone': timeZone,
            'Accept-Language': language,
        };
    }
    if (!options.headers['Content-Type']) {
        options.headers['Content-Type'] = 'application/json';
    }
    //发送请求
    return new Promise((resolve, reject) => {
        axioss.request(options).then((res) => {
            let data = res.data;
            if (data.code === 200) {
                resolve(data.data);
            } else if (data.code === 2000) { //access token failed
                if (!lock) {
                    lock = true;
                    refreshPromise = apiRefreshToken().then((res) => {
                        localStorage.setItem('accessToken', res.accessToken);
                        localStorage.setItem('refreshToken', res.refreshToken);
                        request(options)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                        return res.data;
                    }).catch((err) => {
                        router.push({name: 'Welcome'});
                        toast.add({
                            title: `Error: ${data.code}`,
                            content: `${data.msg}`,
                            type: 'error',
                            timeout: 3000
                        })
                        reject(err);
                    }).finally(() => {
                        lock = false;
                        refreshPromise = null;
                    })
                } else {
                    refreshPromise.then(() => {
                        request(options)
                            .then(resolve)
                            .catch(reject);
                    }).catch(reject);
                }
            } else {
                toast.add({
                    title: `Error: ${data.code}`,
                    content: `${data.msg}`,
                    type: 'error',
                    timeout: 3000
                })
                reject({
                    code: data.code,
                    message: data.msg
                });
            }
        }).catch((err) => {
            toast.add({
                title: `Error: ${err.code}`,
                content: `${err.message}`,
                type: 'error',
                timeout: 3000
            })
            reject({
                code: err.code,
                message: err.message
            });
        })
    })
};

export default request;
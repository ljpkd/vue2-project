import request from "@/utils/request";

const reqGetCode = (phone) => request.get(`/api/user/passport/sendCode/${phone}`)

const reqRegiste = (userInfo) => request.post(`/api/user/passport/register`,userInfo)

const reqGetToken = (userInfo) => request.post(`/api/user/passport/login`,userInfo)

const reqGetUserInfo = () => request.get(`/api/user/passport/auth/getUserInfo`)

const reqLogout = ()=> request.get(`/api/user/passport/logout`);

export default {reqGetCode,reqRegiste,reqGetToken,reqGetUserInfo,reqLogout}
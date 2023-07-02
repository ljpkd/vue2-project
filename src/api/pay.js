import request from '@/utils/request';

// 接口文档中,第13个接口
// 用于发送orderId,从而兑换到pay页面需要展示的相关数据
const reqCreateNative = (orderId)=> request.get(`/api/payment/weixin/createNative/${orderId}`);

export default {
    reqCreateNative
}
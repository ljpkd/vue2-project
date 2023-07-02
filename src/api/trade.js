import request from '@/utils/request'

// 用于获取当前交易页面的相关信息,主要是为了获取总价,总数,购买商品信息
const reqTradeInfo = () => request.get(`/api/order/auth/trade`)

// 用于获取地址信息
const reqUserAddress = () =>
  request.get(`/api/user/userAddress/auth/findUserAddressList`)

// 用于提交当前订单相关信息
const reqSubmitOrder = (tradeNo, params) => request.post(`/api/order/auth/submitOrder?tradeNo=${tradeNo}`, params)

export default {
  reqTradeInfo,
  reqUserAddress,
  reqSubmitOrder
}

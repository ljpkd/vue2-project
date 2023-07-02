import request from "@/utils/request";

const reqAddToCart = (skuId,skuNum) => request.post(`/api/cart/addToCart/${ skuId }/${ skuNum }`)

const reqCartList = () => request.get('/api/cart/cartList')
const reqChangeSelect = (skuId,isChecked) => request.get(`/api/cart/checkCart/${skuId}/${isChecked}`)
// 删除单个
const reqDeleteGood = (skuId) => request.delete(`/api/cart/deleteCart/${skuId}` )

// 全选请求
const reqAllSelect = (skuIdList,isChecked) => 
request.post(`/api/cart/batchCheckCart/${isChecked}`,skuIdList)

// 删除选中
const reqDeleteGoods = (skuIdList) => 
request.post('/api/cart/batchDeleteCart',skuIdList)

export default {reqAddToCart,reqCartList,reqChangeSelect,reqDeleteGood,reqAllSelect,reqDeleteGoods}
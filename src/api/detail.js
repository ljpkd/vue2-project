import request from "@/utils/request";

const reqGoodInfo = (skuId) => request.get(`/api/item/${skuId}`)

export default {reqGoodInfo}
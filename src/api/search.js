// search 页面的请求API
import request from "@/utils/request";

const reqGoodList = (searchParams) => {
  return request.post('/api/list',searchParams)
}

export default {
  reqGoodList,
  
}
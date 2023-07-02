import request from '@/utils/request'
import mockRequest from '@/utils/mockRequest'

// const reqBaseCategoryList = ()=>{
//   return request.get('/api/product/getBaseCategoryList')
// }

const reqBaseCategoryList = () =>
  request.get('/api/product/getBaseCategoryList')

const reqSlide = () => mockRequest.get('/slide')

const reqFloor = () => mockRequest.get('/floor')

export default { reqBaseCategoryList, reqSlide,reqFloor }

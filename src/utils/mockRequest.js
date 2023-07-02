import axios from 'axios'
import nProgress from 'nprogress'
import "nprogress/nprogress.css";

// 通过axios创建一个发送请求的实例对象
const request = axios.create({
  baseURL: 'http://www.baidu.com',
  timeout: 20000,
})

// 请求拦截器
// 只要是通过request发出的请求，在请求发出之前都会先经过这里，先执行这的回调函数
request.interceptors.request.use((config) => {
  // console.log('config',config); config可以接收每次请求的配置对象
  // 配置对象中有当前请求要发送给服务器的所有数据
  // 开启进度条
  nProgress.start()
  return config
})

// 响应拦截器
// 只要是通过request发出的请求，在回来之后，都会第一时间经过这里，执行这里的回调函数
// 第一个是成功拦截器，第二个是失败拦截器
request.interceptors.response.use(
  (response) => {
    // response是服务器返回的所有数据（响应报文对象）
    // 响应头是给浏览器看的，响应体是给开发者看的
    // 直接把响应体中的data数据返回
    // console.log('res',response);  // 响应报文
    const res = response.data  // 响应体
    // console.log(res)

    // 关闭进度条
    nProgress.done()
    // 判断请求是否成功
    if(res.code === 200){
      // 成功则返回响应体里面的data数据
      return res.data  
    }else{
      alert('请求失败了')
    }
    
  },
  (error) => {
    // 关闭进度条
    nProgress.done()
    alert('本次请求失败，请检查网络连接')
    return error.message
  }
)

export default request

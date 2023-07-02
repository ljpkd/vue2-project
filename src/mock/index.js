import Mock from 'mockjs'
import floor from './floor.json'
import slide from './slide.json'

Mock.mock('http://www.baidu.com','get','恭喜你获取到假数据')

Mock.mock('http://www.baidu.com/floor','get',{
  code:200,
  message:'成功',
  ok:true,
  data:floor
})

Mock.mock('http://www.baidu.com/slide','get',{
  code:200,
  message:'成功',
  ok:true,
  data:slide
})
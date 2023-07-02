<template>
  <h1>Test</h1>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'Test',
  async mounted() {
    // console.log(this.$API);
    /* await一共有两个作用
     第一个:拦截后续代码执行，只是拦截当前函数里面的后续代码，函数外面的同步代码依然执行
      如果当前请求没有成功就不会执行后续代码

      第二个:可以快速获取到右侧Promise的result值，成功的resolve
        axios会将请求得到的数据,放在返回的Promise对象的result中
          await可以将其返回给左侧
     */
    const result = await this.$API.home.reqBaseCategoryList()
    console.log(result)
  },
}
</script>

<style lang="less" scoped></style>

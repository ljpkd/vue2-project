<template>
  <div id="app">
   <!-- Header部分 -->
   <Header></Header>

    <!-- 导航列表 -->
   <TypeNav v-show="$route.meta.isShowTypeNav"></TypeNav>
    
   <!-- 路由显示区域 -->
   <router-view></router-view>
   <!-- Footer部分 -->
   <Footer v-show="!$route.meta.isHiddenFooter"></Footer>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style lang="less" scoped>

</style>

<template>
  <div class="home">
    <!-- <TypeNav></TypeNav> -->
    <ListContainer></ListContainer>
    <Floor v-for="floor in floorList" :key="floor.id" :floor="floor"></Floor>
  </div>
</template>

<script>
import ListContainer from './components/ListContainer'
import Floor from './components/Floor'
// import TypeNav from './components/TypeNav'
export default {
  name: 'Home',
  data() {
    return {
      floorList: [],
    }
  },
  // 注册组件
  components: {
    ListContainer,
    Floor,
  },
  async mounted() {
    // 为什么要在home组件里面请求数据呢?拿到数据之后还要父传子
    const result = await this.$API.home.reqFloor()
    // console.log(result)
    this.floorList = result
  },
}
</script>

<style lang="less" scoped></style>

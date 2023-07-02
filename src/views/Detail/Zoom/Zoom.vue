<template>
  <div class="spec-preview">
    <!-- <img src="../images/s1.png" />
    <div class="event"></div>
    <div class="big">
      <img src="../images/s1.png" />
    </div>
    <div class="mask"></div> -->
    <vue-photo-zoom-pro
      :high-url="newImgUrl||imgUrl"
      :out-zoomer="true"
      :width="200"
      :height="200"
    >
      <img :src="newImgUrl||imgUrl" />
    </vue-photo-zoom-pro>
  </div>
</template>
<script>
import vuePhotoZoomPro from 'vue-photo-zoom-pro'
import 'vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css'
export default {
  name: 'Zoom',
  props: ['imgUrl'],
  data(){
    return{
      newImgUrl:""
    }
  },
  components: {
    vuePhotoZoomPro
  },
  mounted(){
    // 挂载的时候就订阅，因为，使用全局事件总线的两个前提是：1、两个组件同时存在。 2、订阅在发布之前。
    // 下面这种写法，只要一发布就会接收的data数据，就会触发回调函数
    this.$bus.$on('getImgUrl',(data)=>{
      // console.log('getImgUrl',data)
      this.newImgUrl = data
    })
  }
}
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;
  img {
    width: 100%;
    height: 100%;
  }
  .zoomer {
    z-index: 5;
    top: 0 !important;
    left: 10px !important;
  }
  .selector {
    background-color: rgba(255, 0, 0, 0.327);
  }
}
</style>
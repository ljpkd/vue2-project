<template>
  <!-- <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <img src="../images/s1.png">
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div> -->
  <swiper class="swiper" :options="swiperOptions">

    <swiper-slide v-for="image in imageList" :key="image.id">
      <img :class="{
        active:image.imgUrl === activeImgUrl
      }" @click="changeImgUrl(image)" :src="image.imgUrl">
    </swiper-slide>

    <div class="swiper-button-next" slot="button-next"></div>
    <div class="swiper-button-prev" slot="button-prev"></div>
  </swiper>
</template>
<script>
import {Swiper,SwiperSlide} from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';

  export default {
    name: "ImageList",
    data(){
      // data函数只有在组件初始化的时候才会执行一次
      // 组件更新的时候是不会执行的,

      return {
        activeImgUrl:"",
        // 配置对象
        swiperOptions:{
          slidesPerView:"auto",
          spaceBetween:"27",
          allowTouchMove:false,  // 禁止滑动
          navigation:{
            nextEl:".swiper-button-next",
            prevEl:".swiper-button-prev"
          }
        }
      }
    },
    props:["imageList","imgUrl"],
    methods:{
      changeImgUrl(image){
        const imgUrl = image.imgUrl;

        this.activeImgUrl = imgUrl;

        // 发布，把下面点击的图片的url发给放大镜展示
        this.$bus.$emit('getImgUrl',imgUrl);
      }
    },
    components:{
      Swiper,SwiperSlide
    }
  }
</script>

<style lang="less" scoped>
  .swiper-container {
    height: 56px;
    width: 412px;
    box-sizing: border-box;
    padding: 0 12px;

    .swiper-slide {
      width: 56px;
      height: 56px;

      img {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
        padding: 2px;
        width: 50px;
        height: 50px;
        display: block;

        &.active {
          border: 2px solid #f60;
          padding: 1px;
        }

        &:hover {
          border: 2px solid #f60;
          padding: 1px;
        }
      }
    }

    .swiper-button-next {
      left: auto;
      right: 0;
    }

    .swiper-button-prev {
      left: 0;
      right: auto;
    }

    .swiper-button-next,
    .swiper-button-prev {
      box-sizing: border-box;
      width: 12px;
      height: 56px;
      background: rgb(235, 235, 235);
      border: 1px solid rgb(204, 204, 204);
      top: 0;
      margin-top: 0;
      &::after {
        font-size: 12px;
      }
    }
  }
</style>
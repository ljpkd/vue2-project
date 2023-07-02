<template>
  <div class="cart-complete-wrap">
    <div class="cart-complete">
      <h3><i class="sui-icon icon-pc-right iconfont icon-success"></i>商品已成功加入购物车！</h3>
      <div class="goods">
        <div class="left-good">
          <div class="left-pic">
            <img :src="detailiInfo.skuDefaultImg" />
          </div>
          <div class="right-info">
            <p 
            class="title"
            
            >
             {{ detailiInfo.skuName }}
            </p>
            <p
             class="attr"
             v-for="attr in detailiInfo.attrs"
            :key="attr.id"
             >{{ attr.saleAttrName }}：{{ attr.saleAttrValueName }}</p>
             <p class="attr">数量：{{ detailiInfo.goodNum }}</p>
             <p class="attr">价格：￥{{ detailiInfo.price }}</p>
          </div>
        </div>
        <div class="right-gocart">
          <a href="javascript:" class="sui-btn btn-xlarge" @click="goBack">查看商品详情</a>
          <a href="javascript:" @click="goCart">去购物车结算 > </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddSuccess',
  data(){
    return{
      detailiInfo:JSON.parse(sessionStorage.getItem('info'))
    }
  },
  methods:{
    goBack(){
      this.$router.back()
    },
    goCart(){
      this.$router.replace('/cart')
    }
  }
}
</script>

<style lang="less" scoped>
.cart-complete-wrap {
  background-color: #f4f4f4;

  .cart-complete {
    width: 1200px;
    margin: 0 auto;
    .iconfont {
      font-family: 'iconfont' !important;
      font-size: 16px;
      font-style: normal;
      border-radius: 0 !important; 
      border: 0 !important;
      background-color: #f4f4f4 !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    h3 {
      font-weight: 400;
      font-size: 16px;
      color: #6aaf04;
      padding-top: 15px;
      padding-bottom: 15px;
      margin: 0;

      .icon-pc-right {
        background-color: #fff;
        border: 2px solid #6aaf04;
        padding: 3px;
        margin-right: 8px;
        border-radius: 15px;
      }
    }

    .goods {
      overflow: hidden;
      padding: 10px 0;

      .left-good {
        float: left;

        .left-pic {
          border: 1px solid #dfdfdf;
          width: 60px;
          float: left;
          img {
            width: 60px;
            height: 60px;
          }
        }

        .right-info {
          color: #444;
          float: left;
          margin-left: 10px;

          .title {
            width: 100%;
            line-height: 28px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
          }

          .attr {
            color: #aaa;
          }
        }
      }

      .right-gocart {
        float: right;

        a {
          padding: 7px 36px;
          font-size: 15px;
          line-height: 22px;
          color: #333;
          background-color: #eee;
          text-decoration: none;
          box-sizing: border-box;
          border: 1px solid #e1e1e1;
        }

        a:hover {
          background-color: #f7f7f7;
          border: 1px solid #eaeaea;
        }

        a:active {
          background-color: #e1e1e1;
          border: 1px solid #d5d5d5;
        }

        .btn-danger {
          background-color: #e1251b;
          color: #fff;
        }

        .btn-danger:hover {
          background-color: #e1251b;
        }
      }
    }
  }
}
</style>

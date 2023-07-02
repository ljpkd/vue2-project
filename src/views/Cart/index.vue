<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul
          class="cart-list"
          v-for="(good, index) in cartList"
          :key="good.sourceId"
        >
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="good.isChecked"
              @change="changeSelect(good)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="good.imgUrl" />
            <div class="item-msg">{{ good.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ good.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins">-</a>
            <input
              autocomplete="off"
              type="text"
              :value="good.skuNum"
              minnum="1"
              class="itxt"
            />
            <a href="javascript:void(0)" class="plus">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ good.skuPrice * good.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <el-popconfirm title="确定要删除这个商品吗？" @confirm="deleteGood(good, index)">
              <a
                href="javascript:;"
                class="sindelet"
                slot="reference"
                >删除</a
              >
            </el-popconfirm>
            <br />
          </li>
        </ul>
        <div class="empty" v-show="!cartList.length">
          <h2>购物车空空如也</h2>
          <img src="http://49.232.112.44/img/empty.751bed26.gif" alt="" />
        </div>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="allChecked"
          @change="changeAllSelect"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a href="javascript:;" @click="deleteGoods">删除选中的商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">
          已选择 <span>{{ totalNum }}</span
          >件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <a href="javascript:;" class="sum-btn" @click="toPay">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { goodNumReg } from '@/utils/reg.js'
export default {
  name: 'Cart',
  data() {
    return {
      cartList: [],
    }
  },
  async created() {
    // 发请求请求数据
    const result = await this.$API.cart.reqCartList()
    // console.log(result)
    if (!result.length) return
    // 这里如果返回的是空数组，在去读就会报错，所以上面做判断
    this.cartList = result[0].cartInfoList
  },
  methods: {
    // 修改isChecked方法
    changeSelect(good) {
      // 这里只是把data数据改了，但是页面在created的时候，会发请求，去请求数据，所以我们改了要通知后端也要改
      good.isChecked = good.isChecked ? 0 : 1
      this.$API.cart.reqChangeSelect(good.sourceId, good.isChecked)
    },
    // 删除单个操作
    deleteGood(good, index) {
      this.cartList.splice(index, 1)
      // 这样只是把data里面的数据删了，但是刷新数据又出来了，因为刷新就会从后端再次发请求请求数据，
      // 而后端的数据根本没变，所以又返回了这些数据，所以我们要通知后端，让后端也删掉数据
      this.$API.cart.reqDeleteGood(good.sourceId)
    },
    // 全选按钮功能
    changeAllSelect() {
      // 使用Number方法,把选中状态的true||false结果,强行转成1||0
      // 因为服务器需要的是1||0,所以需要满足服务器的要求
      const checked = Number(!this.allChecked)
      console.log(checked)
      // 循环遍历数组，把所有的商品的isChecked改为checked，并按接口的要求返回一个id的数组
      const idList = this.cartList.map((item) => {
        item.isChecked = checked
        return item.sourceId
      })

      // 发请求，让后端也改数据
      this.$API.cart.reqAllSelect(idList, checked)
    },
    // 删除选中的商品
    deleteGoods() {
      const idList = this.cartList.reduce((pre, item) => {
        if (item.isChecked) {
          pre.push(item.sourceId)
        }
        // 一定不要忘记返回
        return pre
      }, [])
      // 拿到这个list就去发请求
      this.$API.cart.reqDeleteGoods(idList)
      // 过滤数组，留下没选中的
      const newCartList = this.cartList.filter((item) => {
        return !item.isChecked
      })
      this.cartList = newCartList
      // 但是这样只是实现了，页面上面的删除，如果刷新，重新请求数据，后端的数据还没删，
      // 所以要发请求，看接口文档
      // 由于既要过滤，又要返回一个id数组，所以选用reduce方法
    },
    // 跳转详情页
    toPay(){
      this.$router.push('/trade')
    },
    // 修改商品数量
  },
  computed: {
    allChecked() {
      // 所有商品选中，那么全选按钮也选中，所以可以用every
      // 如果没有商品的时候，全选也应该不选中
      if (!this.cartList.length) return
      const result = this.cartList.every((item) => {
        return item.isChecked
      })
      return result
    },
    totalNum() {
      const list = this.cartList.filter((item) => {
        return item.isChecked
      })
      return list.length
    },
    totalPrice() {
      // 根据当前购物车数组中的每个商品,如果商品已选中,就累加他的总价
      // 每个商品的总价 = 商品数量*商品单价
      // 返回值一定是number类型
      const price = this.cartList.reduce((pre, good) => {
        if (good.isChecked) {
          pre += good.skuNum * good.skuPrice
        }
        return pre
      }, 0)
      return price
    },
  },
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;
  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }
  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;
      & > div {
        float: left;
      }
      .cart-th1 {
        width: 25%;
        input {
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
        }
      }
      .cart-th2 {
        width: 25%;
      }
      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }
    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;
      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;
        & > li {
          float: left;
        }
        .cart-list-con1 {
          width: 15%;
        }
        .cart-list-con2 {
          width: 35%;
          img {
            width: 82px;
            height: 82px;
            float: left;
          }
          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }
        .cart-list-con4 {
          width: 10%;
        }
        .cart-list-con5 {
          width: 17%;
          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
            text-decoration: none;
          }
          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 31px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
            text-decoration: none;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }
  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;
        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: 'Microsoft YaHei';
          background: #e1251b;
          overflow: hidden;
          text-decoration: none;
          &hover {
            color: white !important;
          }
        }
      }
    }
  }
}
.empty {
  padding: 20px;
  text-align: center;
  h2 {
    color: gray;
  }
  img {
    width: 300px;
  }
}
</style>

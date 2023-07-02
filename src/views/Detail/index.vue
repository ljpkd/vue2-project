<template>
  <div class="detail">
    <!-- 主要内容区域 -->
    <section class="con">
      <!-- 导航路径区域 -->
      <div class="conPoin">
        <span v-for="n in 3" :key="n">
          {{ categoryView[`category${n}Name`] }}
        </span>
      </div>
      <!-- 主要内容区域 -->
      <div class="mainCon">
        <!-- 左侧放大镜区域 -->
        <div class="previewWrap">
          <!--放大镜效果-->
          <Zoom :imgUrl="skuInfo.skuDefaultImg" />
          <!-- 小图列表 -->
          <ImageList
            :imgUrl="skuInfo.skuDefaultImg"
            :imageList="skuInfo.skuImageList"
          />
        </div>
        <!-- 右侧选择区域布局 -->
        <div class="InfoWrap">
          <div class="goodsDetail">
            <h3 class="InfoName">
              {{ skuInfo.skuName }}
            </h3>
            <p class="news">
              {{ skuInfo.skuDesc }}
            </p>
            <div class="priceArea">
              <div class="priceArea1">
                <div class="title">
                  价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格
                </div>
                <div class="price">
                  <i>¥</i>
                  <em>{{ skuInfo.price }}</em>
                </div>
              </div>
            </div>
          </div>

          <div class="choose">
            <div class="chooseArea">
              <div class="choosed"></div>
              <dl v-for="spuSaleAttr in spuSaleAttrList" :key="spuSaleAttr.id">
                <dt class="title">选择{{ spuSaleAttr.saleAttrName }}</dt>
                <dd
                  v-for="attrValue in spuSaleAttr.spuSaleAttrValueList"
                  :class="{
                    active: attrValue.isChecked === `1`,
                  }"
                  :key="attrValue.id"
                  @click="changeSelect(attrValue, spuSaleAttr)"
                >
                  {{ attrValue.saleAttrValueName }}
                </dd>
              </dl>
            </div>
            <div class="cartWrap">
              <div class="controls">
                <input
                  :value="goodNum"
                  @change="changeGoodNum('input', $event)"
                  autocomplete="off"
                  class="itxt"
                />
                <a href="javascript:" class="plus" @click="changeGoodNum('add')"
                  >+</a
                >
                <a href="javascript:" class="mins" @click="changeGoodNum('sub')"
                  >-</a
                >
              </div>
              <div class="add">
                <a href="javascript:" @click="addCart()">加入购物车</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ImageList from './ImageList/ImageList'
import Zoom from './Zoom/Zoom'

export default {
  name: 'Detail',
  data() {
    return {
      categoryView: {},
      spuSaleAttrList: [],
      skuInfo: {},
      id: null,
      goodNum: 1,
      ids: {},
    }
  },
  components: {
    ImageList,
    Zoom,
  },
  async created() {
    const id = this.$route.params.id
    this.id = id
    this.reqGoodInfo()
  },
  methods: {
    // 封装发送请求的数据
    async reqGoodInfo() {
      const result = await this.$API.detail.reqGoodInfo(this.id)
      // console.log(result)
      const { categoryView, spuSaleAttrList, skuInfo, valuesSkuJson } = result
      this.categoryView = categoryView
      this.spuSaleAttrList = spuSaleAttrList
      this.skuInfo = skuInfo
      this.ids = JSON.parse(valuesSkuJson)
    },
    // 改变购物车数量
    changeGoodNum(type, event) {
      // console.log(event);
      /* 有三种情况可以改变购物车数量
          1、点击加号，增加
          2、点击减号，减少
          3、直接input输入数量，最大值200，最小值1
      */
      if (type === 'add') {
        if (this.goodNum >= 200) {
          alert('最大数量为200')
          return
        }
        this.goodNum += 1
      } else if (type === 'sub') {
        if (this.goodNum <= 1) {
          alert('最少数量为1')
          return
        }
        this.goodNum -= 1
      } else if (type === 'input') {
        // console.log(event.target.value);
        const result = event.target.value * 1
        // console.log(result);
        if (result < 201 && result >= 1) {
          this.goodNum = result
        } else if (result < 1) {
          alert('最少数量为1')

          // Vue的特性就是数据驱动，当响应式属性的值发生变化的时候，页面会自动渲染
          // 但是Vue做了优化，假如这次要改的值和原来的值一样，就是没发生变化，
          // 所以不会自动更新页面，所以要手动更新页面

          this.goodNum = event.target.value = 1
          return
        } else if (result > 200) {
          alert('最大数量为200')
          this.goodNum = 200
          event.target.value = this.goodNum
        } else {
          this.goodNum = 1
          alert('请输入纯数字')
          event.target.value = this.goodNum
        }
      }
    },

    // 改变商品配置
    changeSelect(attrValue, spuSaleAttr) {
      // 先声明一个旧的选择的属性
      // 因为可能出现选择的属性没库存，就要把刚刚那个选中的属性再选回去
      let oldSelect

      //通过排他效果,现将当前属性中,所有的属性值都变为未选中状态
      //最后再将当前选中的这个选项变为已选中状态
      spuSaleAttr.spuSaleAttrValueList.forEach((item) => {
        if (item.isChecked === '1') {
          // 获取到原来旧的那个属性
          oldSelect = item
        }
        item.isChecked = '0' // 排他法，把所有的都先改为未选中
      })
      attrValue.isChecked = '1' // 再把现在点击这个选中

      /*
        根据接口的要求 发请求的格式"颜色id|容量id"，这样才能真正的在后端加入到购物车
        思路:需要遍历所有销售属性的数组,获取到每种销售属性中,选中的那个属性的id
        返回值:字符串 格式"颜色id|容量id"
      */
      let key = this.spuSaleAttrList.reduce((pre, item) => {
        //遍历属性数组,item会存入每次遍历的属性对象
        //属性对象内部有spuSaleAttrValueList属性,内部存储的才是所有的属性值选项

        //从当前属性值数组中,找到一个已选中的选项对象
        const result = item.spuSaleAttrValueList.find((value) => {
          return value.isChecked === '1'
        })

        // 从该对象中,获取出他的id
        const id = result.id

        pre = pre + '|' + id
        // console.log(pre);

        return pre
      }, '')

      key = key.substring(1)
      // console.log(key)
      const goodId = this.ids[key]
      // console.log(goodId)
      if (!goodId) {
        alert(
          `你选择的${attrValue.saleAttrValueName}商品库存不足,请挑选其他内容`
        )
        oldSelect.isChecked = '1'
        attrValue.isChecked = '0'

        return
      }
      this.id = goodId
      this.reqGoodInfo()
    },

    // 加入购物车
    async addCart() {
      // console.log(this.id,this.goodNum);
      // 发这个请求的目的就是，把这个商品添加的临时购物车里面，后端存到数据库里面，没有返回值
      await this.$API.cart.reqAddToCart(this.id, this.goodNum);
      
      const { skuInfo, spuSaleAttrList, goodNum } = this;

      const { price, skuName, skuDefaultImg } = skuInfo;

      const attrs = spuSaleAttrList.map((attr) => {
        const result = attr.spuSaleAttrValueList.find((attrValue) => {
          return attrValue.isChecked === "1"
        })
        return result;   //选中属性的数组
      });
      // console.log(attrs);
      // 把这些数据保存到一个对象里面，然后存到sessionStorage里面，因为这些数据要在AddSuccess里面使用
      // 所以存到sessionStorage比较合适，sessionStorage(会话存储)，关闭标签页数据就会丢失
      const skuDetailInfo = {
        attrs,
        price,
        skuName,
        skuDefaultImg,
        goodNum
      };
      // 把上面这个对象存到sessionStorage里面，方便AddSuccess组件拿到数据
      sessionStorage.setItem('info',JSON.stringify(skuDetailInfo)) // 要先转成字符串

      // 然后跳转页面
      this.$router.push('/addsuccess')
    },
  },
}
</script>

<style lang="less" scoped>
.detail {
  .con {
    width: 1200px;
    margin: 15px auto 0;

    .conPoin {
      padding: 9px 15px 9px 0;

      & > span + span:before {
        content: '/\00a0';
        padding: 0 5px;
        color: #ccc;
      }
    }

    .mainCon {
      overflow: hidden;
      margin: 5px 0 15px;

      .previewWrap {
        float: left;
        width: 400px;
        position: relative;
      }

      .InfoWrap {
        width: 700px;
        float: right;

        .InfoName {
          font-size: 14px;
          line-height: 21px;
          margin-top: 15px;
        }

        .news {
          color: #e12228;
          margin-top: 15px;
        }

        .priceArea {
          background: #fee9eb;
          padding: 7px;
          margin: 13px 0;

          .priceArea1 {
            overflow: hidden;
            line-height: 28px;
            margin-top: 10px;

            .title {
              float: left;
              margin-right: 15px;
            }

            .price {
              float: left;
              color: #c81623;

              i {
                font-size: 16px;
              }

              em {
                font-size: 24px;
                font-weight: 700;
              }

              span {
                font-size: 12px;
              }
            }

            .remark {
              float: right;
            }
          }

          .priceArea2 {
            overflow: hidden;
            line-height: 28px;
            margin-top: 10px;

            .title {
              margin-right: 15px;
              float: left;
            }

            .fixWidth {
              width: 520px;
              float: left;

              .red-bg {
                background: #c81623;
                color: #fff;
                padding: 3px;
              }

              .t-gray {
                color: #999;
              }
            }
          }
        }

        .support {
          border-bottom: 1px solid #ededed;
          padding-bottom: 5px;

          .supportArea {
            overflow: hidden;
            line-height: 28px;
            margin-top: 10px;

            .title {
              margin-right: 15px;
              float: left;
            }

            .fixWidth {
              width: 520px;
              float: left;
              color: #999;
            }
          }
        }

        .choose {
          .chooseArea {
            overflow: hidden;
            line-height: 28px;
            margin-top: 10px;

            dl {
              overflow: hidden;
              margin: 13px 0;

              dt {
                margin-right: 15px;
                float: left;
              }

              dd {
                float: left;
                margin-right: 5px;
                color: #666;
                line-height: 24px;
                padding: 2px 14px;
                border-top: 1px solid #eee;
                border-right: 1px solid #bbb;
                border-bottom: 1px solid #bbb;
                border-left: 1px solid #eee;

                &.active {
                  color: green;
                  border: 1px solid green;
                }
              }
            }
          }

          .cartWrap {
            .controls {
              width: 48px;
              position: relative;
              float: left;
              margin-right: 15px;

              .itxt {
                width: 38px;
                height: 37px;
                border: 1px solid #ddd;
                color: #555;
                float: left;
                border-right: 0;
                text-align: center;
              }

              .plus,
              .mins {
                width: 15px;
                text-align: center;
                height: 17px;
                line-height: 17px;
                background: #f1f1f1;
                color: #666;
                position: absolute;
                right: -8px;
                border: 1px solid #ccc;
              }

              .mins {
                right: -8px;
                top: 19px;
                border-top: 0;
              }

              .plus {
                right: -8px;
              }
              a:link:hover {
                color: rgb(16, 16, 16) !important;
                text-decoration: none !important;
              }
            }

            .add {
              float: left;

              a {
                background-color: #e1251b;
                padding: 0 25px;
                font-size: 16px;
                color: #fff;
                height: 36px;
                line-height: 36px;
                display: block;
                // text-decoration: none;
              }
              a:link:hover {
                color: rgb(230, 230, 235) !important;
                text-decoration: none !important;
              }
            }
          }
        }
      }
    }
  }

  .product-detail {
    width: 1200px;
    margin: 30px auto 0;
    overflow: hidden;

    .aside {
      width: 210px;
      float: left;
      border: 1px solid #ccc;

      .tabWraped {
        height: 40px;

        h4 {
          border-top: 3px solid #fff;
          float: left;
          line-height: 37px;
          width: 105px;
          text-align: center;
          border-bottom: 1px solid #ccc;

          &.active {
            border-top: 3px solid #e1251b;
            border-bottom: 0;
            font-weight: normal;
          }
        }
      }

      .tabContent {
        padding: 10px;

        .tab-pane {
          display: none;

          &.active {
            display: block;
          }

          &:nth-child(1) {
            .partList {
              overflow: hidden;

              li {
                width: 50%;
                float: left;
                border-bottom: 1px dashed #ededed;
                line-height: 28px;
              }
            }

            .goodsList {
              & > li {
                margin: 5px 0 15px;
                border-bottom: 1px solid #ededed;
                padding-bottom: 5px;

                .list-wrap {
                  .p-img {
                    text-align: center;

                    img {
                      width: 152px;
                    }
                  }

                  .price {
                    font-size: 16px;
                    color: #c81623;
                  }

                  .operate {
                    text-align: center;
                    margin: 5px 0;

                    a {
                      background-color: transparent;
                      border: 1px solid #8c8c8c;
                      color: #8c8c8c;
                      display: inline-block;
                      padding: 2px 14px;
                      line-height: 18px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .detail {
      width: 980px;
      float: right;

      .fitting {
        border: 1px solid #ddd;
        margin-bottom: 15px;

        .kt {
          border-bottom: 1px solid #ddd;
          background: #f1f1f1;
          color: #333;
          padding: 5px 0 5px 15px;
        }

        .good-suits {
          height: 170px;
          padding-top: 10px;

          .master {
            width: 127px;
            height: 165px;
            text-align: center;
            position: relative;
            float: left;

            img {
              width: 87px;
            }

            p {
              color: #c81623;
              font-size: 16px;
              font-weight: 700;
            }

            i {
              position: absolute;
              top: 48px;
              right: -25px;
              font-size: 16px;
            }
          }

          .suits {
            width: 668px;
            height: 165px;
            float: left;

            .suitsItem {
              float: left;
              width: 127px;
              padding: 0 20px;
              text-align: center;

              img {
                width: 120px;
                height: 130px;
              }

              p {
                font-size: 12px;
              }

              label {
                display: block;
                position: relative;

                input {
                  vertical-align: middle;
                }

                span {
                  vertical-align: middle;
                }
              }
            }
          }

          .result {
            border-left: 1px solid #ddd;
            width: 153px;
            height: 165px;
            padding-left: 20px;
            float: left;

            .num {
              font-size: 14px;
              margin-bottom: 10px;
              margin-top: 10px;
            }

            .price-tit {
              font-weight: bold;
              margin-bottom: 10px;
            }

            .price {
              color: #b1191a;
              font-size: 16px;
              margin-bottom: 10px;
            }

            .addshopcar {
              background-color: #e1251b;
              border: 1px solid #e1251b;
              padding: 10px 25px;
              font-size: 16px;
              color: #fff;
              display: inline-block;
              box-sizing: border-box;
            }
          }
        }
      }

      .intro {
        .tab-wraped {
          background: #ededed;
          // border: 1px solid #ddd;
          overflow: hidden;

          li {
            float: left;

            & + li > a {
              border-left: 1px solid #ddd;
            }

            &.active {
              a {
                // border: 0;
                background: #e1251b;
                color: #fff;
              }
            }

            a {
              display: block;
              height: 40px;
              line-height: 40px;
              padding: 0 11px;
              text-align: center;
              color: #666;
              background: #fcfcfc;
              border-top: 1px solid #ddd;
              border-bottom: 1px solid #ddd;
            }
          }
        }

        .tab-content {
          .tab-pane {
            display: none;

            &.active {
              display: block;
            }

            &:nth-child(1) {
              .goods-intro {
                padding-left: 10px;

                li {
                  margin: 10px 0;
                }
              }

              .intro-detail {
                img {
                  width: 100%;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="outer">
    <div class="main">
      <div class="py-container">
        <!--面包屑导航-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <span href="#">全部结果</span>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-show="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCategoryName">×</i>
            </li>
            <li class="with-x" v-show="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <li class="with-x" v-show="searchParams.trademark">
              品牌：{{ searchParams.trademark.split(':')[1] }}
              <i @click="removeTrademark">×</i>
            </li>
            <li
              class="with-x"
              v-for="(attr, index) in searchParams.props"
              :key="attr"
            >
              {{ attr.split(':')[2] }}:{{ attr.split(':')[1] }}
              <i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!-- 搜索器 -->
        <SearchSelector
          :attrsList="attrsList"
          :trademarkList="trademarkList"
          @getTrademark="saveTrademark"
          @saveAttr="getAttr"
        />

        <!--商品展示区-->
        <div class="details clearfix">
          <!-- 列表操作区 -->
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
								<li :class="{
									active: orderType === '1'
								}"
								@click="changeOrder('1')"
								>
									<a>
										综合
										<span v-show="orderType === '1'" class="iconfont" :class="iconName"></span>
									</a>
								</li>
								<li 
								:class="{
									active: orderType === '2'
								}"
								@click="changeOrder('2')"
								>
									<a>价格
										<span v-show="orderType === '2'" class="iconfont" :class="iconName"></span>
									</a>
								</li>
							</ul>
            </div>
          </div>
          <!-- 商品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id" @click="toDetail(good)">
                <div class="list-wrap">
                  <div class="p-img">
                    <a href="javascript:;"
                      ><img :src="good.defaultImg"
                    /></a>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i>{{ good.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <router-link to="/detail">{{ good.title }}</router-link>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <div class="fr page">
            <Pagination
              :pageSize="this.searchParams.pageSize"
              :pageNo="this.searchParams.pageNo"
              :total="total"
              :totalPages="totalPages"
              :continues="5"
              @getPageNo="savePageNo"
            ></Pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector'
export default {
  name: 'Search',
  data() {
    return {
      goodsList: [],
      trademarkList: [],
      attrsList: [],
      searchParams: {
        category1Id: undefined,
        category2Id: undefined,
        category3Id: undefined,
        categoryName: undefined,
        keyword: undefined,
        trademark: '',
        order: "1:desc",
        pageNo: 1,
        pageSize: 10,
        props: [],
      },
      total: 0,
      totalPages: 10,
    }
  },
  // 其实生命周期,也是监听一种,它用于监视组件的状态
  // 例如,当组件挂载成功了,用户就能看到
  // async mounted() {
  // 	this.searchParams = {
  // 		...this.searchParams,
  // 		...this.$route.query
  // 	};
  // 	// Vue更新状态数据是同步操作,所以每次使用数据的时候,一定是最新的
  // 	// console.log(this.searchParams)

  // 	const { goodsList, trademarkList, attrsList } = await this.$API.search.reqGoodList(this.searchParams);
  // 	// console.log(result)
  // 	this.goodsList = goodsList;
  // 	this.trademarkList = trademarkList;
  // 	this.attrsList = attrsList;
  // },
  watch: {
    // 监听query变化
    '$route.query': {
      // 开启立即监听
      immediate: true,
      async handler(newQuery) {
        // 只要query参数发生变化,就会自动执行当前代码
        // console.log('new',newQuery);
        // newQuery就是新的query数据 {keyword: '华为', categoryName: '手机', category1Id: '2'}

        // 这个函数就是把，后面的对象，加到第一个参数对象里面去,对象还是哪个对象
        // 先把第二个加到第一个里面去，相当于是初始化了第一个对象
        // 再把newQuery加到第一个对象里面
        Object.assign(
          this.searchParams,
          {
            category1Id: undefined,
            category2Id: undefined,
            category3Id: undefined,
            categoryName: undefined,
            keyword: undefined,
          },
          newQuery
        )
        // console.log(this.searchParams);
        // this.searchParams.pageNo = 1 // 通过监听路由是否变化来判断要不要重置为第一页不够全面，因为增加属性的时候路由不改变
      },
    },
    searchParams: {
      immediate: true,
      deep: true,
      async handler(newVal, oldVal) {
        // 由于searchParams是一个对象，而且开启了深度监听，所以searchParams的值根本没变
        // 所以新值和旧值是同一个对象！！！
        // 所以一定要注意，这是一个坑，要先深拷贝一个旧值存储起来

        // this.searchParams.pageNo = 1   // 不能这样写，因为这里监听的是searchParams，这里又在改searchParams直接造成死循环，点击改变页码又直接变为1页，所以要进行判断。
        // 判断如果新改变的值的pageNo不等于旧的pageNo说明要改页码，所以不重置为1
        // if (this.oldVal&&this.oldVal.pageNo !== newVal.pageNo) {
        //   return  // 这里不能return，return了后面不执行了
        // } else {
        //   newVal.pageNo = 1
        // }

        if(this.oldVal&&this.oldVal.pageNo === newVal.pageNo){
          this.searchParams.pageNo = 1
        }
        this.reqSearchParams()
      },
    },
  },
  methods: {
    // 封装发送请求的函数
    async reqSearchParams() {
      // 发送请求，发请求的时候传递searchParams给后端，后端根据查询条件，返回数据
      // const result = await this.$API.search.reqGoodList(this.searchParams)
      const { goodsList, trademarkList, attrsList, total, totalPages } =
        await this.$API.search.reqGoodList(this.searchParams)
      // console.log(result)
      // 把获取到的数据，存到data中去
      this.goodsList = goodsList
      this.trademarkList = trademarkList
      this.attrsList = attrsList
      this.total = total
      this.totalPages = totalPages

      // 因为是对象必须深拷贝,
      this.oldVal = JSON.parse(JSON.stringify(this.searchParams))
      // console.log(totalPages);
      // console.log(this.searchParams)
    },
    // 删除分类面包屑
    removeCategoryName() {
      // 进入这个函数说明用户想要删除category的参数，如果只是简单地把categoryName赋值为undefined，刷新页面的时候还是会出来，因为路由没有改变
      this.$router.push({
        path: '/search',
        query: {
          keyword: this.searchParams.keyword,
        },
      })
    },
    // 删除关键字面包屑
    removeKeyword() {
      // 点击删除关键字的时候要把输入框的value也取消，因为是兄弟组件之间的通讯，所以使用事件总线
      this.$bus.$emit('clearKeyword')
      // 和上面一样，如果只是单纯的把keyword赋值为undefined，路由没有改变，刷新还是会出来，
      // 所以要改变路由路径，但是，删除keyword，分类的标签不能影响
      this.$router.push({
        path: '/search',
        query: {
          ...this.$route.query,
          keyword: undefined,
        },
      })
    },
    // 获取trademark
    saveTrademark(tm) {
      // console.log('saveTrademark')
      // 下面是接口要的格式，所以我们传的时候也要按这个格式
      // 品牌: "ID:品牌名称"
      // 示例: "1:苹果"
      const trademark = `${tm.tmId}:${tm.tmName}`
      // console.log('saveTrademark',trademark)
      this.searchParams.trademark = trademark
    },
    // 删除品牌面包屑
    removeTrademark() {
      this.searchParams.trademark = ''
    },
    // 获取属性，添加到props里面
    getAttr(attrValue, attrs) {
      // 因为这里要符合接口的格式要求，所以要处理数据
      const attr = `${attrs.attrId}:${attrValue}:${attrs.attrName}`
      // console.log(attr);
      // 要先判断，props里面是不是已经存在attr，不能重复出现
      let result = this.searchParams.props.includes(attr)
      // console.log(result);
      if (result) return // 存在就return，不再添加
      this.searchParams.props.push(attr)
    },
    // 删除attr
    removeAttr(num) {
      // 过滤掉选中的那一项
      this.searchParams.props = this.searchParams.props.filter(
        (item, index) => index !== num
      )
    },
    // 获取页码pageNo
    savePageNo(num) {
      // console.log(num);
      this.searchParams.pageNo = num
    },
    // 跳转detail页面
    toDetail(good){
      // console.log(1);
      this.$router.push({
        path:`/detail/${good.id}`,
      })
    },
    // 改变排序
    changeOrder(type){
			if(type===this.orderType){
				// 能进入这里,说明当前用户点的就是高亮的元素
				// 所以不需要修改排序的类型,只需要修改排序的升序降序
				const sort = this.searchParams.order.split(':')[1] ==="desc"?'asc':'desc';
				this.searchParams.order = `${type}:${sort}`
			}else{
				// 能进入这里,说明当前用户点的是一个全新的类型
				this.searchParams.order = `${type}:desc`
			}
		},
  },
  components: {
    SearchSelector,
  },
  computed: {
		orderType() {
			return this.searchParams.order.split(':')[0]
		},
		iconName() {
			return this.searchParams.order.split(':')[1] === "desc" ? 'icon-down' : 'icon-up'
		}
	},
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>

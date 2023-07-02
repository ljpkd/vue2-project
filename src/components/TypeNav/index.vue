<template>
  <div class="type-nav">
    <div class="container">
      <div class="nav-left" @mouseenter="handleEnter" @mouseleave="handleLeave">
        <h2 class="all">全部商品分类</h2>
        <transition
          enter-active-class="animate__fadeIn"
          leave-active-class="animate__fadeOut"
        >
          <div class="sort animate__animated" v-show="isShowSort">
            <div class="all-sort-list2" @click.prevent="toSearch">
              <div class="item" v-for="c1 in categoryList" :key="c1.categoryId">
                <h3>
                  <a href="" :data-id="c1.categoryId" data-level="1">{{
                    c1.categoryName
                  }}</a>
                </h3>
                <div class="item-list clearfix">
                  <div class="subitem">
                    <dl
                      class="fore"
                      v-for="c2 in c1.categoryChild"
                      :key="c2.categoryId"
                    >
                      <dt>
                        <a href="" :data-id="c2.categoryId" data-level="2">{{
                          c2.categoryName
                        }}</a>
                      </dt>
                      <dd>
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a href="" :data-id="c3.categoryId" data-level="3">{{
                            c3.categoryName
                          }}</a>
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import 'animate.css'
import { mapState } from 'vuex'
export default {
  name: 'TypeNav',
  data() {
    return {
      isShowSort: this.$route.path === '/home',
    }
  },
  mounted() {
    // 调用actions里面的方法，获取categoryList数据
    this.$store.dispatch('home/getCategoryList')
    // console.log('router',this.$router);
    // console.log('route',this.$route);
  },
  computed: {
    // 用辅助函数获取state中的数据，'home'是因为开了命名空间
    ...mapState('home', ['categoryList']),
  },
  methods: {
    // 里面的a标签，要跳转可以使用声明式导航，但是<router-link></router-link>实际是一个组件，每个a标签都换成router-link性能就很不好，几十上百个组件，所以还是用编程式导航，但是如果给每个a标签去绑定事件，那会累死....所以要利用事件委托，给所有的a标签的父元素绑定。
    toSearch(event) {
      // console.log(event.target.dataset,event.target.innerText);
      const { id, level } = event.target.dataset
      const { innerText } = event.target

      const key = `category${level}Id`
      // console.log(this.$route);
      // 为什么使用路由传参，因为点击要跳转，用路由传参比较合适，为什么使用query而不使用params，因为传的数据是键值对，如果只是传一个值那就使用params
      if (level) {
        this.$router.push({
          path: '/search',
          query: {
            // 注意：此处一定不要...this.$route.query
            // 因为上一次可能传递的是一级分类的id,这次传递二级分类的id,他们的属性名不同,会无法覆盖
            // 所以这里只需要拿到keyword加上去就可以了
            keyword: this.$route.query.keyword,
            categoryName: innerText,
            [key]: id,
          },
        })
        // 点击了a标签，就代表要跳转，所以要关闭sort
        this.isShowSort = false
      }
    },
    // 鼠标移入，显示三级分类菜单功能
    handleEnter() {
      this.isShowSort = true
    },
    // 鼠标移出，隐藏三级分类菜单功能，但是'/home' 页面默认显示的
    handleLeave() {
      this.isShowSort = this.$route.path === '/home'
    },
  },
  watch: {
    '$route.path'(newValue, oldValue) {
      /*  if(this.$route.path === '/home'){
        this.isShowSort = true
      }else{
        this.isShowSort = false
      } */
      // 为什么要用监听属性，因为data里面的数据只会在挂载的时候执行一次，当你从search页面再回到home页面的时候就不再自动展示sort了，所以要使用监听，监听路径，当路径='/home'的时候，把isShowsort改为true
      this.isShowSort = this.$route.path === '/home'
    },
  },
}
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;
      --animate-duration: 0.3s;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            // padding: 0 20px;
            margin: 0;

            a {
              color: #333;
              display: block;
              width: 100%;
              height: 100%;
              padding: 0 20px;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          &:hover {
            .item-list {
              display: block;
              // color:#fff;
            }
          }
        }
      }
    }
  }
}
h3 {
  line-height: 30px;
  font-size: 14px;
  font-weight: 400;
  overflow: hidden;
  // padding: 0 20px;
  margin: 0;
  &:hover {
    background-color: #e1251b;
    a {
      color: white !important;
    }
  }
  a {
    color: #333;
  }
}

dd {
  /*********/
  width: 520px;
  /*********/
}
dt {
  /*********/
  width: 68px;
  /*********/
}

/*reset.css*/
/* 重置文本格式元素 */
a:link:hover {
  color: rgb(79, 76, 212) !important;
  text-decoration: none;
}
</style>

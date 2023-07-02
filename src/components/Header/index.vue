<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <p v-if="!userInfo.nickName">
            <span>请</span>
            <router-link to="/login">登录</router-link>
            <router-link to="/registe" class="register">免费注册</router-link>
            <router-link to="/test" class="register">测试</router-link>
          </p>
          <p v-else>
            <span>{{ userInfo.nickName }}</span>
            <a class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <a href="###">我的订单</a>
          <router-link to="/cart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" title="尚品汇" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model.lazy="keyword"
          />
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="toSearch"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
import { getUserInfo,removeToken,removeUserInfo } from '@/utils/auth'
// 引入store中的state数据
import {mapState,mapMutations} from 'vuex'
export default {
  name: 'Header',
  data() {
    return {
      keyword: undefined,
    }
  },
  methods: {
    ...mapMutations('user',['removeUserInfo']),
    // 搜索按钮跳转功能
    toSearch() {
      // this.$router.push('/search') // 重复跳转会报错，需要重写push方法
      /* const result = this.$router.push(
        '/search',
        () => {
          console.log('跳转成功')
        },
        () => {
          console.log('跳转失败')
        }
      ) */
        // console.log(this.$route);
      this.$router.push({
        path:'/search',
        query:{
          // 展开原来的query数据
          ...this.$route.query,
          keyword:this.keyword
        }
      })
    },
    logout(){
      // console.log(111);
      // 发请求通知服务器销毁token
      this.$API.user.reqLogout()
      // 删除localStorage里面的token
      removeToken()
      // 清空vuex里面的token
      this.$store.commit('user/REMOVE_TOKEN')
      // 删除个人信息,清空vuex里面的userInfo
      this.$store.commit('user/REMOVE_USERINFO')
      // 跳转login页面
      this.$router.replace('/login')
    }
  },
  mounted(){
    this.$bus.$on('clearKeyword',()=>{
      this.keyword = undefined
    })
  },
  computed:{
    ...mapState('user',['userInfo'])
  }
}
</script>

<style lang="less" scoped>
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
            cursor: pointer;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="login-container">
    <!-- 登录 -->
    <div class="login-wrap">
      <div class="login">
        <div class="loginform">
          <div class="content">
            <form action="##">
              <div class="input-text clearFix">
                <span></span>
                <input type="text" placeholder="邮箱/用户名/手机号" v-model.lazy="phone">
              </div>
              <div class="input-text clearFix">
                <span class="pwd"></span>
                <input type="text" placeholder="请输入密码" v-model.lazy="password">
              </div>
              <button class="btn" @click.prevent="login">登&nbsp;&nbsp;录</button>
            </form>
            <div class="call clearFix">
              <router-link class="register" to="/registe">立即注册</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号
      </div>
    </div>
  </div>
</template>

<script>
// 引入正则
import { phoneReg,pwdReg } from '@/utils/reg';
  export default {
    name: 'Login',
    data(){
      return{
        phone:'13700000000',
        password:'111111'
      }
    },
    methods:{
      // 登录
      async login(){
        // 1、v-model收集了数据
        const {phone,password} = this
        // 2、对数据进行格式处理

        // 3、进行前端校验
            //对手机号校验 
        if(!phoneReg.test(phone)){
          this.$message.error('手机号格式不正确')
          return
        }
            //对密码进行校验
        if(!pwdReg.test(password)){
          this.$message.error('密码格式不正确')
          return
        }


        // 4、发送请求获取token
        // const {token} = await this.$API.user.reqGetToken({
        //   phone,
        //   password
        // })
        // console.log(token);
        // this.$store.dispatch('user/getToken')  
        // 把token存到localStorage里面，方便request.js文件获取到token，然后设置在请求头中
        // localStorage.setItem('token',token)
        // 5、根据token获取用户信息
        // const userInfo = await this.$API.user.reqGetUserInfo()
        // console.log(userInfo);
        // 因为其他组件也需要用到用户信息，所以把用户信息存到localStorage里面
        // userInfo是一个对象，存到localStorage里面要先转成字符串，不然会自动转字符串变成[Object Object]
        // 从localStorage里面取userInfo的时候也要手动转成对象再取。
        // localStorage.setItem('userInfo',JSON.stringify(userInfo))

         await this.$store.dispatch('user/getToken',{phone,password})
        
        // 登录成功，自动跳转到首页
        this.$router.replace('/home')
      }
    },
  }
</script>

<style lang="less" scoped>
  .login-container {
    .login-wrap {
      height: 487px;
      background-color: #e93854;

      .login {
        width: 1200px;
        height: 487px;
        margin: 0 auto;
        background: url(./images/loginbg.png) no-repeat;
      }

      .loginform {
        width: 420px;
        height: 306px;
        box-sizing: border-box;
        background: #fff;
        float: right;
        top: 45px;
        position: relative;
        padding: 20px;

        .tab {

          li {
            width: 50%;
            float: left;
            text-align: center;

            a {
              width: 100%;
              display: block;
              height: 50px;
              line-height: 50px;
              font-size: 20px;
              font-weight: 700;
              color: #333;
              border: 1px solid #ddd;
              box-sizing: border-box;
              text-decoration: none;

            }

            .current {
              border-bottom: none;
              border-top-color: #28a3ef;
              color: #e1251b;
            }
          }
        }

        .content {
          width: 380px;
          height: 316px;
          box-sizing: border-box;
          border-top: none;
          padding: 18px;

          form {
            margin: 15px 0 18px 0;
            font-size: 12px;
            line-height: 18px;

            .input-text {
              margin-bottom: 16px;

              span {
                float: left;
                width: 37px;
                height: 32px;
                border: 1px solid #ccc;
                background: url(./images/icons.png) no-repeat -10px -201px;
                box-sizing: border-box;
                border-radius: 2px 0 0 2px;
              }

              .pwd {
                background-position: -72px -201px;
              }

              input {
                width: 302px;
                height: 32px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                border-left: none;
                float: left;
                padding-top: 6px;
                padding-bottom: 6px;
                font-size: 14px;
                line-height: 22px;
                padding-right: 8px;
                padding-left: 8px;

                border-radius: 0 2px 2px 0;
                outline: none;
              }
            }

            .setting {
              label {
                float: left;
              }

              .forget {
                float: right;
              }
            }

            .btn {
              background-color: #e1251b;
              padding: 6px;
              border-radius: 0;
              font-size: 16px;
              font-family: 微软雅黑;
              word-spacing: 4px;
              border: 1px solid #e1251b;
              color: #fff;
              width: 100%;
              height: 36px;
              margin-top: 25px;
              outline: none;
            }
          }

          .call {
            margin-top: 30px;

            ul {
              float: left;

              li {
                float: left;
                margin-right: 5px;
              }
            }

            .register {
              float: right;
              font-size: 15px;
              line-height: 38px;
            }

            .register:hover {
              color: #4cb9fc;
              text-decoration: underline;
            }
          }

        }
      }
    }

    .copyright {
      width: 1200px;
      margin: 0 auto;
      text-align: center;
      line-height: 24px;

      ul {
        li {
          display: inline-block;
          border-right: 1px solid #e4e4e4;
          padding: 0 20px;
          margin: 15px 0;
        }
      }
    }

  }
</style>
<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>
        注册新用户
        <span class="go"
          >我有账号，去 <router-link to="/login">登录</router-link>
        </span>
      </h3>
      <div class="content">
        <label>手机号:</label>
        <input type="text" placeholder="请输入你的手机号" v-model="phone" />
        <span class="error-msg" v-show="message.phoneMsg">{{
          message.phoneMsg
        }}</span>
      </div>
      <div class="content">
        <label>验证码:</label>
        <input type="text" placeholder="请输入验证码" v-model="code" />
        <button class="getcode" @click="getCode" :disabled="time !== 0">
          获取验证码
        </button>
        <span class="error-msg" v-show="message.codeMsg">{{
          message.codeMsg
        }}</span>
      </div>
      <div class="content">
        <label>登录密码:</label>
        <input type="text" placeholder="请输入你的登录密码" v-model="pwd" />
        <span class="error-msg" v-show="message.pwdMsg">{{
          message.pwdMsg
        }}</span>
      </div>
      <div class="content">
        <label>确认密码:</label>
        <input type="text" placeholder="请输入确认密码" v-model="rePwd" />
        <span class="error-msg" v-show="message.rePwdMsg">{{
          message.rePwdMsg
        }}</span>
      </div>
      <div class="controls">
        <input name="m1" type="checkbox" v-model="agree" />
        <span>同意协议并注册《尚品汇用户协议》</span>
        <span class="error-msg" v-show="message.agreeMsg">{{
          message.agreeMsg
        }}</span>
      </div>
      <div class="btn">
        <button @click="register">完成注册</button>
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
      <div class="beian">京ICP备19006430号</div>
    </div>
  </div>
</template>

<script>
import { phoneReg, codeReg, pwdReg } from '@/utils/reg'
export default {
  name: 'Register',
  data() {
    return {
      phone: '',
      code: '',
      pwd: '',
      rePwd: '',
      agree: false,
      // 专门用于存储提示的警告信息
      message: {
        phoneMsg: '',
        codeMsg: '',
        pwdMsg: '',
        rePwdMsg: '',
        agreeMsg: '',
      },
      time: 0,
    }
  },
  methods: {
    // 发送验证码请求
    async getCode(event) {
      // console.log(event)
      // 先进行前端验证，减轻服务器压力
      // reg.test() 返回的是布尔值
      if (phoneReg.test(this.phone)) {
        // 进来说明满足手机号格式
        const code = await this.$API.user.reqGetCode(this.phone)
        // console.log(code);
        this.code = code

        this.time = 30
        let timer
        if (!timer) {
          timer = setInterval(() => {
            if (this.time === 0) {
              // 清除定时器
              clearInterval(timer)
              event.target.innerText = '获取验证码'
              // console.log(111);
              return
            }
            event.target.innerText = `${this.time}秒后重新发送`
            this.time -= 1
          }, 1000)
        }
        // this.time = 0
      } else {
        // 进入这里说明手机格式不正确
        this.$message.error('请输入正确的手机号')
      }
    },
    // 注册按钮
    async register() {
      // 判断手机号是否正确
      if (phoneReg.test(this.phone)) {
        // 进入这里说明手机号没问题
        this.message.phoneMsg = ''
      } else {
        // 说明手机号格式不对
        this.message.phoneMsg = '请输入正确的手机号'
        return
      }
      // 判断验证码
      if (codeReg.test(this.code)) {
        // 进入这里说明验证码正确
        this.message.codeMsg = ''
      } else {
        this.message.codeMsg = '验证码不正确'
        return
      }
      // 判断密码
      if (pwdReg.test(this.pwd)) {
        // 密码正确
        this.message.pwdMsg = ''
      } else {
        this.message.pwdMsg = '密码不符合'
        return
      }
      // 判断两次密码是否一致
      if (this.pwd === this.rePwd) {
        this.message.rePwdMsg = ''
      } else {
        this.message.rePwdMsg = '两次密码不一致'
        return
      }
      // 判断是否同意协议
      if (this.agree) {
        // 同意
        this.message.agreeMsg = ''
      } else {
        this.message.agreeMsg = '请认真阅读并勾选协议'
        return
      }

      // 所有判断都满足，即可注册成功
      const userInfo = {
        phone: this.phone,
        password: this.pwd,
        code: this.code,
      }
      // 发请求
      const result = await this.$API.user.reqRegiste(userInfo)

      // console.log(result)

      if (result && result.code === 223) {
        // 这是手机号已经注册的情况
        this.$message.error(`${result.message}`)
        this.$router.replace('/login')
      } else if (result && result.code === 206) {
        // 这是验证码错误的情况
        this.$message.error(`${result.message}`)
      } else if (result && result.code === 200) {
        // 这是成功的情况
        this.$message.success('注册成功')
        this.$router.replace('/login')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.register-container {
  .register {
    width: 1200px;
    height: 445px;
    border: 1px solid rgb(223, 223, 223);
    margin: 0 auto;

    h3 {
      background: #ececec;
      margin: 0;
      padding: 6px 15px;
      color: #333;
      border-bottom: 1px solid #dfdfdf;
      font-size: 20.04px;
      line-height: 30.06px;

      span {
        font-size: 14px;
        float: right;

        a {
          color: #e1251b;
        }
      }
    }

    div:nth-of-type(1) {
      margin-top: 40px;
    }

    .content {
      padding-left: 390px;
      margin-bottom: 18px;
      position: relative;

      label {
        font-size: 14px;
        width: 96px;
        text-align: right;
        display: inline-block;
      }

      input {
        width: 270px;
        height: 38px;
        padding-left: 8px;
        box-sizing: border-box;
        margin-left: 5px;
        outline: none;
        border: 1px solid #999;
      }

      img {
        vertical-align: sub;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .controls {
      text-align: center;
      position: relative;

      input {
        vertical-align: middle;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .btn {
      text-align: center;
      line-height: 36px;
      margin: 17px 0 0 55px;

      button {
        outline: none;
        width: 270px;
        height: 36px;
        background: #e1251b;
        color: #fff !important;
        display: inline-block;
        font-size: 16px;
      }
    }

    .getcode {
      height: 38px;
      margin-left: 10px;
      padding: 5px;
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

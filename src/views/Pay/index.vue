<template>
  <div class="pay-main">
    <div class="pay-container">
      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-icon"></span>
          <span class="success-info">订单提交成功，请您及时付款，以便尽快为您发货~~</span>
        </h4>
        <div class="paymark">
          <span class="fl">请您在提交订单<em class="orange time">4小时</em>之内完成支付，超时订单会自动取消。订单号：<em>{{ orderId }}</em></span>
          <span class="fr"><em class="lead">应付金额：</em><em class="orange money">￥{{ payInfo.totalFee }}</em></span>
        </div>
      </div>
      <div class="checkout-info">
        <h4>重要说明：</h4>
        <ol>
          <li>尚品汇商城支付平台目前支持<span class="zfb">支付宝</span>支付方式。</li>
          <li>其它支付渠道正在调试中，敬请期待。</li>
          <li>为了保证您的购物支付流程顺利完成，请保存以下支付宝信息。</li>
        </ol>
        <h4>支付宝账户信息：（很重要，<span class="save">请保存！！！</span>）</h4>
        <ul>
          <li>支付帐号：11111111</li>
          <li>密码：111111</li>
          <li>支付密码：111111</li>
        </ul>
      </div>
      <div class="checkout-steps">
        <div class="step-tit">
          <h5>支付平台</h5>
        </div>
        <div class="step-cont">
          <ul class="payType">
            <li><img src="./images/pay2.jpg"></li>
            <li><img src="./images/pay3.jpg"></li>
          </ul>

        </div>
        <div class="hr"></div>

        <div class="hr"></div>

        <div class="submit">
          <a class="btn" @click="pay">立即支付</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';
  export default {
    name: 'Pay',
    data(){
      return{
        payInfo:{},
        orderId:undefined
      }
    },
    async created(){
      const {orderId} = this.$route.query
      const payInfo = await this.$API.pay.reqCreateNative(orderId)
      // console.log(payInfo);
      this.payInfo = payInfo
      this.orderId = this.payInfo.orderId
    },
    methods:{
      async pay() {
        // qrcode返回的是一个promise，它是根据一个链接生成一个二维码，成功的结果是一个base64格式的
      const url = await QRCode.toDataURL(this.payInfo.codeUrl);
        // console.log(url);
      const htmlStr = `<img src="${url}" style="width:200px"/>`
      
      // 弹窗的具体配置
      const options = {
        dangerouslyUseHTMLString: true,
        center: true,
        showClose: false,
        showCancelButton: true,
        cancelButtonText: '支付遇到问题',
        confirmButtonText: '已完成支付',
      }
      // 弹起来！
      this.$alert(htmlStr, '微信扫码支付', {
        ...options,
        callback: (type) => {
          // 只要用户点击弹出的模版层中的确定或者取消按钮就会触发
          // 因为模版层中显示的取消和确定按钮,都是自动生成,所以只要点击其中一个按钮,就会触发callback函数
          // 参数type为cancel代表用户点击取消按钮,confirm代表点击确定按钮
          
          if (type === 'confirm') {
            // console.log('您点了确定按钮')
            this.ws.close()
            console.log('支付成功');
            this.$router.replace('/paysuccess')
          } else {
            console.log('您点了取消按钮')
          }
        }
      })

      const token = this.$store.state.user.token
      // 使用websocket
      // 1.创建链接，获取到ws实例对象
      this.ws = new WebSocket(`ws://localhost:3000/api/payment/weixin/queryPayStatus?orderId=${this.orderId}&token=${token}`)

      //2.绑定ws相关事件,实现前后端持久化通信效果
      this.ws.onmessage = (event) => {
        // console.log(event);
        const {type,data} = JSON.parse(event.data)
        console.log(type,data);
        // type为1是用来传递无关数据的,为2代表支付成功,为3代表还未支付
        if(type===1){
          console.log(data);
          return
        }
        if(type===2){
          // 支付成功，断开持久化通讯，隐藏模态框
          this.$msgbox.close()
          this.ws.close()
          this.$router.replace('/paysuccess')
          return
        }
        if(type===3){
          // 还未支付
          console.log(data);
          return
        }
      }
      
      // 为了检测通讯是否断开，一般会写定时器，
      let timer = setInterval(()=>{
        this.ws.send('reqPayStatus')
      },10000)


      this.ws.onclose = () => {
        console.log('持久化通讯已关闭');
        clearInterval(timer)
      }
    }
    },
  }
</script>

<style lang="less" scoped>
  .pay-main {
    margin-bottom: 20px;

    .pay-container {
      margin: 0 auto;
      width: 1200px;

      a:hover {
        color: #4cb9fc;
      }

      .orange {
        color: #e1251b;
      }

      .money {
        font-size: 18px;
      }

      .zfb {
        color: #e1251b;
        font-weight: 700;
      }

      .checkout-tit {
        padding: 10px;

        .tit-txt {
          font-size: 14px;
          line-height: 21px;

          .success-icon {
            width: 30px;
            height: 30px;
            display: inline-block;
            background: url(./images/icon.png) no-repeat 0 0;
          }

          .success-info {
            padding: 0 8px;
            line-height: 30px;
            vertical-align: top;
          }
        }

        .paymark {
          overflow: hidden;
          line-height: 26px;
          text-indent: 38px;

          .fl {
            float: left;
          }

          .fr {
            float: right;

            .lead {
              margin-bottom: 18px;
              font-size: 15px;
              font-weight: 400;
              line-height: 22.5px;
            }
          }
        }
      }

      .checkout-info {
        padding-left: 25px;
        padding-bottom: 15px;
        margin-bottom: 10px;
        border: 2px solid #e1251b;

        h4 {
          margin: 9px 0;
          font-size: 14px;
          line-height: 21px;
          color: #e1251b;
        }

        ol {
          padding-left: 25px;
          list-style-type: decimal;
          line-height: 24px;
          font-size: 14px;
        }

        ul {
          padding-left: 25px;
          list-style-type: disc;
          line-height: 24px;
          font-size: 14px;
        }
      }

      .checkout-steps {
        border: 1px solid #ddd;
        padding: 25px;

        .hr {
          height: 1px;
          background-color: #ddd;
        }

        .step-tit {
          line-height: 36px;
          margin: 15px 0;
        }

        .step-cont {
          margin: 0 10px 12px 20px;

          ul {
            font-size: 0;

            li {
              margin: 2px;
              display: inline-block;
              padding: 5px 20px;
              border: 1px solid #ddd;
              cursor: pointer;
              line-height: 18px;
            }
          }
        }
      }

      .submit {
        text-align: center;

        .btn {
          display: inline-block;
          padding: 15px 45px;
          margin: 15px 0 10px;
          font: 18px "微软雅黑";
          font-weight: 700;
          border-radius: 0;
          background-color: #e1251b;
          border: 1px solid #e1251b;
          color: #fff;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          text-decoration: none;
        }
      }
    }
  }
</style>
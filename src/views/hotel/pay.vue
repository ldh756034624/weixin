<template>
  <div class="page">
    <p class="tips">
      {{orderInfo.tips}}
    </p>
    <p class="count">
      <span>订单总金额</span>
      <span class="count-money">￥<span>{{orderInfo.orderMoney}}</span></span>
    </p>
    <p class="count">
      <span>已支付</span>
      <span class="count-money">￥<span>{{orderInfo.paidMoney}}</span></span>
    </p>
    <p class="count">
      <span>待支付</span>
      <span class="count-money">￥<span>{{orderInfo.unpaidMoney}}</span></span>
    </p>
    <p class="title">使用酒元支付</p>
    <div class="pay-block">
      <div class="left">
        酒元余额(￥{{orderInfo.balance}})
      </div>
      <i class="right" :class="useJy ? 'checked' : ''" @click="handlePayWay(1)"></i>
    </div>
    <p class="title">使用第三方支付</p>
    <div class="pay-block">
      <div class="left">
        <i class="weixin-icon"></i>
        微信
        <span class="weixin-count" v-if="useRmb">需支付：{{wexinBalance | price2}}元</span>
      </div>
      <i class="right" :class="useRmb ? 'checked' : ''" @click="handlePayWay(2)"></i>
    </div>

    <p class="confirm" @click="confirm">确认支付</p>

    <!--页面加载过渡-->
    <fullLoading :loadingShow="loadingShow"></fullLoading>
  </div>
</template>

<script>
  import FullLoading from '@/components/fullLoading'

  export default {
    created() {
      if (this.$route.query.orderInfo) {  // 从填写订单跳过来
        this.orderInfo = JSON.parse(this.$route.query.orderInfo)
        this.loadingShow = false
        this.payParams.hotelOrderId = this.orderInfo.hotelOrderId
      } else { // 从未支付订单列表过来
        this.getPayInfo(this.$route.query.id)
      }
    },
    data() {
      return {
        loadingShow: true,
        orderInfo: {},  // 支付信息,两个来源，一个从填写页面，一个从订单列表
        wexinBalance: 0, // 微信需要支付的价格
        useJy: true,  // 选择使用酒元
        useRmb: false, // 选择使用微信支付
        payParams: { // 公众号支付跳转请求参数
          hotelOrderId: null, // 订单Id
          payMethod: 1, // 支付方式 (1, "余额支付"),(2,"微信支付"),(3,"混合支付")
          payPlatform: 'wxjs' // 支付平台 'wx'(微信APP）'wxjs'(公众号)
        }
      }
    },
    methods: {
      // 根据id获取支付信息
      getPayInfo(id) {
        this.$http.get('/h9/api/hotel/order/pay?hotelOrderId=' + id).then(res => {
          let data = res.data
          if (data.code === 0) {
            this.orderInfo = data.data
            this.payParams.hotelOrderId = this.orderInfo.hotelOrderId
            this.loadingShow = false
          }
        })
      },
      /** 选择支付方法
       * @param type [1酒元， 2微信]
       */
      handlePayWay(type) {
        if (type === 1) {
          this.useJy = !this.useJy
        } else {
          this.useRmb = !this.useRmb
        }
        this.calcWeixinBalance()
        this.createPayMethod()
      },
      // 计算微信需要支付的金额
      calcWeixinBalance() {
        if (this.useJy) {
          this.wexinBalance = this.orderInfo.unpaidMoney - this.orderInfo.balance
        } else {
          this.wexinBalance = this.orderInfo.unpaidMoney
        }

        if(this.wexinBalance <=0) { // 如果金额小于0不需要微信支付
          this.useRmb = false
        }
      },
      // 判断支付方式 (1, "余额支付"),(2,"微信支付"),(3,"混合支付")
      createPayMethod() {
        if (this.useJy && this.useRmb) {
          this.payParams.payMethod = 3
        } else if (this.useJy) {
          this.payParams.payMethod = 1
        } else {
          this.payParams.payMethod = 2
        }
      },
      confirm() { // 确认支付
        _g.showLoading('支付中')
        this.$http.post('/h9/api/hotel/order/pay', this.payParams).then(res => {
          _g.hideLoading()
          if (res.data.code === 0) {
            // 支付成功
            if (res.data.data.payResult.resumePay) { // resumePay为true，继续使用微信支付
              const url = window.location.href.split("#")[0]
              let callbackurl = url + '#/hotel/success?orderId=' + this.orderInfo.hotelOrderId // 成功回调
              let callbackFail = url + '#/hotel/fail?orderId=' + this.orderInfo.hotelOrderId // 失败回调
              callbackurl = encodeURIComponent(callbackurl) // encode
              callbackFail = encodeURIComponent(callbackFail) // encode
              let link = res.data.data.wxPayInfo.payUrl + '&callback=' + callbackurl + '&callbackFail=' + callbackFail
              window.location.replace(link)
            } else {
              this.$router.replace('/hotel/success?orderId=' + this.orderInfo.hotelOrderId)
            }
          } else {
            // 支付失败
            this.$router.replace('/hotel/fail?orderId=' + this.orderInfo.hotelOrderId)
          }
        })
      }
    },
    components: {
      FullLoading
    }
  }
</script>
<style scoped lang='less'>
  .page {
    height: 100%;
    line-height: 1;
    background: #EDF1F2;
  }

  .title {
    height: 32px;
    line-height: 32px;
    padding-left: 15px;
    font-size: 12px;
    color: #999999;
  }

  .tips {
    height: 86px;
    line-height: 86px;
    text-align: center;
    background: #fff;
    font-size: 15px;
    color: #627984;
    border-bottom: 1px solid #f2f2f2;
  }

  .count {
    padding: 0 15px;
    height: 44px;
    line-height: 44px;
    display: flex;
    justify-content: space-between;
    background: #fff;
    font-size: 15px;
    .count-money {
      font-size: 12px;
      color: #E57B7B;
      & > span {
        font-size: 18px;
      }
    }
  }

  .pay-block {
    padding: 0 15px;
    height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    color: #333333;
    background: #fff;
    .left {
      display: flex;
      align-items: center;
      .weixin-icon {
        display: inline-block;
        margin-right: 10px;
        height: 27px;
        width: 27px;
        background-image: url("../../assets/img/hotel/weixin@2x.png");
        background-size: 100% 100%;
      }
      .weixin-count {
        margin-left: 30px;
        font-size: 15px;
        color: #E57B7B;
      }
    }
    .right {
      height: 18px;
      width: 18px;
      background-image: url("../../assets/img/account/duihao_kong@2x.png");
      background-size: 100% 100%;
      &.checked {
        background-image: url("../../assets/img/account/duihao@2x.png");
      }
    }
  }

  .confirm {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    background: #627984;
  }

</style>

<style lang="less">
</style>

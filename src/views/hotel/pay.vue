<template>
  <div class="page">
    <p class="tips">
      {{orderInfo.tips}}
    </p>
    <p class="count">
      <span>订单总金额</span>
      <span class="count-money">￥<span>{{orderInfo.orderMoney}}</span></span>
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
      } else { // 从未支付订单聊表过来
        this.getPayInfo()
      }
    },
    data() {
      return {
        loadingShow: true,
        orderInfo: {},  // 支付信息,两个来源，一个从填写页面，一个从订单列表
        wexinBalance: 0, // 微信需要支付的价格
        useJy: false,  // 选择使用酒元
        useRmb: false // 选择使用微信支付
      }
    },
    methods: {
      // 根据id获取支付信息
      getPayInfo() {
        this.$http.get('/h9/api/hotel/order/pay?hotelOrderId=' + this.$route.query.id).then(res => {
          let data = res.data
          if (data.code === 0) {
            this.orderInfo = data.data
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
      },
      // 计算微信需要支付的金额
      calcWeixinBalance() {
        if (this.useJy) {
          this.wexinBalance = this.orderInfo.orderMoney - this.orderInfo.balance
        } else {
          this.wexinBalance = this.orderInfo.orderMoney
        }
      },
      confirm() { // 确认支付
        _g.showLoading('支付中')
        setTimeout(() => {
          _g.hideLoading()

          this.$router.push({path: '/hotel/success'})
        }, 1500)
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

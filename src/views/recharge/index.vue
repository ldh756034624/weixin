<template>
  <div class="page">
    <div class="wrapper">
      <div class="top">
        <p class="title">选择支付方式</p>
        <div class="pay-wrapper">
          <div class="left">
            <i class="weixin-icon"></i>
            <span>微信</span>
          </div>
          <i class="right"></i>
        </div>
      </div>
      <div class="middle">
        <p class="title">充值金额</p>
        <x-input v-model.number="fundMoneyt" title='￥' :value="fundMoneyt" :show-clear="false" keyboard="number" placeholder="请输入充值金额" class="fundMoney">
        </x-input>
      </div>
      <div class="pay-btn" @click="handleRecharge">
        充值
      </div>
    </div>
  </div>
</template>
<script>
  import {XInput} from 'vux'

  export default {
    mounted() {
      this.setTitle('充值');
    },
    data() {
      return {
        fundMoney: null,
      }
    },
    methods: {
      handleRecharge() {
        if (this.fundMoney > 0) {
          this.$http.get('/h9/api/recharge/order?money=' + this.fundMoney).then(res => {
            let data = res.data
            if (data.code === 0) {
              const url = window.location.href.split("#")[0]
              let callbackurl = url + '#/recharge/success?orderId=' + data.data.orderId // 成功回调
              let callbackFail = url + '#/recharge/fail' // 失败回调
              callbackurl = encodeURIComponent(callbackurl) // encode
              callbackFail = encodeURIComponent(callbackFail) // encode
              location.replace(data.data.payUrl + '&callback=' + callbackurl + '&callbackFail=' + callbackFail)
            }
          })
        } else {
          _g.toastMsg('error', '输入充值金额')
        }
      }
    },
    computed: {
      fundMoneyt: {
        get: function () {
          return this.fundMoney
        },
        set: function (val) {
          if (!val) return null
          if (!/^\d+(?:.\d{1,2})?$/.test(val)) _g.toastMsg('error', '不能超过两位小数点')
          this.fundMoney = Number(val.toFixed(2))
        }
      }
    },
    components: {
      XInput
    }
  }

</script>

<style scoped lang='less'>
  .page {
    height: 100%;
    padding-top: 10px;
    position: relative;
    line-height: 1;
    background: #F2F2F2;
    .wrapper {
      margin: 0 15px;
      background: #fff;
      padding: 15px;
      .title {
        margin-bottom: 20px;
        font-size: 12px;
        color: #333333;
      }
    }
  }

  .top {
    padding-bottom: 20px;
    margin-bottom: 25px;
    border-bottom: 1px solid #f2f2f2;
    .pay-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        font-size: 15px;
        color: #333333;
        .weixin-icon {
          margin-right: 10px;
          height: 27px;
          width: 27px;
          background-size: 100% 100%;
          background-image: url("../../assets/img/shop/weixin@2x.png");
        }
      }
      .right {
        width: 18px;
        height: 18px;
        background-size: 100% 100%;
        background-image: url("../../assets/img/addr/queding.png");
      }
    }
  }

  .middle {
    padding-bottom: 12px;
    margin-bottom: 50px;
    border-bottom: 1px solid #f2f2f2;
  }

  .pay-btn {
    height: 50px;
    line-height: 50px;
    text-align: center;
    margin: 0 15px;
    background: #627984;
    border-radius: 4px;
    font-size: 16px;
    color: #FFFFFF;
  }
    .fundMoney {
    font-size: 26px;
  }
</style>
<style lang="less">
  .middle {
    .vux-x-input {
      padding: 0;
      &:before {
        border: none;
      }
      .weui-label {
        font-size: 36px;
        color: #333333;
        width: auto !important;
      }
      .weui-input {
        height: 40px;
      }
    }
  }

</style>

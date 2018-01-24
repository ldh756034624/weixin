<template>
  <div class="page">
    <div class="top">
      <i class="icon-fail"></i>
      <span class="tip1">订单支付失败</span>
      <span class="tip2">请在23:59之前完成支付，过期将自动取消订单</span>
    </div>
    <div class="btn-wrapper">
      <span class="home" @click="repay">重新支付</span>
      <span class="purse" @click="viewOrder">查看订单</span>
    </div>
  </div>
</template>

<script>
  export default {
    created() {
      this.orderId = this.$route.query.orderId
    },
    data() {
      return {}
    },
    methods: {
      repay() {
        this.$router.replace('/hotel/pay?id=' + this.orderId)
      },
      viewOrder() {
        this.$router.replace('/hotel/orderList?id=' + this.orderId)
      }
    }
  }
</script>
<style scoped lang='less'>
  .page {
    height: 100%;
    line-height: 1;
    background: #fff;
  }

  .top {
    padding: 60px 0 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon-fail {
      height: 50px;
      width: 50px;
      background-size: 100% 100%;
      background-image: url("../../assets/img/account/tixian_img_fail@2x.png");
      margin-bottom: 20px;
    }
    .tip1 {
      margin-bottom: 10px;
      font-size: 14px;
      color: #627984;
    }
    .tip2 {
      font-size: 12px;
      color: #999999;
    }
  }

  .btn-wrapper {
    display: flex;
    justify-content: space-around;
    & > span {
      width: 132px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      border: 1px solid #627984;
      font-size: 16px;
      border-radius: 4px;
    }
    .home{
      color: #627984;
    }
    .purse{
      color: #fff;
      background: #627984;
    }
  }

</style>

<style lang="less">
</style>

<template>
  <div class="page">
    <div class="top">
      <i class="icon-success"></i>
      <span class="tip1">等待确认</span>
      <span class="tip2">您的订单已经提交成功，我们将尽快确认</span>
    </div>
    <div class="info-wrapper">
      <p class="info-item">
        <span class="left">入住酒店</span>
        <span class="right">{{orderInfo.hotelName}}</span>
      </p>
      <p class="info-item">
        <span class="left">入住时间</span>
        <span class="right"><span class="time-range">{{orderInfo.comeRoomTime}}-{{orderInfo.outRoomTime}}</span>共{{orderInfo.stayNightCount}}晚</span>
      </p>
      <p class="info-item">
        <span class="left">入住房型</span>
        <span class="right">{{orderInfo.roomTypeName}}</span>
      </p>
    </div>

    <div class="btn-wrapper">
      <span class="home" @click="handleHome">回到首页</span>
      <span class="purse" @click="handleOrder">查看订单</span>
    </div>
  </div>
</template>

<script>
  export default {
    created() {
      sessionStorage.paySuccess = 'true'
      this.orderId = this.$route.query.orderId
      this.getOrderInfo()
    },
    data() {
      return {
        orderInfo: {} // 酒店详情
      }
    },
    methods: {
      getOrderInfo() {
        this.$http.get('/h9/api/hotel/order/detail?orderId=' + this.orderId).then(res => {
          let data = res.data
          if (data.code === 0) {
            this.orderInfo = data.data
          }
        })
      },
      // 回到首页
      handleHome() {
        this.$router.replace('/hotel/list')
      },
      // 查看订单
      handleOrder() {
        this.$router.replace('/hotel/orderDetail?id=' + this.orderId)
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
    padding: 60px 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon-success {
      height: 50px;
      width: 50px;
      background-size: 100% 100%;
      background-image: url("../../assets/img/account/tixian_img_success.png");
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

  .info-wrapper {
    margin-bottom: 30px;
    .info-item {
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      color: #333;
      .left {
        color: #999;
      }
      .right {
        .time-range {
          margin-right: 20px;
        }
      }
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
    .home {
      color: #627984;
    }
    .purse {
      color: #fff;
      background: #627984;
    }
  }

</style>

<style lang="less">
</style>

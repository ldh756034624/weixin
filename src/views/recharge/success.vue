<template>
  <div class="page">
    <div class="top">
      <i class="icon-success"></i>
      <span class="tip1">充值成功</span>
    </div>
    <div class="info-wrapper">
      <p class="info-item">
        <span class="left">充值时间</span>
        <span class="right">{{result.time}}</span>
      </p>
      <p class="info-item">
        <span class="left">充值金额</span>
        <span class="right">￥{{result.money}}</span>
      </p>
    </div>

    <div class="btn-wrapper">
      <span class="purse" @click="handleDone">完成</span>
    </div>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.setTitle('充值成功');
    },
    created() {
      this.orderId = this.$route.query.orderId
      this.getResult()
    },
    data() {
      return {
        result: {} // 充值结果
      }
    },
    methods: {
      // 完成
      handleDone() {
        this.$router.replace({path:'/account/personal'})
      },
      getResult() {
        this.$http.get('/h9/api/recharge/order/' + this.orderId).then(res => {
          if (res.data.code === 0) {
            this.result = res.data.data
          }
        })
      },
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
    padding: 120/40rem 0 40/40rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon-success {
      height: 100/40rem;
      width: 100/40rem;
      background-size: 100% 100%;
      background-image: url("../../assets/img/account/tixian_img_success.png");
      margin-bottom: 40/40rem;
    }
    .tip1 {
      margin-bottom: 20/40rem;
      font-size: 28/40rem;
      color: #627984;
    }
    .tip2 {
      font-size: 24/40rem;
      color: #999999;
    }
  }

  .info-wrapper {
    margin-bottom: 60/40rem;
    .info-item {
      padding: 0 30/40rem;
      display: flex;
      justify-content: space-between;
      height: 100/40rem;
      line-height: 100/40rem;
      font-size: 30/40rem;
      color: #333;
      .left {
        color: #999;
      }
      .right {
        .time-range {
          margin-right: 40/40rem;
        }
      }
    }
  }

  .btn-wrapper {
    display: flex;
    justify-content: space-around;
    & > span {
      width: 90%;
      height: 100/40rem;
      line-height: 100/40rem;
      text-align: center;
      border: 1px solid #627984;
      font-size: 32/40rem;
      border-radius: 4px;
    }
    .purse {
      color: #fff;
      background: #627984;
    }
  }

</style>

<style lang="less">
</style>

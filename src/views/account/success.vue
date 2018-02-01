<template>
  <div class="page">
    <div class="top">
      <i class="icon-success"></i>
      <span class="tip1">转账成功</span>
    </div>
    <div class="info-wrapper">
      <p class="info-item">
        {{success}}
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
      this.setTitle('转账成功');
      this.success = this.$route.query.success
    },
    created() {
      this.orderId = this.$route.query.orderId
    },
    data() {
      return {
        success:null
      }
    },
    methods: {
      // 完成
      handleDone() {
        this.$router.replace({path:'/account/purse'})
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
      text-align: center;
      font-size: 12px;
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
      width: 90%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      border: 1px solid #627984;
      font-size: 16px;
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

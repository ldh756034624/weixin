<template>
  <div class="page">
    <div class="top">
      <i class="icon-fail"></i>
      <span class="tip1">充值失败</span>
    </div>
    <div class="btn-wrapper">
      <span class="home" @click="handleRecharge">重新充值</span>
      <span class="purse" @click="handleHome">返回首页</span>
    </div>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.setTitle('充值失败');
    },
    data() {
      return {}
    },
    methods: {
      // 完成
      handleHome() {
        this.$router.replace({path:'/account/purse'})
      },
      handleRecharge() {
        this.$router.replace({path:'/recharge/index'})
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
    padding: 120/40rem 0 140/40rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon-fail {
      height: 100/40rem;
      width: 100/40rem;
      background-size: 100% 100%;
      background-image: url("../../assets/img/account/tixian_img_fail@2x.png");
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

  .btn-wrapper {
    display: flex;
    justify-content: space-around;
    & > span {
      width: 264/40rem;
      height: 100/40rem;
      line-height: 100/40rem;
      text-align: center;
      border: 1px solid #627984;
      font-size: 32/40rem;
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

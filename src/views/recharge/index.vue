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
    </div>
  </div>
</template>
<script>
  import {XButton} from 'vux'

  export default {
    mounted() {
    },
    data() {
      return {}
    },
    components: {
      XButton
    },
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
    }
  }

  .top {
    padding-bottom: 20px;
    border-bottom: 1px solid #f2f2f2;
    .title {
      margin-bottom: 20px;
      font-size: 12px;
      color: #333333;
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
            background-image: url("");
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
  }

</style>

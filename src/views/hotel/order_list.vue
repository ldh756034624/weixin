<template>
  <div class="page">
    <div class="top">
      <p class="name">7天优品酒店</p>
      <p class="addr">庐阳区宿州北路318号近明光路</p>
      <p class="rang-time">2017年12月13至2017年12月14日</p>
      <p class="desc">
        <span>共1晚</span>
        <span>1间</span>
        <span>无早</span>
        <span>豪华大床房</span>
      </p>
    </div>
    <div class="title">支付信息</div>
    <div class="info-block">
      <p class="item">
        <span class="left">酒店支付</span>
        <span class="right">￥58.21</span>
      </p>
      <p class="item">
        <span class="left">微信支付</span>
        <span class="right">￥58.21</span>
      </p>
    </div>

    <div class="title">订单信息</div>
    <div class="info-block">
      <p class="item">
        <span class="left">入住人</span>
        <span class="right">张三</span>
      </p>
      <p class="item">
        <span class="left">手机号</span>
        <span class="right">1231231231213</span>
      </p>
      <p class="item">
        <span class="left">订单号</span>
        <span class="right">1231231231213</span>
      </p>
      <p class="item">
        <span class="left">下单时间</span>
        <span class="right">2017-08-26 14:22</span>
      </p>
    </div>

    <div class="title">发票信息</div>
    <div class="info-block">
      <p class="item">
        <span class="right">请到酒店前台索取发票</span>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    created() {
    },
    data() {
      return {}
    },
  }
</script>
<style scoped lang='less'>
  .page {
    height: 100%;
    line-height: 1;
    background: #EDF1F2;
  }

  .top {
    padding: 16px;
    font-size: 12px;
    color: #999;
    background: #fff;
    .name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 16px;
      color: #333333;
    }
    .addr {
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #f2f2f2;
    }
    .rang-time {
      margin-bottom: 10px;
      color: #666666;
    }
    .desc > span {
      margin-right: 10px;
    }
  }

  .title {
    height: 32px;
    line-height: 32px;
    padding-left: 15px;
    font-size: 12px;
    color: #999999;
  }

  .info-block {
    background: #fff;
    font-size: 15px;
    color: #333333;
    .item{
      height: 50px;
      line-height: 50px;
      padding-left: 15px;
      .left{
        display: inline-block;
        width: 100px;
        color: #999;
      }
    }

  }

</style>

<style lang="less">
</style>

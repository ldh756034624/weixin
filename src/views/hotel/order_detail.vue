<template>
  <div class="page">
    <div class="top">
      <p class="name">{{orderInfo.hotelName}}</p>
      <p class="addr">{{orderInfo.hotelAddress}}</p>
      <p class="rang-time">{{orderInfo.comeRoomTime}}至{{orderInfo.outRoomTime}}</p>
      <p class="desc">
        <span>共{{orderInfo.stayNightCount}}晚</span>
        <span>{{orderInfo.roomCount}}间</span>
        <span>{{orderInfo.include}}</span>
        <span>{{orderInfo.roomTypeName}}</span>
      </p>
    </div>
    <div class="title">支付信息</div>
    <div class="info-block">
      <p class="item" v-if="orderInfo.payMoney4Wechat">
        <span class="left">酒元支付</span>
        <span class="right">￥{{orderInfo.payMoney4JiuYuan}}</span>
      </p>
      <p class="item" v-if="orderInfo.payMoney4Wechat">
        <span class="left">微信支付</span>
        <span class="right">￥{{orderInfo.payMoney4Wechat}}</span>
      </p>
    </div>

    <div class="title">订单信息</div>
    <div class="info-block">
      <p class="item">
        <span class="left">入住人</span>
        <span class="right">{{orderInfo.roomer}}</span>
      </p>
      <p class="item">
        <span class="left">手机号</span>
        <span class="right">{{orderInfo.phone}}</span>
      </p>
      <p class="item">
        <span class="left">订单号</span>
        <span class="right">{{orderInfo.id}}</span>
      </p>
      <p class="item">
        <span class="left">下单时间</span>
        <span class="right">{{orderInfo.createTime}}</span>
      </p>
    </div>

    <div class="title">发票信息</div>
    <div class="info-block">
      <p class="item">
        <span class="right">请到酒店前台索取发票</span>
      </p>
    </div>

    <!--页面加载过渡-->
    <fullLoading :loadingShow="loadingShow"></fullLoading>
  </div>
</template>

<script>
  import FullLoading from '@/components/fullLoading'

  export default {
    created() {
      this.setTitle('酒店订单详情');
      this.id = this.$route.query.id
      this.getDetail()
    },
    data() {
      return {
        loadingShow: true,
        orderInfo: {} // 订单详情信息
      }
    },
    methods: {
      // 获取订单详情
      getDetail() {
        this.$http.get('/h9/api/hotel/order/detail?orderId=' + this.id).then(res => {
          let data = res.data
          if (data.code === 0) {
            this.orderInfo = data.data
            this.loadingShow = false
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
    .item {
      height: 50px;
      line-height: 50px;
      padding-left: 15px;
      .left {
        display: inline-block;
        width: 100px;
        color: #999;
      }
    }

  }

</style>

<style lang="less">
</style>

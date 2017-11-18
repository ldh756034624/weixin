<template>
	<div class="page">
    <div class="orderBox">
      <div class="flexBox">
        <img class="orderIcons" src="../../assets/img/account/order_store_huijiu@2x.png"/>
        <p class="flex1">{{orderDetailData.company}}</p>
        <span class='redFont'>{{orderDetailData.orderStatus}}</span>
      </div>
      <div class="flexBox orderContBox" @click='goOrderDetail()'>
        <img class="orderImg" :src="orderDetailData.goodsInfoList[0].imgUrl"/>
        <div class="flex1">
          <p class="orderText">{{orderDetailData.goodsInfoList[0].goodsName}}</p>
        </div>
      </div>
    </div>
    <div v-if='orderDetailData.orderType==1'>
      <p class="blockTips">商品信息</p>
      <div class="orderMsgBox">
        <p>
          <label>充值金额</label>{{orderDetailData.rechargeMoney}}
        </p>
        <p>
          <label>充值号码</label>{{orderDetailData.tel}}
        </p>
      </div>
    </div>
    <div v-if='orderDetailData.orderType==2'>
      <p class="blockTips">商品信息</p>
      <div class="orderMsgBox">
        <p>
          <label>面值</label>{{orderDetailData.rechargeMoney}}
        </p>
        <p>
          <label>券号</label>{{orderDetailData.couponsNumber}}
        </p>
      </div>
    </div>
    <div v-if='orderDetailData.orderType==3'>
      <p class="blockTips">配送信息</p>
      <div class="orderMsgBox">
        <p>
          <label>收货人</label>{{orderDetailData.accepterName}}
        </p>
        <p>
          <label>联系方式</label>{{orderDetailData.tel}}
        </p>
        <p>
          <label>联系地址</label>{{orderDetailData.address}}
        </p>
        <p>
          <label>物流单号</label>{{orderDetailData.logisticsNumber}}
        </p>
      </div>
    </div>
    <p class="blockTips">订单信息</p>
    <div class="orderMsgBox">
      <p>
        <label>订单号</label>{{orderDetailData.orderId}}
      </p>
      <p>
        <label>下单时间</label>{{orderDetailData.createOrderDate}}
      </p>
      <p>
        <label>支付方式</label>{{orderDetailData.payMethod}}
      </p>
      <p>
        <label>支付金额</label>{{orderDetailData.payMoney}}
      </p>
    </div>
      <!-- <div class="orderBottomBtn">
          <x-button mini @click.native="">确认修改</x-button>
      </div> -->
  </div>
</template>
<script>
import {XButton} from 'vux'
export default {
  mounted(){
    let  self=this;
    self.setTitle('订单详情');
    self.init();
  },
  data () {
    return {
      cuponListDetail:false,
      orderId:this.$route.query.orderId,
      orderDetailData:{},
    }
  },
  methods:{
    init(){
      let self = this
      self.$http.get('h9/api/orders/'+self.orderId)
        .then(function(res) {
          if(res.data.code==0){
              self.orderDetailData=res.data.data
          }
        })
    },
    exchangeFn:function(){
      let self=this;
    }

  },
  components: {
     XButton
  },
}

</script>

<style scoped lang='less'>
  .orderBox{
    font-size: 24/40rem;
    background: #fff;
    margin-top: 20/40rem;
    .flexBox{
      padding: 15/40rem 30/40rem;
      font-size: 32/40rem;
    }
    .orderContBox{
      padding: 30/40rem 0;
      margin: 0 30/40rem;
      border-top: 1px solid #f2f2f2;
    }
    .orderText{
      font-size: 32/40rem;
      line-height: 120/40rem;
    }
  }
  .orderIcons{
    width: 60/40rem;
    height: 60/40rem;
    margin-right: 20/40rem;
  }
  .orderImg{
    width: 140/40rem;
    height: 140/40rem;
    margin-right: 30/40rem;
  }
  .orderMsgBox{
    font-size: 28/40rem;
    background: #fff;
    padding: 0 30/40rem;
    p{
      padding: 25/40rem 0;
    }
    label{
      color: #999;
      display: inline-block;
      width: 160/40rem;
    }
  }
  .orderBottomBtn{
    position: fixed;
    background: #fff;
    padding: 15/40rem;
    bottom: 0;
    width: 100%;
    text-align: right;
  }
</style>
<style type="text/css" lang='less'>
  .orderBottomBtn .weui-btn_mini{
    background: #fff;
    margin-right: 50/40rem;
    border: 1px solid #999;
    color: #666;
    border-radius: 0;
    .weui-btn:after{
      border:none;
    }
  }
</style>

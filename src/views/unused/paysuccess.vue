<template>
<div class="page" transition="app">
  <div class="content" v-show='showPayPage'>
    <div class="paysuccess-wrap" v-if="this.successflag == 1">
      <img src="../../assets/img/mian/pay-success.png">
      <div>支付成功</div>
    </div>
    <div class="paysuccess-wrap" v-if="this.successflag == 0">
      <img src="../../assets/img/mian/tips_sad.png">
      <div>支付未完成</div>
    </div>
    <div class="commonbtn-wrap pd30" >
      <x-button @click.native="goDetail"  mini class="commonbtn" v-if="redirectType!='payensure'">查看订单详情</x-button>
      <x-button @click.native="goback()"  mini class="back">返回</x-button>
    </div>

  </div>
</div>
</template>

<script>
import {XButton } from 'vux'
export default {
  mounted () {
    let self=this;
    self.init();
  },
  data() {
    return {
      result: "结果",
      successflag: 1,  //0.支付失败，1.支付成功
      orderId:this.$route.query.orderId,
      goodId:this.$route.query.goodId,
      price:this.$route.query.price,
      type:this.$route.query.type,
      buyTableId:this.$route.query.tableId,
      showPayPage:false,
      redirectType:''
    };
  },
  methods:{
    init:function(){
      let self=this;
      if(self.type){
        self.showPayPage=false;
        sessionStorage.setItem("buyTableId",self.buyTableId);
        sessionStorage.setItem("payType",self.type);
        localStorage.setItem("payType",self.type);
        if(self.goodId){
          sessionStorage.setItem("payGoodId",self.goodId);
        }
        let hyburl ='',curl='';
        let url = document.location.href.split('#')[0]
        if (url.indexOf('localhost:8080')!=-1 || url.indexOf('dev-usedgoods.thy360.com/used_good')!=-1) {
          hyburl = 'https://api-devtest-hyb.thy360.com'
        } else if (url.indexOf('weixin-usedgoods.thy360.com')!=-1) {
          hyburl = 'https://hybapi.thy360.com'
        }
        if(self.type=='payensure'){
          curl = hyburl+'/ja/paygateway/v1/pay/request/appidzzerhuo0vyokl/ensure/'+self.orderId+'/'+self.price+'/'+JSON.parse(localStorage.getItem('_user')).token;
        }else{
          curl = hyburl+'/ja/paygateway/v1/pay/request/appidzzerhuo0vyokl/order/'+self.orderId+'/'+self.price+'/'+JSON.parse(localStorage.getItem('_user')).token;
        }
        location.href = curl;
      }else{
        self.showPayPage=true;
        self.redirectType=sessionStorage.getItem("payType");
        if(self.redirectType=='payensure'){
          self.ifPayEnsure();
        }else{
          self.ifPaySuccess();
        }
      }
      
    },
    ifPaySuccess: function(){
      let self = this;
      let rcmurl ='/sh/ja/v1/myOrder/detail/'+this.$route.query.orderId;
      self.$http.get(rcmurl)
        .then(function(res) {
          if(res.data.statusCode==0){
            
            if(res.data.data.orderStatus == '0' || res.data.data.orderStatus == '1'){
              self.successflag =0;
              self.result = "未完成";
            }else{
              self.successflag =1;
              self.result = "成功";
            }
            self.setTitle("支付"+self.result);
          } else {
            self.$vux.toast.show({
              text:  res.data.msg,
              type: 'text',
            })
          }
        })
    },
    ifPayEnsure:function(){
      self.$http.get('/sh/ja/v1/2/'+sessionStorage.getItem("payGoodId")+'/detail')
        .then(function(res) {
          if(res.data.statusCode==0){
            if(res.data.data.payEnsure==false){
              self.successflag =0;
              self.result = "未完成";
            }else{
              self.successflag =1;
              self.result = "成功";
            }
            self.setTitle("支付"+self.result);
          } else {
            self.$vux.toast.show({
              text:  res.data.msg,
              type: 'text',
            })
          }
        })
    },
    goDetail: function(){
      this.$router.push({path:'/account/orderdetail',query: {orderId: this.$route.query.orderId}})
    },
    goback:function(){
      let self=this;
      if(sessionStorage.getItem("payType")=='payensure'){
         self.$router.push({path:'/sale/detaile',query:{tableId:sessionStorage.getItem("buyTableId"),goodId:sessionStorage.getItem("payGoodId")}})
       }else{
         history.go(-3)
       }
      
    }
  },
  components: {
    XButton
  }
}
</script>
<style scoped lang='less'>
  .paysuccess-wrap{
    font-size: 0;
    margin-top: 114/40rem;
    text-align: center;
    div{
      margin-top: 30/40rem;
      font-size: 34/40rem;
      color: #999;
    }
    img{
      width: 216/40rem;
      height: 260/40rem;
      margin-left: 50/40rem;
    }
  }
  .back{
    background:#fff;
    border:1px solid #38446A;
    color:#38446A;
    width:100%;

  }
</style>
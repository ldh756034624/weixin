<template>
  <div class="page payensurePage">

      <main class='payensureMain'>
         <section class='ensureBox alignC'>
            <p class="ensureText">保证金</p>
            <p class="redFont ensureMoney"><span style='font-size:24px'>￥</span>{{ensureData.ensurePrice== 0 ? '0.00': ensureData.ensurePrice | price2}}</p>
            <p class="gray9Font font14">首次出价需缴纳保证金</p>
            <p class="gray9Font font14">拍卖不成功或支付尾款后将退回</p>
         </section>
         <p class="ensureTipsAddr">为保证竞拍成功后顺利交易,请确认收货地址</p>
         <router-link :to="{path:'/account/addresslist',query:{path:'/sale/payensure',goodId:auctionId}}">
             <section class='ensureBox ensureAddress'>
                <p class='ensureaddrp'><span >收货地址</span><span v-bind:class="{err: !address.village}">{{address.village || '请输入收货地址'}}
                {{address.room1}}</span></p>
                <p class='ensureaddrp'><span >收货人</span><span v-bind:class="{err: !address.village}">{{
                address.contact}} {{address.phone || '请输入收货人'}}</span></p>
             </section>
         </router-link>
         <p class="ensureTipsDeal">竞拍需同意猪猪集市竞拍协议 
         <span class='blueFont' v-on:click="showDealFn()" v-show='showchoose'>查看协议 <span class='dealicon'></span></span>
         <span class='blueFont' v-on:click="showchoose=true" v-show='!showchoose'>查看协议 <span class='dealicon dealIconChoosed'></span></span>
         </p>
         <button class="ensureBtn BlueBtn" @click='payEnsureMoney'>提交保证金</button>
      </main>
      <div v-transfer-dom>
        <popup v-model="show2" height="100%" class='dealPopup'>
          <userDeal v-model="show2" v-on:listenToDealShow='dealShowFn'></userDeal>
        </popup>
      </div>
  </div>
</template>

<script>
import {  Group, XInput,Popup,TransferDom } from 'vux'
import userDeal from '../deal/userDeal'
var hyburl=  require('commonUrl')
export default {
  directives: {
    TransferDom
  },
  mounted(){
    let self=this;
    self.setTitle('拍卖报名');
    self.init();
  },
  data () {
    return {
      auctionId:this.$route.query.goodId,
      tableId:this.$route.query.tableId,
      addressId:this.$route.query.addressId,
      orderId:0,
      address:{
        id:'',
        village:'',
        contact:'',
        phone:''
      },
      ensureData:{},
      show2:false,
      showchoose:true,
    }
  },
  methods:{
    init(){
      let self=this;
      self.$http.get('/sh/ja/v1/auction/ensure/'+self.auctionId)
          .then(function(res) {
            if(res.data.statusCode==0){
              self.ensureData=res.data.data;
              if(self.addressId){
                self.getAdress()
              }else{
                self.address=res.data.data.address
              }
              

            } else {
              _g.toastMsg('error', res.data.msg)
              
            }
          })
    },
    getAdress:function(){
      let self=this;
      self.$http.get('/sh/ja/v1/setting/address/get/'+self.addressId)
          .then(function(res) {
            if(res.data.statusCode==0){
              self.address.id=res.data.data.id
              self.address.village=res.data.data.village
              self.address.contact=res.data.data.contact
              self.address.phone=res.data.data.phone
            }
          })
    },
    showDealFn(){
      let self=this;
      self.show2=true
      self.showchoose=false
    },
    payEnsureMoney(){
      let self=this;
      if (self.showchoose==true) {
        _g.toastMsg('error', '您没有同意保证金协议')
        return;
      };
      self.$http.post('/sh/ja/v1/auction/ensure/'+self.auctionId,{addressId:self.address.id,auctionId:self.auctionId})
        .then(function(res) {
          if(res.data.statusCode==0){
            self.orderId=res.data.data.orderId
            self.$router.push({path:'/unused/paysuccess',query:{orderId:self.orderId,goodId:self.auctionId,tableId:'2',price:self.ensureData.ensurePrice,type:'payensure'}})
            //self.paymoney();
          } else {
            _g.toastMsg('error', res.data.msg)
          }
        })
    },
    dealShowFn:function(data){
      let self=this;
      if(data==false){
        self.show2=false
      }
    }
  },
   components: {
    Group,XInput,userDeal,Popup,TransferDom
  },
}

</script>

<style scoped lang='less'>
    .payensureMain{
      margin: 20/40rem;
    }
    .ensureBox{
      background-color: #fff;
      border-radius: 40/40rem;
      padding: 30/40rem;
    }
    .ensureText{
      font-size: 18px;
      color: #222;
    }
    .ensureMoney{
      margin: 20/40rem 0 40/40rem;
      font-size: 30px;
    }
    .ensureAddress{
      font-size: 32/40rem;
    }
    .ensureaddrp{
      display: flex;
    }
    .ensureaddrp span:last-child{
      flex:6;
    }
    .ensureaddrp span:first-child{
      display: inline-block;
      color: #999;
      flex:3;
    }
    .ensureaddrp{
      margin: 20/40rem 0;
    }
    .err {
          color: #999;
    }
    .ensureTipsAddr,.ensureTipsDeal{
      color: #999;
      font-size: 28/40rem;
    }
    .ensureTipsAddr{
      margin: 50/40rem 0 20/40rem;
    }
    .ensureTipsDeal{
      margin: 30/40rem 0 0;
    }
    .ensureTipsDeal .dealicon{
      /*background:url('../../assets/img/mian/icon@2x.png');*/
      background:url('../../assets/img/mian/ic_like_unselect.png');
      background-size: 100%;
      display: inline-block;
      width: 40/40rem;
      height: 40/40rem;
      vertical-align: middle;
      margin-left: 10/40rem;
    }
    .ensureTipsDeal .dealIconChoosed{
      background:url('../../assets/img/mian/icon@2x.png');
      background-size: 100%;
    }
    .ensureBtn{
      height: 80/40rem;
      line-height: 80/40rem;
      font-size: 16px;
      margin-top: 60/40rem;
    }
</style>

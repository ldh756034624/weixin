<template>
	<div class="page orderDetailPage">
      <main>
          <section class='sectionBox'>
              <div v-show='!isNoTop' class="orderDetailTopMsg">
                  <p class="redFont">{{toptext}}</p>
              </div>
              <div v-show='isNoTop'>
                  <div class="porgressBox">
                      <p class="porgressBoxp">
                        <span class='pogressbar'></span>
                        <span class='pogresspoint' style='left:8%'>1</span>
                        <span class='pogresspoint' style='left:33%'>2</span>
                        <span class='pogresspoint' style='left:58%'>3</span>
                        <span class='pogresspoint' style='left:83%'>4</span>

                      </p>
                      <p class="porgressBoxp blueProgressBox">
                          <span class='pogressBluebar' :style={width:barwidth}></span>
                          <span class='pogresspoint' style='left:8%'  v-show="show1">1</span>
                          <span class='pogresspoint' style='left:33%' v-show="show2">2</span>
                          <span class='pogresspoint' style='left:58%' v-show="show3">3</span>
                          <span class='pogresspoint' style='left:83%' v-show="show4">4</span>
                      </p>

                  </div>
                  <p class="progressText">
                    <span :class="[show1==true ? 'blueFont':'']" >
                      <span v-if='orderDetailData.goodsType==1'>已拍下</span>
                      <span v-if='orderDetailData.goodsType==2'>已中标</span>
                    </span>
                    <span :class="[show2==true ? 'blueFont':'']">已付款</span>
                    <span :class="[show3==true ? 'blueFont':'']">已发货</span>
                    <span :class="[show4==true ? 'blueFont':'']">已收货</span>
                  </p>
                  <div >
                      <div v-if='hasFinishTime==true'>
                        <p class="alignC">{{toptext}}</p>
                        <p class="alignC">
                          <span class='redFont'> {{finishTime}}</span>
                          {{secondText}}</p>
                      </div> 
                      <div v-if='hasFinishTime==false'>
                        <p class="alignC">{{toptext}}</p>
                      </div>  
                      <router-link  :to="{ path: '/back/detaile', query: { orderId: orderId,refundType:orderDetailData.refundType}}">  
                      <p v-if="showTime==false && orderDetailData.refundType!=-100" class="watchBack blueFont">查看退款详情>></p>  
                      </router-link>
                  </div>
              </div>
          </section>
          <section class='sectionBox'>
              <goodBox class='GoodsBox'  :ImgSrc='firstImg' :title='orderDetailData.goodTitle' :price='orderDetailData.amount' :hasDesc='hasDesc'> </goodBox>
              <p class="buyMoneyBox line">运费<span class='redFont right'><i>￥</i>{{orderDetailData.expressFee}}</span></p>
              <p class="buyMoneyBox">总计<span class='redFont right'><i>￥</i>{{orderDetailData.payAmount}}</span></p>
          </section>
          <section class='sectionBox orderAddrMsg'>
              <p class="solder vux-1px-b">
              <span v-if="orderDetailData.belong=='0'" style='color:#222'>卖家:</span> 
              <span v-if="orderDetailData.belong=='1'" style='color:#222'>买家:</span> 
              <span  v-if="orderDetailData.belong=='0'" class='nick ellipsis'>{{orderDetailData.nick}}</span>
              <span  v-if="orderDetailData.belong=='1'" class='nick ellipsis'>{{orderDetailData.buyerNick}}</span>
              <span class='right downApp'>
                <downloadApp :text="text"></downloadApp>
              </span>
              </p>
              <div class="orderAddrMsgCont">
                  <p class="gray9Font">物流信息</p>
                  <p>收货人<span class=' gray9Font'>{{orderDetailData.buyerNick}} {{orderDetailData.buyerUserName}}</span></p>
                  <p>收货地址<span class='gray9Font'>{{orderDetailData.city}} {{orderDetailData.room}}</span></p>
                  <p>交易方式<span class='gray9Font'>线上交易</span></p>
                  <p class="gray9Font">订单信息</p>
                  <p>订单号<span class='gray9Font'>{{orderDetailData. id}}</span></p>
                  <p>下单时间<span class='gray9Font'>{{orderDetailData.createTime}}</span></p>
              </div>
          </section>
      </main>
      <footer class='footPad'>
       <!-- 待付款 -->
        <div class="orderBtnBox" v-if="orderDetailData.status==1 || orderDetailData.status==0">
        <button class="orderBtn WhiteBtn" @click="payFn()" v-if="orderDetailData.belong=='0'">立即支付</button>
          <button class="orderBtn WhiteBtn" @click="goPath('changePrice')" v-if="orderDetailData.belong=='1'">修改价格</button>
          <button class="orderBtn BlueBtn" @click='confirmShowFn(1)'>取消订单</button>
        </div>
        <div class="orderBtnBox" v-if="orderDetailData.status==36 && orderDetailData.belong=='1'">
          <button class="orderBtn WhiteBtn" @click="confirmShowFn(7)">同意取消订单</button>
          <button class="orderBtn BlueBtn" @click='confirmShowFn(8)'>拒绝取消订单</button>
        </div>
        <div class="orderBtnBox" v-if="orderDetailData.status==33 && orderDetailData.belong=='0'">
          <button class="orderBtn WhiteBtn" @click="payFn()">我要付款</button>
          <button class="orderBtn BlueBtn" @click='confirmShowFn(9)'>强制取消</button>
        </div>
        <div class="orderBtnBox" v-if="orderDetailData.status==37 && orderDetailData.belong=='0'">
          <button class="orderBtn WhiteBtn" @click="confirmShowFn(3)">删除订单</button>
        </div>
        <!-- 待发货(卖家) -->
        <div class="orderBtnBox" v-if="orderDetailData.status==3 && orderDetailData.userType==1">
          <button class="orderBtn BlueBtn" @click="goPath('express')">去发货</button>
        </div>
        <!-- 待发货(买家) -->
        <div class="orderBtnBox" v-if="orderDetailData.status==3 && orderDetailData.userType!=1">
          <button class="orderBtn WhiteBtn" @click="applyBack()">申请退款</button>
          <button class="orderBtn BlueBtn" @click='remmerber()'>提醒发货</button>
        </div>
        <!-- 待收货 -->
        <div class="orderBtnBox" v-if="orderDetailData.status==10">
          <button class="orderBtn WhiteBtn" @click="goexpressMsg()" v-if="orderDetailData.needExpress==1">查看物流</button>
          <button class="orderBtn WhiteBtn" @click="goPath('arbitration')" v-if="orderDetailData.needExpress==0 && orderDetailData.userType==2">仲裁举证</button>
          <button class="orderBtn BlueBtn" @click='remenberGetGoods()' v-if='orderDetailData.userType==1'>提醒收货</button>
          <button class="orderBtn BlueBtn" @click='confirmShowFn(11)' v-if='orderDetailData.userType!=1'>确认收货</button>
        </div>
        <!-- 已收货 -->
         <div class="orderBtnBox" v-if="orderDetailData.status==24 || orderDetailData.status==39 || orderDetailData.status==35">
          <button class="orderBtn BlueBtn" @click="goshowMoney()">查看钱款</button>
        </div>
      </footer>
      <confirm v-model="confirmShow" class='listConfirm'  :title="confirmText"  @on-confirm="onConfirmFn"></confirm>
      <alert v-model="showArbitratAlert" title="提示">如果7天内没有收到货物,您可以申请仲裁,请耐心等待</alert>
  </div>
</template>
<script>
import {Group,XButton, Confirm,Alert} from 'vux'
import uploadHeadImg from '@/components/uploadHeadImg'
import downloadApp from '@/components/downloadApp'
import goodBox from '@/components/goodBox'
// var url = require('aUrl')
var hyburl=  require('commonUrl')
export default {
  mounted(){
    let self=this
    self.setTitle('订单详情')
    self.init();
  },
  data () {
    return {
      show:false,
      show1:false,
      show2:false,
      show3:false,
      show4:false,
      isNoTop:true,
       orderId:this.$route.query.orderId,
       type:this.$route.query.type,//0我买到的,1我卖出的
       tableType:this.$route.query.tableType,//1闲置,2拍卖
       orderDetailData:{},
       firstImg:'',
       style:{},
       barwidth:'8%',
       Confirmshow2:false,
       confirmShow:false,
       confirmText:'',
       operateType:1,
       orderHanldeResult:1,
       showTime:true,
       finishTime:'',
       hasFinishTime:false,
       toptext:'',
       secondText:'',
       text:'下载APP联系买家',
       showArbitratAlert:false,
       hasDesc:false,
    }
  },
  methods:{
    init(){
      let self=this;

      self.$http.get('/sh/ja/v1/myOrder/detail/'+self.orderId)
        .then(function(res) {
          if(res.data.statusCode==0){
            self.orderDetailData=res.data.data;
            self.firstImg=self.orderDetailData.goodImg[0];
            var orderDetailStatus;
            if(self.type=='0'){
              self.text='下载APP联系卖家'
            }
              if(self.orderDetailData.fromStatus!=-100){
                  orderDetailStatus=self.orderDetailData.fromStatus
              }else{
                 orderDetailStatus=self.orderDetailData.status
              }
             if(orderDetailStatus==1 || orderDetailStatus==0 ){//已拍下,待付款
                  self.show1=true;
                  self.barwidth='33%' 
              }else if(orderDetailStatus==3){//已付款.待发货
                  self.show1=true
                  self.show2=true
                  self.barwidth='58%'
              }else if(orderDetailStatus==10){//已发货,待收货
                  self.show1=true
                  self.show2=true
                  self.show3=true
                  self.barwidth='83%' 
              }else if(orderDetailStatus==24 || orderDetailStatus==25){//已完成
                  self.show1=true
                  self.show2=true
                  self.show3=true
                  self.show4=true
                  self.barwidth='100%'
                  
              }else{//已关闭
                  self.isNoTop=false;
              }
              
              if((self.orderDetailData.orderInfoStatus).indexOf("{")==-1){
                self.toptext=self.orderDetailData.orderInfoStatus;
                self.hasFinishTime=false;
              }else{
                self.hasFinishTime=true;
                self.toptext=self.orderDetailData.orderInfoStatus.split('{')[0];
                self.finishTime=self.orderDetailData.orderInfoStatus.split('{')[1].split('}')[0];
                self.secondText=self.orderDetailData.orderInfoStatus.split('}')[1]
              }
            if(self.orderDetailData.fromStatus!=-100){ //存在退款相关的时候,显示文案重新赋值
                self.isNoTop=true;
                self.toptext=self.orderDetailData.orderInfoStatus
                self.secondText=''
                self.showTime=false;
            }
          }
        })
    },
    getConact(xgfPhone){
        window.location.href = 'tel://' + xgfPhone;
    },

    goPath:function(pathType){
        let self=this;
        if(pathType=='express'){
          self.$router.push({path:'/operate/express',query:{orderId:self.orderId}})
        }
        if(pathType=='changePrice'){
          self.$router.push({path:'/account/changePrice',query:{orderId: self.orderId,express: self.orderDetailData.expressFee, price: self.orderDetailData.amount}})
        }
        if(pathType=='arbitration'){
          if(self.orderDetailData.withoutExpressArbitration==true){
            self.$router.push({path:'/back/arbitration',query:{orderId:self.orderId}})
          }else{
            self.showArbitratAlert=true
          }
        }
    },
    confirmShowFn:function(operatetype){
      let self=this;
      self.operateType=operatetype
      if(self.operateType=='1'){
        self.confirmText='确定取消订单？'
      }else if(self.operateType=='3'){
        self.orderHanldeResult=1
        self.confirmText='确定删除订单？'
      }else if(self.operateType=='7'){
        self.orderHanldeResult=1
        self.confirmText='确定同意取消订单？'
      }else if(self.operateType=='8'){
        self.orderHanldeResult=0
        self.confirmText='确定拒绝取消订单？'
      }else if(self.operateType=='9'){
        self.confirmText='确定强制取消订单？'
      }else if(self.operateType=='11'){
        self.confirmText='收到货物后在确认收货,否则您可能货财两空!'
      }
      self.confirmShow=true
    },
    onConfirmFn:function(){
      let self=this;
      var confirmUrl=''
      if(self.operateType=='7' || self.operateType=='8'){
        self.$http.post('/sh/ja/v1/auction/cancelOrder/result/'+self.orderId+'/'+self.orderHanldeResult) //处理买家订单申请
        .then(function(res) {
          if(res.data.statusCode==0){
             _g.toastMsg('error', res.data.msg)
          }
        })
      }else if(self.operateType=='3'){
        self.$http.delete('/sh/ja/v1/myOrder/idleGoods/'+self.orderId) //删除订单
        .then(function(res) {
          if(res.data.statusCode==0){
            self.init();
          }
          _g.toastMsg('error', res.data.msg)
        })
      }else{
        
        if(self.operateType=='1'){
          if(self.orderDetailData.belong=='0'){
            confirmUrl='/sh/ja/v1/myOrder/idleGoods/' //买家取消订单
          }else{
            confirmUrl='/sh/ja/v1/auctionOrder/sallerCancelOrder/' //卖家取消订单
          }
        }else if(self.operateType=='9'){
          confirmUrl='/sh/ja/v1/auction/buyer/cancelOrder/force/' //买家强制取消订单
        }else if(self.operateType=='11'){
          confirmUrl='/sh/ja/v1/myOrder/idleGoods/receipt/' //确认收货
        }
        self.$http.post(confirmUrl+self.orderId)
        .then(function(res) {
          if(res.data.statusCode==0){
            self.init();
          }
          _g.toastMsg('error', res.data.msg)
        })
      }
    },
     payFn(){
      let self=this;
      /*let curl = hyburl+'/ja/paygateway/v1/pay/request/appidzzerhuo0vyokl/order/'+self.orderId+'/'+self.orderDetailData.payAmount+'/'+JSON.parse(localStorage.getItem('_user')).token;
      location.href = curl;*/
       self.$router.push({path:'/unused/paysuccess',query:{orderId:self.orderId,price:self.orderDetailData.payAmount,type:'payorder'}})
    },
    remenberGetGoods:function(){
      let self=this;
        self.$http.get('/sh/ja/v1/order/notify/buyerAccept/'+self.orderId)
        .then(function(res) {
          if(res.data.statusCode==0){
             _g.toastMsg('error', '提醒收货成功!')
          }
        })
    },
    remmerber(){
      let self=this;
      self.$http.post('/sh/ja/v1/myOrder/idleGoods/remindGoods/'+self.orderId)
      .then(function(res) {
        self.init();
        _g.toastMsg('error', res.data.msg)
      })
    },
    applyBack:function(){ //申请退款
      let self=this;
      self.$router.push({path:'/back/apply',query:{orderId:self.orderId}})
    },
    goexpressMsg(){
      let self=this;
      this.$router.push({path:'/operate/expressMsg',query:{orderId:self.orderId,expressName:self.orderDetailData.expressName,trackingNumber:self.orderDetailData.trackingNumber}})
    },
    goshowMoney:function(){
      let self=this;
      self.$router.push({path:'/back/showMoney',query:{orderId:self.orderId}})
    }
  },
   components: {
    Group,
    XButton,
    Confirm,
    downloadApp,
    Alert,goodBox
  },
}

</script>

<style scoped lang='less'>
    .orderDetailPage{
      overflow: scroll;
    }
    .GoodsBox{
      padding: 0!important;
    }
    .orderDetailTopMsg{
      text-align: center;
      padding: 0 30/40rem;
    }
    .watchBack{
      text-align: right;
      font-size: 24/40rem;
    }
    .downApp{
      display: inline-block;
      width: 266/40rem;
      height: 54/40rem;
      color: #5567A3;
      border:1px solid #5567A3;
      border-radius: 99/40rem;
    }
    .sectionBox{
      background-color: #fff;
      border-radius: 15/40rem;
      margin: 20/40rem 20/40rem 0;
      font-size: 30/40rem;
      padding: 30/40rem;
    }
    .porgressBox{
      margin: 0 10/40rem;
      height: 50/40rem;
      position: relative;
    }
    .porgressBox span{
      display: inline-block;
    }
    .porgressBoxp{
      position: absolute;
      width: 100%;
    }
    .pogressbar{
      background-color: #ECECEC;
      width: 100%;
    }
    .pogressBluebar{
      background-color: #5568A2;
    }
    .pogressbar,.pogressBluebar{
      border-radius: 10/40rem;
      height: 10/40rem;
    }
    .pogresspoint{
      width: 50/40rem;
      height: 50/40rem;
      line-height: 50/40rem;
      text-align: center;
      color: #fff;
      position: absolute;
      top: 5/40rem;
    }
    .pogresspoint{
      background:url('../../assets/img/mian/orderStatusgray.png');
      background-size: 100%;
    }
    .blueProgressBox  .pogresspoint{
      background:url('../../assets/img/mian/orderStatusblue.png');
      background-size: 100%;
    }
    .progressText{
      display: flex;
      padding: 20/40rem 15/40rem;
    }
    .progressText span{
      flex:1;
      text-align: center;
    }
     .buyMoneyBox{
        padding: 30/40rem;
     }
     .buyMoneyBox i{
        font-size: 24/40rem;
        font-style: normal;
     }
     .orderAddrMsg p{
      margin-top:20/40rem;
     }
     .orderAddrMsgCont p{
         display: flex;
     }
     .orderAddrMsgCont p span{
      flex:1;
      text-align: right;
     }
     .phone{
        display: inline-block;
        width: 39/40rem;
        height: 38/40rem;
        background:url('../../assets/img/mian/phone.png') no-repeat center;
        background-size: 100%;
     }
     .orderAddrMsg .solder{
      padding-bottom: 30/40rem;
      margin-top: 10/40rem;
      display: flex;
     }
     .nick{
      display: inline-block;
      flex:1;
      display:block;
      white-space:nowrap; 
      overflow:hidden; 
      text-overflow:ellipsis;
     }
     .solder span{
      color: #999;
     }
     .orderBtnBox{
      display: flex;
      padding: 0 15/40rem;
      margin:  60/40rem 0 0 0;
     }
     .orderBtn{
      flex:1;
      height: 90/45rem;
      border:none;
      border-radius: 15/40rem;
      margin: 0 15/40rem;

      font-size: 16px;
     }
     .orderBtnBox .orderBtn:first-child{
      border:1px solid #f0f0f0;
     }
     .footPad{
        padding-bottom: 60/40rem;
     }
</style>
<style type="text/css">
  .downApp div{
    color: #5567A3;
    text-align: center;
    font-size: 28/40rem;
  }
</style>
<template>
	<div class="page orderDetailPage">
      <main>
          <section class='sectionBox'>
              <div class="porgressBox">
                  <p class="porgressBoxp">
                    <span class='pogressbar'></span>
                    <span class='pogresspoint' style='left:15%'>1</span>
                    <span class='pogresspoint' style='left:45%'>2</span>
                    <span class='pogresspoint' style='left:80%'>3</span>

                  </p>
                  <p class="porgressBoxp blueProgressBox">
                      <span class='pogressBluebar' :style={width:barwidth}></span>
                      <span class='pogresspoint' style='left:15%'  v-show="show1">1</span>
                      <span class='pogresspoint' style='left:45%' v-show="show2">2</span>
                      <span class='pogresspoint' style='left:80%' v-show="show3">3</span>
                  </p>

              </div>
              <p class="progressText">
                <span :class="[show1==true ? 'blueFont':'']">{{prossText1}}</span>
                <span :class="[show2==true ? 'blueFont':'']">{{prossText2}}</span>
                <span :class="[show3==true ? 'blueFont':'']">{{prossText3}}</span>
              </p>
              <div>
                  <p class="alignC">{{backDetailData.tip0}}</p>
                  <p class="alignC">
                    <span class='redFont'> {{backDetailData.countdown}}</span>
                    {{backDetailData.tip2}}</p>
              </div>
          </section>
          <section class='backMsgBox '>
              <div class="backMsgGoodBox">
                  <p class="solder vux-1px-b">
                  <span  style='color:#999'>退款信息</span> 
                  <span class='cancelApply downApp' v-if="backDetailData.userType=='2'">
                    <i v-if="backDetailData.refundStatus=='4' || backDetailData.refundStatus=='11'" @click="confirmShowFn(4)">撤销申请</i>
                    <i v-if="backDetailData.refundStatus=='5' || backDetailData.refundStatus=='15' || backDetailData.refundStatus=='22' || backDetailData.refundStatus=='23'"  @click="goPath('showMoney')">查看钱款去向</i>
                    <i v-if="backDetailData.refundStatus=='12'" @click="goPath('express')">填写退货物流</i>
                    <i v-if="backDetailData.refundStatus=='14'" @click="goPath('expressMsg')">查看物流</i>
                    <i v-if="backDetailData.refundStatus=='16'" @click="goPath('arbitration')">仲裁举证</i>
                    <i v-if="backDetailData.refundStatus=='21'" @click="goPath('arbitratDetaile')">查看仲裁详情</i>
                  </span>
                  <span class='cancelApply downApp' v-if="backDetailData.userType=='1'">
                    <i v-if="backDetailData.refundStatus=='5'  || backDetailData.refundStatus=='15' || backDetailData.refundStatus=='22' || backDetailData.refundStatus=='23'" @click="goPath('showMoney')">查看钱款去向</i>
                    <i v-if="backDetailData.refundStatus=='12'" @click="goPath('expressMsg')">查看物流</i>
                    <i v-if="backDetailData.refundStatus=='14'" @click="goPath('arbitration')">仲裁举证</i>
                    <i v-if="backDetailData.refundStatus=='21'" @click="goPath('arbitratDetaile')">查看仲裁详情</i>
                  </span>
                  </p>
                  <goodBox class='backGoodsBox'  :ImgSrc='backDetailData.img' :title='backDetailData.title' :price='backDetailData.money' :hasDesc='hasDesc'> </goodBox>
              </div>
              <div class="backMsgCont">
                  <p><span class='backMsgName gray9Font'>退款类型</span><span>{{backDetailData.refundTypeDesc}}</span></p>
                  <p><span class='backMsgName gray9Font'>退款原因</span><span>{{backDetailData.refundReason}}</span></p>
                  <p><span class='backMsgName gray9Font'>退款金额</span><span>{{backDetailData.refundMoney}}</span></p>
                  <p><span class='backMsgName gray9Font'>退款说明</span><span>{{backDetailData.refundDesc}}</span></p>
                  <div class="backUploadBox">
                    <span class='backMsgName gray9Font'>退款凭证</span><span v-if='imagesLen==0' class='backNoImg'>无</span>
                     <div class='backMsgUpload'> 
                      <span v-for='item in backDetailData.credentialsImg' v-if='imagesLen>0' @click='showImg=true'><img :src='item'></span>
                      
                     </div>
                  </div>
              </div>
          </section>
      </main>
      <swiper  :show-dots=false v-show='showImg' @on-index-change="changeBigSwiper" height="100%" class='bigImg'>
          <p class="closebigImg"><span class='closebigImgIcon' @click='showImg=false'></span></p>
          <swiper-item class="swiper-demo-img" v-for="(item, index) in backDetailData.credentialsImg" :key="index">
            <div class="cellBox"><img :src="item" ></div>
          </swiper-item>
          <div class="swiper-bar">
            <p class="current"><span class='numBggray'>{{currentBigIndex}}/{{imagesLen}}</span></p>
          </div>
      </swiper>
       <footer class='footPad'  v-if="backDetailData.userType=='1'">
       <!-- 待付款 -->
        <div class="orderBtnBox" v-if="backDetailData.refundStatus==4">
          <button class="orderBtn WhiteBtn" @click="confirmShowFn(5)">同意申请</button>
          <button class="orderBtn BlueBtn" @click="goPath('express')">去发货</button>
        </div>
        <div class="orderBtnBox" v-if="backDetailData.refundStatus==11 || backDetailData.refundStatus==43">
          <button class="orderBtn WhiteBtn" @click="confirmShowFn(5)">同意申请</button>
          <button class="orderBtn BlueBtn" @click='confirmShowFn(6)'>拒绝申请</button>
        </div>
        <div class="orderBtnBox" v-if="backDetailData.refundStatus==14">
          <button class="orderBtn WhiteBtn" @click="goPath('expressMsg')">查看物流</button>
          <button class="orderBtn BlueBtn" @click='confirmShowFn(11)'>确认收货</button>
        </div>
        <div class="orderBtnBox" v-if="backDetailData.refundStatus==17">
          <button class="orderBtn WhiteBtn" @click="goPath('arbitration')">仲裁举证</button>
        </div>
      </footer>
      <confirm v-model="confirmShow" class='listConfirm'  :title="confirmText"  @on-confirm="onConfirmFn"></confirm>
  </div>
</template>
<script>
import {Group,XButton, Confirm,Swiper, SwiperItem} from 'vux'
import ImgUpload from '@/components/ImgUpload'
import goodBox from '@/components/goodBox'
// var url = require('aUrl')
var hyburl=  require('commonUrl')
export default {
  mounted(){
    let self=this;
    this.setTitle('退款详情')
    self.init();
  },
  data () {
    return {
      show1:false,
      show2:false,
      show3:false,
       orderId:this.$route.query.orderId,
       type:this.$route.query.type,//0我买到的,1我卖出的
       tableType:this.$route.query.tableType,//1闲置,2拍卖
       refundType:this.$route.query.refundType,//0仅退款,1退货退款
       backDetailData:{},
       imagesList:[],
       images:[],
       firstImg:'',
       style:{},
       barwidth:'15%',
       Confirmshow2:false,
       toptext:'',
       secondText:'',
       text:'下载APP联系买家',
       uploadurl:'/sh/ja/v1/file/goods/upload',
       prossText1:'',
       prossText2:'',
       prossText3:'',
       confirmShow:false,
       confirmText:'',
       operateType:'',
       hanldeResult:'',
       showImg:false,
       currentBigIndex:1,
       imagesLen:0,
       hasDesc:false,
       showArbitratAlert:false,
    }
  },
  methods:{
    init(){
      let self=this;

      self.$http.get('sh/ja/v1/refund/detail/'+self.orderId+'/'+self.refundType)
        .then(function(res) {
          if(res.data.statusCode==0){
              self.backDetailData=res.data.data
              self.imagesList=self.backDetailData.credentialsImg
              if (self.backDetailData.credentialsImg) {
                self.imagesLen=self.backDetailData.credentialsImg.length
              }

              self.prossText1=self.backDetailData.processList[0]
              self.prossText2=self.backDetailData.processList[1]
              self.prossText3=self.backDetailData.processList[2]
              if(!res.data.data.refundDesc){
                self.backDetailData.refundDesc='无'
              }
              if(self.backDetailData.currentProcess=='0'){
                self.show1=true;
                self.barwidth='45%'
              }else if(self.backDetailData.currentProcess=='1'){
                  self.show1=true
                  self.show2=true
                  self.barwidth='80%'
              }else{
                  self.show1=true
                  self.show2=true
                  self.show3=true
                  self.barwidth='100%'
              }
          }
      })
    },
    changeBigSwiper(index){
      let self=this;
      self.currentBigIndex=(index+1);
    },
    goPath:function(pathType){
      let self=this;
      if(pathType=='showMoney'){
        self.$router.push({path:'/back/showMoney',query:{orderId:self.orderId}})
      }
      if(pathType=='express'){
        if(self.backDetailData.userType=='2'){
          self.$router.push({path:'/operate/express',query:{orderId:self.orderId,type:this.tableId,fromPage:'backdetail',isBuyer:true}})
        }else{
          self.$router.push({path:'/operate/express',query:{orderId:self.orderId,type:this.tableId,fromPage:'backdetail'}})
        }
        
      }
      if(pathType=='expressMsg'){
        self.$router.push({path:'/operate/expressMsg',query:{orderId:self.orderId,type:this.tableId,expressName:self.expressName,trackingNumber:self.trackingNumber}})
      }
      if(pathType=='arbitration'){
        self.$router.push({path:'/back/arbitration',query:{orderId:self.orderId,type:this.tableId}})
      }
      if(pathType=='arbitratDetaile'){
        self.$router.push({path:'/back/arbitrationDetail',query:{orderId:self.orderId}})
      }  
    },
    confirmShowFn:function(operatetype){
      let self=this;
      self.operateType=operatetype
      if(self.operateType=='5'){
        self.hanldeResult='1'
        console.log(self.backDetailData.refundStatus+'===5====')
        if(self.backDetailData.refundStatus=='43'){
          self.confirmText='确定同意退款？'
        }
        if(self.backDetailData.refundStatus=='11'){
          self.confirmText='确定同意退货退款？'
        }
        
      }else if(self.operateType=='4'){
        self.confirmText='确定撤销申请?'
      }else if(self.operateType=='6'){
        console.log(self.backDetailData.refundStatus+'===6====')
        self.hanldeResult='0'
        if(self.backDetailData.refundStatus=='43'){
          self.confirmText='确定拒绝退款？'
        }
        if(self.backDetailData.refundStatus=='11'){
          self.confirmText='确定拒绝退货退款？'
        }
      }else if(self.operateType=='11'){
        self.confirmText='收到货物后在确认收货,否则您可能货财两空!'
      }
      self.confirmShow=true
    },
    onConfirmFn:function(){
      let self=this;
      var confirmUrl='';
      if(self.operateType=='4' || self.operateType=='11'){
        if (self.operateType=='4') {
          confirmUrl='/sh/ja/v1/buyer/cancle/refundMoeny/' //撤销申请
        }else if(self.operateType=='11'){
          confirmUrl='/sh/ja/v1/seller/acceptGoods/' //确认收货
        }
        
        self.$http.post(confirmUrl+self.orderId)
        .then(function(res) {
          if(res.data.statusCode==0){
              self.init();
          }
           _g.toastMsg('error', res.data.msg)
        })
      }else{
        if(self.backDetailData.refundStatus=='4'){
          self.$http.post('/sh/ja/v1/handle/refundMoney',{hanldeResult:self.hanldeResult,refundId:self.backDetailData.refundId}) //同意退款
          .then(function(res) {
            if(res.data.statusCode==0){
              self.init();
            }else{
               _g.toastMsg('error', res.data.msg)
            }
          })
        }else if(self.backDetailData.refundStatus=='11'){
          self.$http.post('/sh/ja/v1/seller/refund/moneyGoods/'+self.backDetailData.refundId+'/'+self.hanldeResult) //同意退货退款
          .then(function(res) {
            if(res.data.statusCode==0){
              self.init();
            }else{
               _g.toastMsg('error', res.data.msg)
            }
          })
        }
      }
      
    }
  },
   components: {
    Group,
    XButton,
    Confirm,
    ImgUpload,Swiper, SwiperItem,goodBox
  },
}

</script>

<style scoped lang='less'>
    .orderDetailPage{
      overflow: scroll;
    }
    .backGoodsBox{
      padding: 0.5rem 0 0 0!important;
    }
    .backNoImg{
      margin-left: 1rem;
    }
    .bigImg{
      height: 100%;
      background-color: #222;
      position: fixed;
      width: 100%;
      top: 0;
    }
    .cellBox{
      display: table-cell;
      vertical-align: middle;
    }
    .cellBox img{
      width: 100%;
      vertical-align: middle;
    }
    .closebigImg{
      position: absolute;
      z-index: 9;
      width: 100%;
      text-align: right;
      margin-top: 20/40rem;
    }
    .closebigImgIcon{
      background: url('../../assets/img/mian/xx@2x.png') no-repeat center 100%;
      display: inline-block;
      background-size: 100%;
      width: 35/40rem;
      height: 35/40rem;
      margin-right: 20/40rem;
    }
    .backMsgGoodBox .solder{
      padding-top: 30/40rem
    }
    .cancelApply{
      display: inline-block;
      float: right;
      width: 180/40rem;
      height: 54/40rem;
      position: absolute;
      right: 0.4rem;
      text-align: center;
    }
    .cancelApply i{
      display: inline-block;
      width: 100%;
      height: 100%;
      color: #5567A3!important;
      border:1px solid #5567A3;
      border-radius: 99/40rem;
      padding: 0 0.3rem;
    }
    .sectionBox{
      background-color: #fff;
      border-radius: 15/40rem;
      margin: 20/40rem 20/40rem 0;
      font-size: 30/40rem;
      
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
     .backMsgBox{
      background-color: #fff;
      border-radius: 15/40rem;
      margin: 20/40rem;
      font-size: 30/40rem;
      
     }
     .backMsgGoodBox{
        padding:0  30/40rem 30/40rem 30/40rem;
     }
     
     .phone{
        display: inline-block;
        width: 39/40rem;
        height: 38/40rem;
        background:url('../../assets/img/mian/phone.png') no-repeat center;
        background-size: 100%;
     }
     .backMsgBox .solder{
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
     .backMsgCont p{
        border-bottom: 1px solid #e2e2e2;
        margin: 0 30/40rem;
        padding:20/40rem 0;
     }
     .backMsgCont .backUploadBox{
        padding-left: 30/40rem;
     }
     .backMsgCont .backUploadBox .backMsgName{
      display: inline-block;
      padding: 20/40rem 0;
     }
     .backMsgCont p:last-child .backMsgName{
      padding-left: 30/40rem;
     }
     .backMsgCont p .backMsgName{
      display: inline-block;
      width: 160/40rem;
      text-align: left;
     }
     .backMsgCont p .backMsgUpload{
      display: inline-block;
      text-align: left;
      width: 100%;
     }
     .backMsgUpload span{
      box-sizing:border-box;
      display: inline-block;
      width: 25%;
      margin-left: -10/40rem;
      padding: 10/40rem 0 0 10/40rem;
     }
     .backMsgUpload span img{
      width: 100%;
      height: 100%;
     }
</style>
<style type="text/css">
  .downApp div{
    color: #5567A3;
    text-align: center;
    font-size: 28/40rem;
  }
  .bigImg  .vux-swiper-item{
    display:table;
  }
</style>
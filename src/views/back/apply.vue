<template>
	<div class="page orderDetailPage">
      <main>
          <section class='applySectionBox'>
              <div class="buyGoods">
                 <img :src="firstImg" class="goodImg">
                 <div class="buyGoodsDesc">
                    <p class="ellipsis">{{orderDetailData.goodTitle}}</p>
                    <p class="redFont"><i>￥</i><span>{{ orderDetailData.payAmount | price2}}</span></p>
                 </div>
              </div>
              
              <cell title='申请类型' v-show='isOnlyBackMoney' v-model='backTypeText' is-link></cell>
              <cell title='申请类型' v-show='!isOnlyBackMoney' @click.native='backType=true' v-model='backTypeText' is-link></cell>
              <cell title='退款原因' @click.native='backReason=true' v-model='backData.reason' is-link></cell>
          </section>
          <div v-show='isOnlyBackMoney'>
              <section class='applySectionBox'>
                  <p class="onlyBackBox"><span>退款金额</span>{{orderDetailData.payAmount | price2}}</p>
              </section>
          </div>
          <div v-show='!isOnlyBackMoney'>
              <section class='applySectionBox'>
                  <x-input title='退款金额' v-model='backData.amount' type='number'></x-input>
              </section>
              <p class="backMoneyTip">(最多￥{{orderDetailData.payAmount}},含发货邮费￥{{orderDetailData.expressFee}})</p>
          </div>
          <section class='applySectionBox applyDescBox'>
              <!-- <x-input title='退款说明' v-model='backData.desc'></x-input> -->
              <p class="applyDesc">退款说明 <span>(最多200字)</span></p>
              <x-textarea :max="200"  v-model="backData.desc"></x-textarea>
          </section>
          <section class='applySectionBox applyUplodBox'>
              <p>上传凭证 <span>最多四张</span></p>
              <ImgUpload :maxlength="4" :uploadurl="uploadurl" ref="uploadImg"></ImgUpload>
          </section>
          <div class="backApplyBtnBox">
            <x-button class=" BlueBtn" @click.native='sureBack()'>确认</x-button>
          </div>
      </main>
      <div v-transfer-dom>
          <popup v-model="backType" >
            <div class="" v-for='(item,index) in backTypeList'>
                <p @click='backTypeFn(index)' class="backChooseList"> 
                <span>{{item}}</span>
                <span class='backUnChooseIcon' v-if='item!=backTypeText'></span>
                <span class='backChooseIcon' v-if='item==backTypeText'></span>
                </p>
            </div>
            <div @click='backType=false' class="backChooseList alignC">确认</div>
          </popup>
      </div>
      <div v-transfer-dom>
          <popup v-model="backReason" >
            <div class="" v-for='(item,index) in backReasonList'>
                <p @click='backReasonFn(index)' class="backChooseList">
                 <span>{{item}}</span>
                 <span class='backUnChooseIcon' v-if='item!=backData.reason'></span>
                 <span class='backChooseIcon' v-if='item==backData.reason'></span>
                 </p>
            </div>
            <div @click='backReason=false' class="backChooseList alignC">确认</div>
          </popup>
    </div>
  </div>
</template>
<script>
import {Group,XButton,Cell,XInput,XTextarea,Popup,TransferDom} from 'vux'
import ImgUpload from '@/components/ImgUpload'
import downloadApp from '@/components/downloadApp'
// var url = require('aUrl')
var hyburl=  require('commonUrl')
export default {
  directives: {
    TransferDom
  },
  mounted(){
    this.setTitle('申请退款')
    this.init();
  },
  data () {
    return {
       orderDetailData:{},
       firstImg:'',
       isOnlyBackMoney:false,
       text:'下载APP联系买家',
       uploadurl:'/sh/ja/v1/file/goods/upload',
       backTypeText:'请选择',
       backType:false,
       backReason:false,
       backTypeList:['仅退款','退货退款'],
       backReasonList:['不想要了','未按约定时间发货','与卖家协商一致','其他'],
       backData:{
        orderId:this.$route.query.orderId,
        reason:'请选择',
        refundImages:'',
        desc:'',
        amount:0
       }
    }
  },
  methods:{
    init(){
      let self=this;

      self.$http.get('/sh/ja/v1/myOrder/detail/'+self.backData.orderId)
      .then(function(res) {
        if(res.data.statusCode==0){
          self.orderDetailData=res.data.data;
          self.backData.amount=self.orderDetailData.payAmount
          self.firstImg=res.data.data.goodImg[0];
          if(self.orderDetailData.status==3 || self.orderDetailData.status==9) {
            self.isOnlyBackMoney=true;
            self.backTypeText='仅退款'
          }
        }
      })
            
    },
    backTypeFn:function (index) {
      let self=this;
      self.backType=false
      self.backTypeText=self.backTypeList[index]
    },
    backReasonFn:function (index) {
      let self=this;
      self.backReason=false;
      self.backData.reason=self.backReasonList[index]
    },
    sureBack:function(){
      let self=this;
      var backUrl='',refundType=0;
      if(self.backTypeText=='仅退款'){
        backUrl='sh/ja/v1/reqRefundMoney'
        refundType=0;
      }else if(self.backTypeText=='退货退款'){
        backUrl='sh/ja/v1/buyer/RefundMoneyAndGoods'
        refundType=1;
        if(!self.backData.amount){
           _g.toastMsg('error', '请选择退款金额')
           return;
        }
      }else{
        _g.toastMsg('error', '请选择退款类型')
        return;
      }
      self.backData.amount=parseInt(self.backData.amount)
      if(self.backData.reason=='请选择'){
         _g.toastMsg('error', '请选择退款类型')
        return;
      }
      self.backData.refundImages=self.$refs.uploadImg.imagelist
      self.$http.post(backUrl,self.backData)
        .then(function(res) {
          if(res.data.statusCode==0){
             self.$router.push({path:'/back/detaile',query:{orderId:self.backData.orderId,refundType:refundType}})
          }else{
             _g.toastMsg('error', res.data.msg)
          }
        })
    }
  },
   components: {
    Group,XButton,downloadApp,Cell,XInput,XTextarea,ImgUpload,Popup
  },
}

</script>

<style scoped lang='less'>
    .orderDetailPage{
      overflow: scroll;
    }
    .onlyBackBox{
      padding:20/40rem 30/40rem;
      color: #999;
    }
    .onlyBackBox span{
      margin-right: 20/40rem;
      color: #222;
    }
    .downApp{
      display: inline-block;
      width: 266/40rem;
      height: 54/40rem;
      color: #5567A3;
      border:1px solid #5567A3;
      border-radius: 99/40rem;
    }
    .backChooseList{
      padding: 25/40rem 50/40rem;
      background-color: #fff;
      border-bottom: 1px solid #e2e2e2;
    }
    .backUnChooseIcon,.backChooseIcon{
      display: inline-block;
      width: 42/40rem;
      height: 42/40rem;
      float: right;
    }
    .backUnChooseIcon{
      background:url('../../assets/img/back/backUnchoose.png') no-repeat center; 
      background-size: 100%;
    }
    .backChooseIcon{
       background:url('../../assets/img/back/backChoose.png') no-repeat center; 
      background-size: 100%;
    }
    .applySectionBox{
      background-color: #fff;
      border-radius: 15/40rem;
      margin: 30/40rem 30/40rem 0;
      font-size: 30/40rem;
      /*padding: 10/40rem;*/
    }
    .applyDesc{
      padding: 20/40rem 0 20/40rem 30/40rem;
    }
    .applyUplodBox p{
      padding: 20/40rem 0 0 30/40rem;
    }
    .buyGoods{
        padding: 20/40rem 30/40rem;
        display: flex;
     }
     .buyGoods img{
      margin-right: 10/40rem;
      width: 200/40rem;
      height: 200/40rem;
     }
     .buyGoodsDesc{
        display: inline-block;
        vertical-align: top;
        line-height: 80/40rem;
     }
     .buyGoodsDesc p:first-child{
        margin-bottom: 50/40rem;
     }
     .buyMoneyBox{
        padding: 30/40rem;
     }
     .buyMoneyBox i,.buyGoodsDesc i{
        font-size: 24/40rem;
        font-style: normal;
     }
     .backApplyBtnBox{
      padding: 2rem 30/40rem 2rem;
     }
     .backMoneyTip{
      font-size: 24/40rem;
      margin: 10/40rem 60/40rem 0;
     }
</style>
<style type="text/css">
  .downApp div{
    color: #5567A3;
    text-align: center;
    font-size: 28/40rem;
  }
  .applyDescBox textarea{
    font-family:-webkit-body
  }  
</style>
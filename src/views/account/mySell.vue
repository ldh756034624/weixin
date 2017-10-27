<template>
	<div class="page">
      <tab :line-width=2    active-color='#38446a' >
        <tab-item selected @on-item-click="onItemClick">闲置</tab-item>
        <tab-item @on-item-click="onItemClick">拍卖</tab-item>
      </tab>
      <div class="scroll-wrap">
          <scroller lock-x
            :pullup-config="pulldefaultConfig"
            :pulldown-config="pulldefaultConfig"
            use-pullup
            use-pulldown
            height="100%"
            :pullup-status="pullupStatus"
            :pulldown-status="pulldownStatus"
            @on-pullup-loading="loadMore"
            @on-pulldown-loading="refresh"
            ref="detailScroller"
            @input="getCurrentValue">
            <!--content slot-->
            <div class='mysellScroller'>
            <div class="mySelledPage" v-for='item in mysellData'>
                  <div class="selledList">
                      <goodBox class='GoodsBox'  :ImgSrc='item.imageList[0]' :title='item.title' :price='item.price' :statusDesc='item.orderStatusName' :hasDesc='hasDesc' @click.native="goPath(item,'detaile')"> </goodBox>
                      <div class="selledConnec">
                        <!-- 待付款 -->
                        <p class="mySelledBtnBox" v-if='item.orderStatus==1'>
                          <button class="mybuyBtn" @click="goPath(item,'changePrice')">修改价格</button>
                          <button class="mybuyBtn" @click='confirmShowFn(1,item)'>取消订单</button>
                        </p>
                        <p class="mySelledBtnBox" v-if='item.orderStatus==27 || item.orderStatus==2 || item.orderStatus==26  || item.orderStatus==28'>
                          <button class="mybuyBtn" @click='confirmShowFn(3,item)'>删除订单</button>
                        </p>
                        <p class="mySelledBtnBox" v-if='item.orderStatus==36'>
                          <button class="mybuyBtn" @click='confirmShowFn(7,item)'>同意取消订单</button>
                          <button class="mybuyBtn" @click='confirmShowFn(8,item)'>拒绝取消订单</button>
                        </p>
                        <p class="mySelledBtnBox" v-if='item.orderStatus==39 || item.orderStatus==35'>
                          <button class="mybuyBtn" @click="goPath(item,'showMoney')">查看钱款去向</button>
                        </p>
                      <!-- 待发货-->
                      <p class="mySelledBtnBox" v-if='item.orderStatus==3'>
                        <button class="mybuyBtn" @click="goPath(item,'express')">去发货</button>
                        <!-- <button class="mybuyBtn" @click='confirmShowFn(1,item)'>取消订单</button> -->
                      </p>
                      <p class="mySelledBtnBox" v-if='item.orderStatus==4'>
                        <button class="mybuyBtn" @click="goPath(item,'express')">去发货</button>
                        <button class="mybuyBtn" @click='confirmShowFn(5,item)'>同意申请</button>
                      </p>
                      <p class="mySelledBtnBox" v-if='item.orderStatus==43'>
                        <button class="mybuyBtn" @click='confirmShowFn(5,item)'>同意申请</button>
                        <button class="mybuyBtn" @click="confirmShowFn(6,item)">拒绝申请</button>
                      </p>
                      <p class="mySelledBtnBox" v-if='item.orderStatus==5'>
                        <button class="mybuyBtn" @click="goPath(item,'showMoney')">查看钱款去向</button>
                      </p>
                      <!-- 待收货-->
                      <p class="mySelledBtnBox" v-if='item.orderStatus==10'>
                        <button class="mybuyBtn" @click='remenberGetGoods(item)'>提醒收货</button>
                        <button class="mybuyBtn" @click="goPath(item,'expressMsg')" v-if='item.needExpress==1'>查看物流</button>
                      </p>
                      <p class="mySelledBtnBox" v-if='item.orderStatus==11'>
                        <button class="mybuyBtn" @click='confirmShowFn(5,item)'>同意申请</button>
                        <button class="mybuyBtn" @click='confirmShowFn(6,item)'>拒绝申请</button>
                      </p>
                      <p class="mySelledBtnBox" v-if='item.orderStatus==14'>
                        <button class="mybuyBtn" @click="goPath(item,'expressMsg')" v-if='item.needExpress==1'>查看物流</button>
                        <button class="mybuyBtn" @click='showMoreFn(item)'>• • •</button>
                      </p>
                      <p class="mySelledBtnBox" v-if='item.orderStatus==15'>
                        <button class="mybuyBtn" @click="goPath(item,'showMoney')" >查看钱款去向</button>
                      </p>
                      <!-- <p class="mySelledBtnBox" v-if='item.orderStatus==16'>
                        <button class="mybuyBtn" @click="goPath(item,'arbitration')">申请仲裁</button>
                      </p> -->
                      <p class="mySelledBtnBox" v-if='item.orderStatus==23 || item.orderStatus==30 || item.orderStatus==22'>
                        <button class="mybuyBtn" @click="goPath(item,'showMoney')">查看钱款去向</button>
                      </p>
                      <p class="mySelledBtnBox" v-if='item.orderStatus==25 || item.orderStatus==24'>
                        <button class="mybuyBtn" @click="goPath(item,'showMoney')">查看钱款去向</button>
                        <button class="mybuyBtn" @click='confirmShowFn(3,item)'>删除订单</button>
                      </p>
                      <p class="mySelledBtnBox" v-if='item.orderStatus==21'>
                        <button class="mybuyBtn" @click="goPath(item,'arbitratDetaile')">查看仲裁详情</button>
                        <button class="mybuyBtn" @click="goPath(item,'arbitration')">仲裁举证</button>
                      </p>

                      </div>
                  </div>
              </div>
              </div>
            <pull-header-footer :status-up="pullupStatus" :status-down="pulldownStatus"></pull-header-footer>
          </scroller>
        </div>
        <div v-transfer-dom>
            <popup v-model='showmore' class='showmore' height='100%' @click.native='showmore=false' >
                <div class="showmoreBox">
                    <div class="showMorediv">
                       <button class="outBtn" @click='confirmShowFn(11,objTemp)'>确认收货</button>
                       <button class="deleteBtn" @click="goPath(objTemp,'arbitration')">仲裁举证</button>
                    </div>
                    <div class="showMorediv">
                        <button class="cancelBtn" @click='showmore=false'>取消</button>
                    </div>
                </div>
            </popup>
        </div>
       <confirm v-model="confirmShow" class='listConfirm'  :title="confirmText"  @on-confirm="onConfirmFn"></confirm>
        <blankPage  :text='text' v-show='!hasItem' :images='blankImg'> </blankPage>
  </div>
</template>
<script>
import {Tab, TabItem, Scroller, Confirm,Popup,TransferDom} from 'vux'
import PullHeaderFooter from '@/components/pullHeaderFooter'
import blankPage from '@/components/blankPage'
import goodBox from '@/components/goodBox'
export default {
  directives: {
    TransferDom
  },
  mounted(){
    this.setTitle('我卖出的')
    this.init(1,true);
  },
  data () {
    return {
      mysellData:{},
      showmore:false,
      isUnused:true,
      tableId:1,
      orderId:-1,
      confirmShow:false,
      confirmText:'',
      text:'还没有卖出过商品,请好友多多分享啦～',
      nowObj:{},
      objTemp:{},
      showmore:false,
      operateType:'',
      hasItem:true,
      blankImg:require('../../assets/img/blank/sold.png'),
      hanldeResult:'',
      orderHanldeResult:'',
      hasDesc:true,
    }
  },
  methods:{
    onItemClick(index){
      this.tableId=index+1;
      console.log(this.tableId)
      this.page.currPage = 1
      this.mysellData = []
       this.init(1,true)
      if(index==1){
        this.isUnused=false
      }else{
        this.isUnused=true
      }

    },
    init(nowPage,isTableSelect){
      let self=this;
      self.$http.get('/sh/ja/v1/mySold/'+self.tableId+'/list', {params: {page: nowPage, limit:10}})
        .then(function(res) {
          if (nowPage == 1) {
            self.mysellData = []
          }
          if(res.data.statusCode==0){
              self.mysellData = [...self.mysellData, ...res.data.data.data]
              if(self.mysellData.length>0){
                self.hasItem=true;
              }else{
                self.hasItem=false;
              }
              self.page.totalpage = res.data.data.totalpage;
              if(res.data.data.hasNext){
                  self.page.currPage++;
              }
              self.page.hasNext = res.data.data.hasNext;

              if(isTableSelect){
                self.$nextTick(() => {
                  self.$refs.detailScroller.reset({top: 0},500, 'ease');
                })
              }
          } else {
            self.$vux.toast.show({
                text: res.data.msg,
                type: 'text',
            })
          }
          self.$nextTick(()=>{
            self.$refs.detailScroller.donePullup();
            if(!self.page.hasNext){
              self.$refs.detailScroller.disablePullup();
            }
            if (res.data.currPage==1) {
              self.$refs.detailScroller.reset({top: 0},500, 'ease');
            }
          });
        })
    },
    goPath:function(item,pathType){
        let self=this;
        var itemObj={};
        if(!item.orderId  ){
         itemObj=self.nowObj;
        }else{
          itemObj=item;
        }
        if(pathType=='detaile'){
          self.$router.push({path:'/account/orderdetail',query:{orderId:itemObj.orderId,type:1,tableType:self.tableId}})
        }
        if(pathType=='express'){
          self.$router.push({path:'/operate/express',query:{orderId:itemObj.orderId,type:this.tableId}})
        }
        if(pathType=='expressMsg'){
          self.$router.push({path:'/operate/expressMsg',query:{orderId:itemObj.orderId,type:this.tableId,expressName:itemObj.expressName,trackingNumber:itemObj.trackingNumber}})
        }
        if(pathType=='arbitration'){
          self.$router.push({path:'/back/arbitration',query:{orderId:itemObj.orderId,type:this.tableId}})
        }
        if(pathType=='showMoney'){
          self.$router.push({path:'/back/showMoney',query:{orderId:itemObj.orderId,type:this.tableId}})
        }
        if(pathType=='applyBack'){
          self.$router.push({path:'/back/apply',query:{orderId:itemObj.orderId}})
        }
        if(pathType=='arbitratDetaile'){
          self.$router.push({path:'/back/arbitrationDetail',query:{orderId:itemObj.orderId}})
        }
        if(pathType=='changePrice'){
          self.$router.push({path:'/account/changePrice',query:{orderId: itemObj.orderId,express: itemObj.expressFee, price: itemObj.price-itemObj.expressFee}})
        }
    },
    remenberGetGoods:function(item){
      let self=this;
      var itemObj={};
        if(!item){
         itemObj=self.nowObj;
        }else{
          itemObj=item;
        }
        self.$http.get('/sh/ja/v1/order/notify/buyerAccept/'+itemObj.orderId)
        .then(function(res) {
          if(res.data.statusCode==0){
             _g.toastMsg('error', '提醒收货成功!')
          }
        })
    },
    showMoreFn:function(item){
        let self=this;
        self.nowObj=item;
        self.showmore=true
    },
    confirmShowFn:function(operatetype,item){
      let self=this;
      self.operateType=operatetype
      if(item.orderId){
        self.nowObj=item;
      }
      console.log(item)
      console.log(self.nowObj)
      if(self.operateType=='1'){
        self.confirmText='确定取消订单？'
      }else if(self.operateType=='2'){
        self.confirmText='确定关闭订单？'
      }else if(self.operateType=='3'){
        self.confirmText='确定删除订单？'
      }else if(self.operateType=='11'){
        self.confirmText='收到货物后在确认收货,否则您可能货财两空!'
      }else if(self.operateType=='5'){
        self.hanldeResult='1'
        if(item.orderStatus==43){
          self.confirmText='确定同意退款？'
        }
        if(item.orderStatus==11){
          self.confirmText='确定同意退货退款？'
        }
        
      }else if(self.operateType=='6'){
        self.hanldeResult='0'
        if(item.orderStatus==43){
          self.confirmText='确定拒绝退款？'
        }
        if(item.orderStatus==11){
          self.confirmText='确定拒绝退货退款？'
        }
      }else if(self.operateType=='7'){
        self.orderHanldeResult=1
        self.confirmText='确定同意取消订单？'
      }else if(self.operateType=='8'){
        self.orderHanldeResult=0
        self.confirmText='确定拒绝取消订单？'
      }
      self.confirmShow=true
    },
    onConfirmFn:function(){
      let self=this;
      var confirmUrl=''
      if(self.operateType=='3'){

        self.$http.delete('/sh/ja/v1/myOrder/idleGoods/'+self.nowObj.orderId) //删除订单
        .then(function(res) {
          if(res.data.statusCode==0){
            self.init(1,true);
          }else{
            _g.toastMsg('error', res.data.msg)
          }
        })
      }else if(self.operateType=='5' || self.operateType=='6'){
        if(self.nowObj.orderStatus==4 || self.nowObj.orderStatus==43){
          self.$http.post('/sh/ja/v1/handle/refundMoney',{hanldeResult:self.hanldeResult,refundId:self.nowObj.refundId}) //同意退款
          .then(function(res) {
            if(res.data.statusCode==0){
              self.init(1,true);
            }else{
               _g.toastMsg('error', res.data.msg)
            }
          })
        }else if(self.nowObj.orderStatus==11){
          self.$http.post('/sh/ja/v1/seller/refund/moneyGoods/'+self.nowObj.refundId+'/'+self.hanldeResult) //同意退货退款
          .then(function(res) {
            if(res.data.statusCode==0){
              self.init(1,true);
            }else{
               _g.toastMsg('error', res.data.msg)
            }
          })
        }
      }else if(self.operateType=='7' || self.operateType=='8'){
        self.$http.post('/sh/ja/v1/auction/cancelOrder/result/'+self.nowObj.orderId+'/'+self.orderHanldeResult) //处理买家订单申请
        .then(function(res) {
          if(res.data.statusCode==0){
            self.init(1,true);
          }else{
             _g.toastMsg('error', res.data.msg)
          }
        })
      }else{
        
        if(self.operateType=='1'){
         confirmUrl='/sh/ja/v1/auctionOrder/sallerCancelOrder/' //取消拍卖订单
        }else if(self.operateType=='11'){
          confirmUrl='/sh/ja/v1/seller/acceptGoods/' //卖家确认收货
        }
        self.$http.post(confirmUrl+self.nowObj.orderId)
        .then(function(res) {
          if(res.data.statusCode==0){
            self.init(1,true);
          }else{
             _g.toastMsg('error', res.data.msg)
          }
        })
      }
    },
     loadMore () {
      if(this.page.hasNext){
          setTimeout(() => {
            this.init(this.page.currPage,false)
          }, 2000)
      }
    },
    refresh () {
      setTimeout(() => {
        this.init(1,true);
      }, 2000)
    }
  },
   components: {
    Tab, TabItem, Scroller, PullHeaderFooter, Confirm,blankPage,Popup,TransferDom,goodBox
  },
}

</script>

<style scoped lang='less'>
    .mySelledPage{
      margin: 18/40rem 20/40rem 22/40rem;
    }
    .selledList{
      background-color: #fff;
      border-radius: 5px;
    }
    .mySelledBtnBox{
      text-align: right;
      width: 100%;
      padding: 20/40rem 0;
      border-top: 1px solid #e2e2e2;
    }
    .mybuyBtn{
      background-color: #fff;
      border:1px solid #ddd;
      height: 60/40rem;
      padding: 0 20/40rem;
      line-height: 60/40rem;
      border-radius: 30/40rem;
      margin: 0 20/40rem 0 0;
      font-size: 28/40rem;
    }
    .selledConnec span{
        color: #999;
        font-size: 30/40rem;
    }
    .selledConnec img{
      width: 39/40rem;
      height: 38/40rem;
      vertical-align: middle;
      margin-left: 10/40rem;
    }
    .scroll-wrap{
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
    top: 49px;
    overflow: hidden;
  }
  .mysellScroller{
      padding-bottom: 20/40rem;
    }
    .showmore{
      background:rgba(0,0,0,0)!important;
    }
    .showmoreBox{
      padding: 0 120/40rem;
      position: absolute;
      bottom: 0;
      width: 68%;
    }
    .showmoreBox .showMorediv:first-child{
      margin-bottom: 15/40rem;
    }
    .showMorediv{
      background-color: #fff;
      color: #999;

      border:1px solid #999;
       border-radius: 10/40rem;

    }
    .showMorediv button{
      padding: 20/40rem;
      border:none;
      width: 100%;
      background-color: #fff;

    }
    .showMorediv .outBtn{
      border-radius: 10/40rem 10/40rem 0 0;
      border-bottom: 1px solid #ddd
    }
    .showMorediv .deleteBtn{
      border-radius: 0 0 15/40rem 15/40rem ;
    }
    .showMorediv .cancelBtn{
      border-radius: 15/40rem
    }

</style>
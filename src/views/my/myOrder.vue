<template>
	<div class="page">
    <div class="scroll-wrap">
      <scroller lock-x  v-show='hasItem'
              :pullup-config="pulldefaultConfig"
              use-pullup
              height="100%"
              :pullup-status="pullupStatus"
              @on-pullup-loading="loadMore"
              ref="detailScroller"
              use-pulldown
              @on-pulldown-loading="refresh"
              :pulldown-config="pulldefaultConfig"
              :pulldown-status="pulldownStatus"
              @input="getCurrentValue">
              <div>
                <div class="orderBox" v-for="item in myOrderData">
                  <div class="flexBox">
                    <img class="orderIcons" :src="item.companyIcon"/>
                    <p class="flex1">{{item.company}}</p>
                    <span class='redFt'>{{item.status}}</span>
                  </div>
                  <div class="flexBox orderContBox" @click='goOrderDetail(item)'>
                    <img class="orderImg" v-if="item.goodsInfoList.length > 0" :src="item.goodsInfoList[0].imgUrl"/>
                    <div class="flex1">
                      <p class="orderText" v-if="item.goodsInfoList.length > 0">{{item.goodsInfoList[0].goodsName}}</p>
                    </div>
                  </div>
                </div>
              </div>
              <pull-header-footer :status-up="pullupStatus" :status-down="pulldownStatus"></pull-header-footer>
      </scroller>
      <blank-page v-show='!hasItem' :blankType='type'></blank-page>
    </div>
  </div>
</template>
<script>
import blankPage from '@/components/blankPage'
import PullHeaderFooter from '@/components/pullHeaderFooter'
import {Scroller} from 'vux'
export default {
  mounted(){
    this.setTitle('我的订单');
    this.init(1);
  },
  data () {
    return {
      myOrderData:[],
      hasItem:true,
      status: this.$route.query.status,
      type:'order'
    }
  },
  methods:{
    init(page){
      let self = this
      if (page === 1) {
        self.myOrderData = []
      }
      let pageUrl=''
      if(this.$route.query.fromShop){
        pageUrl='h9/store/orders'
      }else{
        pageUrl='/h9/api/orders'
      }
      pageUrl+='?page='+page+'&limit='+self.page.limit
      if (self.status || self.status==0) {
        pageUrl+='&status='+self.status
      }
      self.$http.get(pageUrl)
        .then(function(res) {
          if(res.data.code==0){
              if(res.data.data.data.length>0){
                self.hasItem=true
                self.myOrderData = [...self.myOrderData, ...res.data.data.data]
              }else{
                self.hasItem=false
              }
              self.page.totalpage = res.data.data.totalPage;
              if(res.data.data.hasNext){
                  self.page.currPage++;
              }
              self.page.hasNext = res.data.data.hasNext;
          }
          self.$nextTick(()=>{
            self.$refs.detailScroller.donePullup();
            if(!self.page.hasNext){
              self.$refs.detailScroller.disablePullup();
            }
            if (res.data.data.currPage==1) {
              self.$refs.detailScroller.reset({top: 0},500, 'ease');
            }
          })
        })
    },
    loadMore () {
      let self=this;
      if(self.page.hasNext){
          setTimeout(() => {
            self.init(self.page.currPage)
          }, 2000)
      }
    },
    refresh () {
      let self=this;
      setTimeout(() => {
        self.init(1);
      }, 2000)
    },
    goOrderDetail:function(item){
      this.$router.push({path:'/my/orderDetail',query:{orderId:item.orderId}})
    }

  },
  components: {
    PullHeaderFooter,Scroller,blankPage
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
      align-items: center;
    }
    .orderText{
      font-size: 32/40rem;
      line-height: 1rem;
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
</style>

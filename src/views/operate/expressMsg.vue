<template>
<div class="page expressMsgPage" transition="app">
  <scroller lock-x class='expressScroll' v-show='hasItem'>
    <div class="content track">
      <div class="expressMsgBox">
          <p>物流状态 : <span v-if="trackData.state==2">在途中</span>
          <span v-if="trackData.state==3">签收</span>
          <span v-if="trackData.state==4">问题件</span> </p>
          <p>物流公司 : {{trackData.expressName}}</p>
          <p>物流单号 : {{trackData.trackNumber}}</p>
      </div>
      <p class="expressSource">本数据由{{trackData.source}}提供</p>
      <timeline class='expressTime'>
        <timeline-item v-for="(track,index) in trackData.traceList" :key="index">
          <h4 class="recent">{{track.acceptStation}}</h4>
          <p class="recent">{{track.acceptTime}}</p>
        </timeline-item>
      </timeline>
    </div>
  </scroller>
  <blankPage  :text='text' v-show='!hasItem' :images='blankImg'> </blankPage>
  <!-- loading -->
  <loading :show="loading.show" :text="loading.msg"></loading>
</div>
</template>

<script>
import { XHeader, Timeline, TimelineItem, Loading,Scroller } from 'vux'
import blankPage from '@/components/blankPage'
export default {
  mounted () {
    let self=this;
    this.setTitle("物流详情");
    this.getOrderDetail();
  },
  data() {
    return {
      loading: {
        msg: '加载中...',
        show: true
      },
      hasItem:true,
      text:'暂时没有数据啊~',
      blankImg:require('../../assets/img/blank/noData.png'),
      trackData: []
    };
  },
  methods:{
    getOrderDetail: function(){    //获取订单详情
      let self =  this;
      let rcmurl = "/sh/ja/v1/express/"+this.$route.query.orderId;
      this.$http.get(rcmurl)
      .then(function(res) {
        if(res.data.statusCode==0){
          if(res.data.data){
            self.trackData = res.data.data;
            self.hasItem=true;
          }
        } else if(res.data.statusCode==1) {
            self.hasItem=false;
        }
        this.loading.show = false;
      })
    }
  },
  components: {
    XHeader,
    Timeline,
    TimelineItem,
    Loading,
    Scroller,blankPage
  }
}
</script>
<style scoped lang='less'>
  .expressSource{
    padding-left: 40/40rem;
    color: #999;
    font-size: 30/40rem;
  }
  .expressTime{
    background-color: #fff;
    margin: 20/40rem;
  }
  .expressMsgBox{
    background-color: #fff;
    border-radius: 10/40rem;
    margin: 20/40rem;
    padding: 20/40rem;
    font-size: 30/40rem;
  }
  .expressMsgBox p{
    line-height: 50/40rem;
  }
  .content{
    bottom: 0;
    .empty{
      font-size: 32/40rem;
      color: #999;
      text-align: center;
      margin-top: 400/40rem;
    }
  }
  .expressScroll{
    overflow: scroll!important;
  }
  .page{
    /*background-image: url('../../assets/img/hyb-bg.png');
    background-size: 100% 100%;*/
    background-repeat: no-repeat;
    background-position: center;
  }
  .hyd-logo{
    text-align: center;
    .logo{
      margin-top: 44/40rem;
      margin-bottom: 30/40rem;
      font-size: 0;
      width: 162/40rem;
      height: 162/40rem;
    }
    div{
      line-height: 1;
      color: #262626;
      font-size: 32/40rem;
    }
  }
  .text-wrap{
    padding: 80/40rem 30/40rem;
    font-size: 26/40rem;
    letter-spacing: 4/40rem;
  }
</style>
<style lang='less'>
  .vux-timeline-item-color,.vux-timeline-item-tail{
    background-color: #ff5060 !important;
  }
  .vux-timeline-item-content{
    h4{
      color: #262626;
      font-size: 32/40rem;
      font-weight: normal;
    }
    p{
      font-weight: normal;
      font-size: 32/40rem;
      color: #999;
    }
  }
  .vux-timeline-item-head-first{
    .recent{
      color: #ff5060 !important;
    }
  }
  .vux-timeline ul li:nth-child(1 ) .vux-timeline-item-color{
    background-image: url('../../assets/img/back/expressBlue.png');
    background-size: 100% 100%;
  }
  .vux-timeline-item-color{
    background-image: url('../../assets/img/back/expressWhite.png');
    background-size: 100% 100%;
  }
  .vux-timeline-item-tail{
    background-color: #ddd!important;
  }
</style>
<template>
<div class="page " transition="app">
      <div v-show='hasItem'  class="scroll-wrap">
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
            <div class="msgContent">
                <div v-for='item in sysMsgData'>
                    <!-- <div class="messageBox sysImg">
                        <p class="msgText">你的好这里</p>
                        <img src="../../assets/img/temp/qwp.png">
                        <p class="date">2017-08-12</p>
                    </div>
                    <div class="messageBox">
                        <p class="msgText">由于技术故障，服务器将于02:00-05:00进行维护，由于技术故障，服务器将于02:00-05:00进行维护，由于技术故障，服务器将于02:00-05:00进行维护，</p>
                        <p class="date">2017-08-12</p>
                    </div> -->
                    <router-link :to="{path:item.route4h5}">
                    <div class="messageBox goodmsgBox">
                        <img :src="item.image">
                        <div class="goodmsgTexBox">
                            <p class="msgText">{{item.processMsg}}</p>
                            <p class="date">{{item.dealTime}}</p>
                        </div>
                    </div>
                    </router-link>
                </div>
          </div>
          <pull-header-footer :status-up="pullupStatus" :status-down="pulldownStatus"></pull-header-footer>
        </scroller>
      </div>
      <div class="noItem" v-show='!hasItem'>
        <blankPage  :text='text2' v-show='!hasItem' :images='blankImg2'> </blankPage>
      </div>
      <Bottombar :index="1"></Bottombar>

</div>
</template>

<script>
import { Tab, TabItem, Cell, Group, Scroller} from 'vux';
import blankPage from '@/components/blankPage'
import PullHeaderFooter from '@/components/pullHeaderFooter'
import Bottombar from '@/components/BottomBar'
// var url = require('aUrl');
export default {
  mounted() {
    let self=this;
    self.setTitle("消息");
    self.init(1);
  },
  data() {
    return {
      notalkMsg:true,
      showtalkList:false,
      sysMsgData:{},
      nosysMsg:false,
      hasItem:true,
      text2:'暂时没有通知呢～',
      blankImg2:require('../../assets/img/blank/msg.png'),
    };
  },
  methods:{
    init(nowPage){
      let self = this
       console.log("=======))00)")
      console.log(JSON.parse(localStorage.getItem('_user')))
      if (nowPage == 1) {
        self.sysMsgData = []
      }
      self.$http.get('/sh/ja/v1/systemmsg/all',{params: {page: nowPage, limit:10}})
        .then(function(res) {
            if(res.data.statusCode==0){
            self.sysMsgData = [...self.sysMsgData, ...res.data.data.data]
            if(self.sysMsgData.length>0){
              self.nosysMsg=true
              self.hasItem=true;
            }else{
              self.nosysMsg=false;
              self.hasItem=false;
            }
            self.page.totalpage = res.data.data.totalpage;
            if(res.data.data.hasNext){
                self.page.currPage++;
            }
            self.page.hasNext = res.data.data.hasNext;
          } else {
             _g.toastMsg('error', res.data.msg)
          }
          self.$nextTick(()=>{
            self.$refs.detailScroller.donePullup();
            if(!self.page.hasNext){
              self.$refs.detailScroller.disablePullup();
            }
            if (res.data.data.currPage==1) {
              self.$refs.detailScroller.reset({top: 0},500, 'ease');
            }
          });

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
    }
  },
  components: {
    Tab, 
    TabItem,
    Cell,
    Group,
    blankPage,
    Scroller,
    PullHeaderFooter,
    Bottombar
  }
}
</script>
<style scoped lang='less'>
    .scroll-wrap{
      position: absolute;
      left: 0;
      width: 100%;
      bottom: 0;
      top: 5/40rem;
      overflow: hidden;
    }
    .noItem{
      position: fixed;
      top:0;
      width: 100%;
      height: 100%;
    }
    .msgContent{
      margin: 20/40rem;
      padding-bottom: 150/40rem;
    }
    .messageBox{
      background-color: #fff;
      color: #222;
      border-radius: 15/40rem;
      padding: 30/40rem 20/40rem;
      font-size: 30/40rem;
      margin-bottom: 20/40rem;
      font-size: 0;
    }
    .sysImg img{
      width: 100%;
      height: 242/40rem;
      border-radius: 10/40rem;
    }
    .date{
      color:#999;
      margin-top: 20/40rem;
      text-align: right;
      font-size: 26/40rem;
    }
    .msgText{
      font-size: 30/40rem;
      margin-bottom: 20/40rem;
      text-align: justify;
    }
    .goodmsgBox{
      display: flex;
      img{
        width: 100/40rem;
        height: 100/40rem;
        margin-right: 30/40rem;
      }
    }
    .goodmsgTexBox{
      flex:1;
    }
</style>
<style lang='less'>
  
</style>
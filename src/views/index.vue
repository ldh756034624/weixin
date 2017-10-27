<template>
  <div class="page home" style="height:100%;">
      <div>
      <main class="home_main" v-bind:style="{marginTop: -TopScroll + 'rem' }">
        <div class="header-wrap">
          <div class="searchBox" :class="[topSearch==true ? 'topSearch':'']">
              <router-link to="/search/searchRecord">
                <div class="search">搜索商品</div>
              </router-link>
          </div>
          <swiper loop auto dots-position="center" :list="topBannerList"  @on-index-change="" height="8.5rem"></swiper>
        </div>
        <tab :line-width=3 :custom-bar-width="getBarWidth" active-color='#38446a' class='222' >
          <!-- <tab-item class="vux-center" :selected="homeTab === item.name" v-for="(item,index) in homeTopData.tables" :key="index"  @on-item-click="tabDtaile(item.id,1,true)" >{{item.name}}</tab-item> -->
          <tab-item :selected="tableItem === '闲置'" @on-item-click="tabDtaile(1,1,true)" >闲置</tab-item>
          <tab-item :selected="tableItem === '拍卖'" @on-item-click="tabDtaile(2,1,true)" >拍卖</tab-item>
          <tab-item :selected="tableItem === '捐赠'" @on-item-click="tabDtaile(3,1,true)">捐赠</tab-item>
        </tab>
        <div class="scroll-wrap">

          <scroller lock-x
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
            <!--content slot-->
            <div class="padd15 indexScroller">
              <scroller ref="scrollerx" lock-y>
                <div class="banner_item_wrap" v-bind:style="{width:(extendsData.length)*8.3+'rem'}">
                  <div class="banner_item" v-for="item in extendsData">
                    <router-link :to="{path:item.h5Route}" v-if="item.h5Route.indexOf('http')==-1">
                      <img :src="item.image"/>
                    </router-link>
                    <div @click="goLinkHttp(item)" v-if="item.h5Route.indexOf('http')!=-1">
                      <img :src="item.image"/>
                    </div>
                  </div>
                </div>
              </scroller>
              <UserGoods :gooddata='item' :tableId="tableId" v-for="(item,index) in detailGoodList" @click.native='godetail(item.id)' :key='index'></UserGoods>
            </div>
            <pull-header-footer :status-up="pullupStatus" :status-down="pulldownStatus"></pull-header-footer>
            <div class="indexnoItem" v-show='!hasItem'>
                <blankPage  :text='text2' v-show='!hasItem' :images='blankImg2'> </blankPage>
            </div>
          </scroller>
        </div>
      </main>
      <showPublish></showPublish>
      </div>
      
      <setNick></setNick>
      <Bottombar :index="0" v-show="showPublishBtn"></Bottombar>
      
  </div>
</template>

<script>
import { Group, Cell, Swiper, SwiperItem, Tab, TabItem, Scroller, Spinner,TransferDom} from 'vux'
import showPublish from '@/components/index/showPublish'
import setNick from '@/components/index/setNick'
import UserGoods from '@/components/UserGoods'
import PullHeaderFooter from '@/components/pullHeaderFooter'
import Bottombar from '@/components/BottomBar'
import blankPage from '@/components/blankPage'
import Vue from 'vue'

export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      homeTab: '闲置',
      tableItem:'闲置',
      homeTopData:'',
      topBannerList:[],
      detailData:{
        extendsData: []
      },
      extendsData:[],
      detailGoodList:[],
      detailBanerLen:0,
      tableId:1,
      isShowGoTop: true,
      page: {
        limit: 5,
      },
      gooddata:{},
      callback:Function,
      oldscrolly:0,
      showPublishBtn:true,
      TopScroll:0,
      topSearch:false,
      hasItem:true,
      text2:'暂时没有相关商品呢～',
      blankImg2:require('../assets/img/blank/shop.png'),
      
    }
  },
  mounted () {
    let self=this;
    self.setTitle('猪猪集市');
    self.init();
    if (sessionStorage.getItem('tableId')) {
       self.tableId = Number(sessionStorage.getItem('tableId'))
      if( self.tableId==1){
        self.tableItem='闲置'
      }else if(self.tableId==2){
        self.tableItem='拍卖'
      }else if(self.tableId==3){
        self.tableItem='捐赠'
      }
    }
    
    
    self.tabDtaile(self.tableId,1,false);
  },
   methods: {
     init(){
        let self=this;
        self.$http.get('/sh/ja/v1/home')
        .then(function(res) {
          if(res.data.statusCode==0){
            self.homeTopData=res.data.data;
              for(var i=0;i<self.homeTopData.banners.length;i++){
                self.topBannerList.push({
                url:self.homeTopData.banners[i].h5Route,
                img:self.homeTopData.banners[i].image,
              })
            }
            //self.homeTab=res.data.data.tables[self.tableId-1].name;
          }
        })
     },
     listenScroller(){
      let self=this;
       this.$nextTick(()=>{
       this.$refs.detailScroller._xscroll.on('scroll',(e)=> {
        var getScrollTopNum=this.$refs.detailScroller._xscroll.getScrollTop()
          if(getScrollTopNum>0 && self.oldscrolly<getScrollTopNum){
            self.showPublishBtn=false
          }else if(getScrollTopNum>0 && self.oldscrolly>getScrollTopNum){
             self.showPublishBtn=true
          }
          if(getScrollTopNum>0 && getScrollTopNum<120){
            self.TopScroll=getScrollTopNum*2/40
            self.topSearch=false
          }else if(getScrollTopNum>120){
            self.TopScroll=240/40;
            self.topSearch=true
          }else{
            self.TopScroll=0
             self.topSearch=false
          }
          let scrolly = this.$refs.detailScroller._xscroll.getScrollTop();
          self.oldscrolly=scrolly
          this.$refs.detailScroller._xscroll.resetSize()
        });
      });
     },
     godetail(id){
        let self=this;
        if(self.tableId==1){
            this.$router.push({path:'/unused/detaile',query: { tableId:self.tableId,goodId:id}})
        }else if(self.tableId==2){
            this.$router.push({path:'/sale/detaile',query: { tableId:self.tableId,goodId:id}})
        }else{
            this.$router.push({path:'/donate/detaile',query: { tableId:self.tableId,goodId:id}})
        }
     },
     goLinkHttp:function(item){
        window.location.href=item.h5Route
     },
     tabDtaile(tableId,nowPage,isTableSelect){
      let self = this
        if(isTableSelect){
          self.$nextTick(()=>{
            self.$refs.detailScroller.reset({top: 0},500, 'ease');
          })
          self.detailData=''
          self.detailGoodList=[]
        }
        self.tableId=tableId;
     
        localStorage.setItem('tableId',self.tableId)
        sessionStorage.setItem('tableId',self.tableId)
        self.$http.get('/sh/ja/v1/home/'+tableId+"?page="+nowPage+"&limit=20")
        .then(function(res) {
          if(res.data.statusCode==0){
            if(res.data.data.data.length>0){
              self.hasItem=true;
            }else{
              self.hasItem=false
            }
            for(let i=0;i<res.data.data.data.length;i++){
              self.detailGoodList.push(res.data.data.data[i]);
            }
            self.detailData = res.data.data;
            self.extendsData = self.detailData.extendsData
            
            console.log(self.extendsData)
            self.page.totalpage = res.data.data.totalpage;
            if(res.data.data.hasNext){
                self.page.currPage++;
            }
            self.page.hasNext = res.data.data.hasNext;
            if(isTableSelect){
              self.$nextTick(() => {
                self.$refs.scrollerx.reset({left: 0});
              })
            }
            self.$nextTick(() => {
              self.$refs.scrollerx._xscroll.resetSize();
            })
          }
          self.$nextTick(()=>{
            self.listenScroller();
            self.$refs.detailScroller.donePullup();
            if(!self.page.hasNext){
              self.$refs.detailScroller.disablePullup();
            }
          });
        })

     },
    loadMore () {
      if(this.page.hasNext){
          setTimeout(() => {
            this.tabDtaile(this.tableId,this.page.currPage,false)
          }, 2000)
      }
    },
    refresh () {
      setTimeout(() => {
        this.tabDtaile(this.tableId,1,true);
      }, 2000)
    },
    getBarWidth: function (index) {
      return   25 + 'px'
    }

  },
   components: {
    Group,
    Cell,
    Swiper,
    SwiperItem,
    Tab,
    TabItem,
    Scroller,
    Spinner,
    UserGoods,
    PullHeaderFooter,
    showPublish,
    setNick,
    Bottombar,
    blankPage,TransferDom
  }

}

</script>

<style scoped lang='less'>
.indexnoItem{
  height: 17rem;
}
.home_main{
  position: absolute;;
  overflow: hidden;
  top: 0;
  bottom: 0rem;
  left: 0;
  width: 100%;
  background:#fff;
  transition: top 0.2s;
  .header-wrap{
    position: relative;
    background-color: rgba(56, 68, 106, 1);
    .search{
      position: absolute;
      top: 18/40rem;
      left: 40/40rem;
      right: 40/40rem;
      height: 64/40rem;
      line-height: 64/40rem;
      border-radius: 8/40rem;
      z-index: 99;
      color: #222;
      background: url('../assets/img/search/searchWhite.png') no-repeat 10px center ;
       background-color: rgba(255, 255, 255, 0.7);
      background-size: 8%;
      font-size: 28/40rem;
      padding-left: 2.5rem;
    }
  }
  .topSearch{
   background-color: rgba(56, 68, 106, 1);
  }
  .topSearch .search{
    background-color: rgba(255, 255, 255, 0.7);
    color: #222;
  }
  .searchBox{
    position: fixed;
    top:0;
    width: 100%;
    height: 100/40rem;
    z-index: 99
  }
  .padd15{
    padding-right: 35/40rem;
  }
  .scroll-wrap{
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
    top: 10.9rem;
    overflow: hidden;
  }
}
.banner_item_wrap{
  font-size: 0;
  padding: 0 30/40rem;
  margin: 40/40rem 0;
  .banner_item{
    width: 312/40rem;
    height: 192/40rem;
    display: inline-block;
    margin: 0 10/40rem;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
.indexScroller{
  padding-bottom: 50/40rem;
}
</style>
<style lang='less'>
  .page.home{
    position: relative;
    z-index: 999;
    .myswipper{
      height: auto !important;
    }
    .vux-tab{
      height: 96/40rem;
      .vux-tab-item{
        // background: linear-gradient(180deg, #f7f7f7, #f7f7f7, rgba(229, 229, 229, 0)) bottom left no-repeat;
        font-size: 32/40rem;
        line-height: 96/40rem;
      }
    }
    .vux-tab-bar-inner{
      width: 65/40rem !important;
      height: 6/40rem !important;
      border-radius: 6/40rem;
    }
    .userGoodTpl{
      margin: 0;
      border-top: none;
    }
  }
  .indexnoItem .blackCont img{
    width: 5.5rem;
  }
  .home_main .vux-tab-bar-inner{
     background: url('../assets/img/index/bannerLine.png') no-repeat center ;
     background-size: cover;
     background-color: rgba(0,0,0,0)!important;
  }
</style>

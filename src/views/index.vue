<template>
  <div class="page home" style="height:100%;">
      <main class="home_main">
        <div class="header-wrap">
          <swiper dots-position="center" dots-class="custom-bottom">
            <swiper-item class="swiper-demo-img"  v-for="(item, index) in homeData.topBanner" height="12.5rem" :key="index" @click.native='goLinkFn(item)'>
              <img :src="item.imgUrl">
            </swiper-item>
          </swiper>
        </div>
        <div class="flexBox verticalScroll">
          <img src="../assets/img/index/mainpage_icon_notification_@2x.png" class="indexRadio" />
          <div class="flex1">
            <swiper auto height="40px" direction="vertical" :interval=2000 class="" :show-dots="false">
              <swiper-item v-for='item in homeData.noticeArticle' @click.native='goLinkFn(item)'>
                <p class="verticalSwiper TextEllipsis">{{item.title}}</p>
              </swiper-item>
            </swiper>
          </div>
        </div>
        <flexbox :gutter="0" wrap="wrap">
          <flexbox-item :span="1/4" v-for='item in homeData.navigationBanner' @click.native='goLinkFn(item)'>
            <div class="indexItemBox">
              <img :src="item.imgUrl"/>
              <p>{{item.title}}</p>
            </div>
          </flexbox-item>
        </flexbox>
        <div class="indexLinkBox">
          <flexbox :gutter="0" wrap="wrap" >
            <flexbox-item :span="1/3" v-for='item in homeData.ideaBanner'  @click.native='goLinkFn(item)'>
              <div class="linkBox">
                <img :src="item.imgUrl"/>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="blockContBox">
          <p class="blockTitle">社区精选</p>
          <div class="flexBox blockBox" v-for='item in homeData.recommendArticle' @click='goLinkFn(item)'>
              <div class="flex1">
                  <p class="articleTitle TextEllipsis">{{item.title}}扎上帝发的风格山东分公司大概地方都感到反感誓地方萨发撒旦发生发射飞弹</p>
                  <p class="articleTip">{{item.content}} <span>{{item.createTime}}</span></p>
              </div>
              <img :src="item.imgUrl" class="articleImg">
          </div>
        </div>
      </main>
      <div v-transfer-dom>
        <x-dialog v-model="showAdverBlur" class="IndexDialogBox" hide-on-blur>
          <div class="IndexDialog">
              <img :src="adBanner.imgUrl" @click='goLinkFn(adBanner)'>
            <p>
              <span @click='showAdverBlur=false'></span>
            </p>
          </div>
        </x-dialog>
      </div>
      <Bottombar :index="0"></Bottombar>
      
  </div>
</template>

<script>
import { Flexbox, FlexboxItem,Group, Cell, Swiper, SwiperItem, Tab, TabItem, Scroller, Spinner,XDialog, TransferDomDirective as TransferDom} from 'vux'
import Bottombar from '@/components/BottomBar'
import blankPage from '@/components/blankPage'
import {encode} from '@/util/base64Code'
import Vue from 'vue'

export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      homeData:{},
      topBannerList:[],
      WxCode:'',
      showAdverBlur:false,
      adBanner:'',
    }
  },
  mounted () {
    let self=this;
    self.setTitle('欢乐之家');
    self.WxCode = self.$route.query.code;
    let userObj = JSON.parse(localStorage.getItem('_user'))
    // if(self.WxCode){
    //   console.log("userObj"+userObj)
    //   console.log(userObj)
    //   if(!userObj){
    //     console.log(userObj)
    //     self.weChatLogin();
    //   }else{
    //     self.init();
    //   }
    // }else{
    //   self.getWxCode()
    // }
    self.init();
    
  },
   methods: {
    getWxCode:function(){
      let self=this;
      var redirectUrl=Vue.http.defaults.baseURL+'/h9-weixin/#/index'
      window.location.href=Vue.http.defaults.baseURL+'/h9/api/common/wechat/code?url='+encode(redirectUrl)
    },
    weChatLogin:function(){
      let self=this;
      self.$http.get('h9/api/wechat/login?code='+self.WxCode)
      .then(function(res) {
        if(res.data.code==0){
          localStorage.setItem("_user", JSON.stringify(res.data.data));
          Vue.http.defaults.headers.token = (res.data.data.token) ? res.data.data.token : '';
          self.init();
        }
      })
    },
     init(){
        let self=this;
        self.$http.get('h9/api/home')
        .then(function(res) {
          if(res.data.code==0){
            self.homeData=res.data.data;
            self.adBanner=self.homeData.adBanner[0]
            if(self.homeData.adBanner.length>0){
              self.showAdverBlur=true
            }
            for(var i=0;i<self.homeData.topBanner.length;i++){
              self.topBannerList.push({
                url:self.homeData.topBanner[i].link,
                img:self.homeData.topBanner[i].imgUrl,
              })
            }
          }
        })
     },
     goLinkFn:function(item){
        if((item.link).indexOf('http')!=-1){
          window.open(item.link)
        }else{
          //抢红包 "link:"lottery"/滴滴兑换 "link:"exchange_didi"/手机充值"link:"exchange_telephoneFare"/查询真伪 “link”:"validate"
          if(item.link==='lottery'){
            this.$router.push({path:'/active/hongbao'})
          }else if(item.link==='exchange_didi'){
            this.$router.push({path:'/account/ddExchange'})
          }else if(item.link==='exchange_telephoneFare'){
            this.$router.push({path:'/account/phoneRecharge'})
          }else if(item.link==='validate'){
            this.$router.push({path:'/active/searchIsReally'})
          }else{
            this.$router.push({path:item.link})
          }
        }
     }

  },
   components: {
    Flexbox, FlexboxItem,
    Group,
    Cell,
    Swiper,
    SwiperItem,
    Tab,
    TabItem,
    Scroller,
    Spinner,
    Bottombar,
    blankPage,TransferDom,XDialog
  }

}

</script>

<style scoped lang='less'>
.home_main{
  overflow: auto;
  width: 100%;
  height: 100%;
  background:#fff;
  transition: top 0.2s;
  .header-wrap {
      div{
        text-align: center;
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .verticalScroll{
    /*border-bottom: 1px solid #ddd;*/
    line-height: 2rem;
  }
  .verticalSwiper{
    -webkit-line-clamp: 1;
    font-size: 24/40rem;
    color: #4d4d4d;
  }
  .indexItemBox{
    text-align: center;
    padding: 33/40rem 0;
  }
  .indexLinkBox{
    padding: 0 15/40rem;
  }
  .indexItemBox img{
    width: 2rem;
    height: 2rem;
    border-radius: 2rem;
  }
  .indexItemBox p{
    font-size: 24/40rem;
  }
  .blockBox{
    margin: 0 30/40rem;
    padding: 30/40rem 0;
    border-bottom: 1px solid #f2f2f2;
  }
  .articleTitle{
    line-height: 1rem;
    font-size: 28/40rem;
  }
  .articleTip{
    font-size: 12/40rem;
    color: #999;
    margin-top: 20/40rem;
  }
  .articleTip span{
    margin-left: 1rem;
  }
  .articleImg{
    width: 250/40rem;
    height: 180/40rem;
    margin-left: 30/40rem;
    border-radius: 10/40rem;
  }
  .articleTitle{
    -webkit-line-clamp: 2;
  }
  .indexRadio{
    width: 1rem;
    height: 1rem;
    margin: 20/40rem 10/40rem 20/40rem  30/40rem;
  }
  .linkBox{
     box-sizing:border-box;
     padding: 0 15/40rem;
  }
  .linkBox img{
    width: 210/40rem;
    height: 120/40rem;
    border-radius: 8/40rem;
    border:1px solid #ddd;
  }
  .blockTitle{
    font-size: 32/40rem;
    padding: 20/40rem 30/40rem 0;
  }
  .blockContBox{
    margin-bottom: 250/80rem;
  }
  .IndexDialogBox{
    text-align: center;
    background: rgba(0,0,0,.0);
    img{
      width: 590/40rem;
      height: 800/40rem;
      border-radius: 10/40rem;
    }
    p{
      margin-top: 50/40rem;
    }
    span{
      background: url('../assets/img/index/mainpage_btn_adclose@2x.png');
      background-size: 100%;
      display: inline-block;
      width: 78/40rem;
      height: 78/40rem;
    }
  }
</style>
<style lang='less'>
  .indexTab .vux-tab-item{
    background: none!important;
  }
  .IndexDialogBox .weui-dialog{
    background: none;
  }
</style>

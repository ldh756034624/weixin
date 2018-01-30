<template>
  <div class="page home" style="height:100%;">
    <div class="scroll-wrap2">
      <scroller lock-x scrollbar-y ref="detailScroller" use-pulldown height="100%" @on-pulldown-loading="refresh"
                v-model="status1">
        <div>
          <div class="top vux-1px-b">
            <div class="search" @click="search"><i class="weui-icon weui_icon_search weui-icon-search"></i><span>搜索</span></div>
            <div class="add" @click="add"></div>
          </div>
          <main class="home_main">
  <tab :line-width="2" custom-bar-width="20px" bar-active-color="#627984" active-color='#627984'>
              <tab-item selected @on-item-click="init(0)">首页</tab-item>
              <tab-item @on-item-click="init(1)">热门</tab-item>
            </tab>
            <div class="header-wrap" v-if='topBannerList && index === 0'>
              <swiper dots-position="center" auto dots-class="custom-bottom" height="5rem">
                <swiper-item class="swiper-demo-img" v-for="(item, index) in topBannerList" :key="index" @click.native='goLinkFn(item)'>
                  <img :src="item.img" class="homeImg">
                </swiper-item>
              </swiper>
            </div>
            <flexbox :gutter="0" wrap="wrap" style="background-color:#fff;" v-if="index === 0">
              <flexbox-item :span="1/4">
                <router-link to="/bbs/list/1" style="width:100%;">
                  <div class="indexItemBox">
                    <img src="../../assets/img/bbs/icon_zuixinhuodong@2x.png"/>
                    <p>最新活动</p>
                  </div>
                </router-link>
              </flexbox-item>
              <!--todo 后台给予标签-->
              <flexbox-item :span="1/4">
                <router-link to="/bbs/list/2" style="width:100%;">
                  <div class="indexItemBox">
                    <img src="../../assets/img/bbs/icon_cangjiujiaoliu@2x.png"/>
                    <p>藏酒交流</p>
                  </div>
                </router-link>
              </flexbox-item>
              <flexbox-item :span="1/4">
                <router-link to="/bbs/list/3" style="width:100%;">
                  <div class="indexItemBox">
                    <img src="../../assets/img/bbs/icon_@2x.png"/>
                    <p>文史影趣</p>
                  </div>
                </router-link>
              </flexbox-item>
              <flexbox-item :span="1/4">
                <router-link to="/bbs/list/4" style="width:100%;">
                  <div class="indexItemBox">
                    <img src="../../assets/img/bbs/icon_chihewanle@2x.png"/>
                    <p>吃喝玩乐</p>
                  </div>
                </router-link>
              </flexbox-item>
            </flexbox>
            <div class="blockContBox" v-if='homeData'>
              <div class="stickItem" v-for='item in homeData' :key="item.id" @click='goLinkFn(item)'>
                <div class="stickBox">
                  <div class="stickName">
                    <img :src="item.userAvatar">
                    <p>{{item.userName}}<span>{{item.spaceTime}}</span></p>
                  </div>
                  <div class="stickTitle">{{item.title}}</div>
                  <div class="stickImage" v-if="item.images.length > 0">
                    <img :src="img" v-for="img in item.images">
                  </div>
                  <div class="stickType">
                    <span>#{{item.typeName}}#</span>　
                    阅读 {{item.readCount}}　
                    回复 {{item.answerCount}}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down"
             style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
          <span v-show="status1.pulldownStatus === 'default'"></span>
          <span class="pulldown-arrow" v-show="status1.pulldownStatus === 'down' || status1.pulldownStatus === 'up'"
                :class="{'rotate': status1.pulldownStatus === 'up'}">下拉刷新</span>
          <span v-show="status1.pulldownStatus === 'loading'"><spinner type="ios-small"></spinner></span>
        </div>
      </scroller>
    </div>
    <div class="loading" v-show='loadingShow'>
      <div class="cellBox">
        <img :src="lodingImg">
        <p>正在加载中</p>
      </div>
    </div>
    <Bottombar :index="0"></Bottombar>

  </div>
</template>

<script>
  import {
    Flexbox,
    FlexboxItem,
    Sticky,
    Group,
    Cell,
    Swiper,
    SwiperItem,
    Tab,
    TabItem,
    Scroller,
    Spinner,
    XDialog,
    TransferDomDirective as TransferDom
  } from 'vux'
  import Bottombar from '@/components/BottomBar'
  import blankPage from '@/components/blankPage'
  import {encode} from '@/util/base64Code'
  import Vue from 'vue'

  export default {
    directives: {
      TransferDom
    },
    data() {
      return {
        homeData: [],
        topBannerList: [],
        WxCode: '',
        index: null,
        showAdverBlur: false,
        status1: {
          pulldownStatus: 'default'
        },
        loading: this.$store.state.showLoading,
        loadingShow: true,
        lodingImg: require('../../assets/img/blank/loading.gif')
      }
    },
    mounted() {
      let self = this;
      self.setTitle('欢乐之家');
      self.WxCode = self.$route.query.code;
      let userObj = JSON.parse(localStorage.getItem('_user'))
      if (!userObj) {
        if (!self.WxCode) {
          // self.getWxCode()
        } else {
          self.weChatLogin();
        }
      } else {
        self.$http.get('h9/api/stick/home')
          .then(res => {
            if (res.data.code == 0 && res.data.data.stickHomeTopBanner) {
              for (var i = 0; i < res.data.data.stickHomeTopBanner.length; i++) {
                self.topBannerList.push({
                  url: res.data.data.stickHomeTopBanner[i].link,
                  img: res.data.data.stickHomeTopBanner[i].imgUrl,
                })
              }
              console.log(self.topBannerList)
            }
          })
        self.init(0);
      }
      //console.log( self.loadingShow)
      self.loadingShow = self.$store.state.showLoading
      //self.init();
      // self.$watch('showAdverBlur',function(val){
      //   if(!val){
      //     sessionStorage.setItem('AdverBlur',false)
      //   }
      // })
    },
    beforeUpdate: function () {
      let self = this;
      self.loadingShow = this.$store.state.showLoading
    },
    methods: {
      weChatLogin: function () {
        let self = this;
        self.$http.get('h9/api/wechat/login?code=' + self.WxCode)
          .then(function (res) {
            if (res.data.code == 0) {
              localStorage.setItem("_user", JSON.stringify(res.data.data));
              Vue.http.defaults.headers.token = (res.data.data.token) ? res.data.data.token : '';
              self.init();
            }
          })
      },
      init(num) {
        let self = this;
        if (self.index !== num ){
          self.homeData = []
        } else {
          return
        }
        self.index = num
        let url = 'h9/api/stick/config_home/list'
        if (num === 1) {
          url = 'h9/api/stick/config_hot/list'
        }
        self.$http.get(url)
          .then(res => {
            if (res.data.code == 0) {
              if (self.homeData.length < 1) {
                self.homeData = res.data.data.data
              } else {
                self.homeData = [self.homeData, ...res.data.data.data];
              }
              self.$nextTick(() => {
                setTimeout(() => {    // 图片加载完成后刷新高度
                  self.$refs.detailScroller.reset()
                  // self.$refs.sticky.bindSticky()
                }, 1000)
              })
            }
          })
      },
      goLinkFn: function (item) {
          this.$router.push({path: '/bbs/detail/'+item.id})
      },
      refresh() {
        let self = this;
        setTimeout(() => {
          self.init(self.index);
          self.$refs.detailScroller.reset({top: 0}, 500, 'ease');
        }, 2000)
      },
      add () {
        this.$router.push({ path: '/bbs/add' })
      },
      search () {
        this.$router.push({ path: '/bbs/search' })
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
      blankPage, TransferDom, XDialog, Sticky
    }

  }

</script>

<style scoped lang='less'>
  .home_main {
    overflow: auto;
    width: 100%;
    height: 100%;
    transition: top 0.2s;
    .header-wrap {
        height: 200/40rem;
      div {
        text-align: center;
      }
      img {
        width: 100%;
        height: 200/40rem;
      }
    }
  }

  .verticalScroll {
    /*border-bottom: 1px solid #ddd;*/
    line-height: 2rem;
  }

  .verticalSwiper {
    -webkit-line-clamp: 1;
    font-size: 24/40rem;
    color: #4d4d4d;
  }

  .indexItemBox {
    text-align: center;
    padding: 33/40rem 0;
  }


  .indexItemBox img {
    width: 2rem;
    height: 2rem;
    border-radius: 2rem;
  }

  .indexItemBox p {
    font-size: 24/40rem;
  }

  .blockBox {
    margin: 0 30/40rem;
    padding: 30/40rem 0;
    border-bottom: 1px solid #f2f2f2;
  }

  .articleTitle {
    line-height: 1rem;
    font-size: 28/40rem;
  }

  .articleTip {
    font-size: 24/40rem;
    color: #999;
    margin-top: 20/40rem;
  }

  .articleTip span {
    margin-left: 20/40rem;
  }

  .articleImg {
    width: 250/40rem;
    height: 180/40rem;
    margin-left: 22/40rem;
    border-radius: 10/40rem;
  }

  .articleTitle {
    -webkit-line-clamp: 2;
  }

  .indexRadio {
    width: 1rem;
    height: 1rem;
    margin: 20/40rem 10/40rem 20/40rem  30/40rem;
  }

  .linkBox {
    box-sizing: border-box;
    padding: 0 15/40rem;
  }

  .linkBox img {
    width: 210/40rem;
    height: 120/40rem;
    border-radius: 8/40rem;
  }

  .blockTitle {
    font-size: 32/40rem;
    padding: 20/40rem 30/40rem 0;
  }

  .blockContBox {
    margin-bottom: 250/80rem;
  }

  .IndexDialogBox {
    text-align: center;
    background: rgba(0, 0, 0, .0);
    img {
      width: 590/40rem;
      height: 800/40rem;
      border-radius: 10/40rem;
    }
    p {
      margin-top: 50/40rem;
    }
    span {
      background: url('../../assets/img/index/mainpage_btn_adclose@2x.png');
      background-size: 100%;
      display: inline-block;
      width: 78/40rem;
      height: 78/40rem;
    }
  }

  .loading {
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    display: table;
    .cellBox {
      display: table-cell;
      vertical-align: middle;
      width: 3rem;
      text-align: center;
      margin: 0 auto;
      font-size: 24/40rem;
    }
    img {
      width: 60/40rem;
      height: 60/40rem;
    }
    .loadingImg {
      display: inline-block;
      width: 60/40rem;
      height: 60/40rem;
      background: url('../../assets/img/blank/loading.gif');
    }
  }
  .scroll-wrap2 {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
    top: 0;
    overflow: hidden;
}
.top {
    padding: 8px 0;
    width: 100%;
    display: flex;
    background-color: #fff;
}
.search {
    height: 30px;
    line-height: 30px;
    color: #999;
    font-size: 15px;
    margin-left: 15px;
    background-color: #F2F4F5;
    border-radius: 22px;
    flex: 1;
  }
  .search .weui-icon-search {
    color: #999;
    font-size: 15px;
    margin-right: 6px;
    margin-left: 15px;
    vertical-align: -2px;
  }
  .add {
    width: 24px;
    height: 30px;
    margin-left: 11px;
    margin-right: 15px;
    background: url('../../assets/img/bbs/fatie@2x.png') no-repeat center;
    background-size: 24px 24px;
  }
  .stickItem {
    background-color: #fff;
    margin-top: 10px;
  }
  .stickBox {
    padding: 7px 15px 15px;
  }
  .stickName {
    font-size: 14px;
    color: #666666;
line-height: 25px;
display: flex;
  }
  .stickName img{
    width: 25px;
    height: 25px;
    border-radius: 12.5px;
    margin-right: 8px;
  }
  .stickName p {
    flex: 1;
    vertical-align: middle;
  }
  .stickName p span {
    color: #999;
    font-size: 12px;
    float: right;
  }
  .stickTitle {
    font-size: 18px;
    color: #333333;
    line-height: 18px;
    padding: 10px 0;
  }
  .stickImage {
    display: flex;
    justify-content: space-between;
  }
  .stickImage img {
    width: 90px;
    height: 90px;
  }
  .stickType {
    font-size: 12px;
color: #999999;
line-height: 12px;
padding-top: 10px;
  }
  .stickType span {
    color: #2687D5;
  }
</style>
<style lang='less'>
  .indexTab .vux-tab-item {
    background: none !important;
  }

  .IndexDialogBox .weui-dialog {
    background: none;
  }

  .pulldown-arrow {
    font-size: 24/40rem;
  }
.home_main .vux-slider > .vux-indicator {
      bottom: 0px;
}
  .vux-slider > .vux-indicator > a > .vux-icon-dot.active, .vux-slider .vux-indicator-right > a > .vux-icon-dot.active {
    background-color: #627984 !important;
  }
</style>

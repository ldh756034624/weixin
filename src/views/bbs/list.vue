<template>
  <div class="page home" style="height:100%;">
    <main class="home_main">
      <div class="listT">
        <div class="listTbox">
          <img :src="detailData.image">
          <div class="listTcon">
            <div class="TName">{{detailData.name}}</div>
            <div class="Tcontent">{{detailData.content}}</div>
            <div class="Tcount"><span>帖子 {{detailData.stickCount || 0}}</span><span>浏览 {{detailData.readCount || 0}}</span><span>回复 {{detailData.answerCount || 0}}</span></div>
          </div>
        </div>
      </div>
      <div class="blockContBox" v-if='homeData'>
        <div class="stickItem" v-for='item in homeData' :key="item.id" @click='goLinkFn(item)'>
          <div class="stickBox">
            <div class="stickName">
              <img :src="item.userAvatar">
              <p>{{item.userName}}<span>{{item.spaceTime}}</span></p>
            </div>
            <div class="stickTitle">{{item.title}}</div>
            <div class="stickImage" v-if="item.images&&item.images.length > 0">
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
    <div class="loading" v-show='loadingShow'>
      <div class="cellBox">
        <img :src="lodingImg">
        <p>正在加载中</p>
      </div>
    </div>
    <div class="onBtn" @click="add">发帖子</div>
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
        detailData: {},
        WxCode: '',
        id: this.$route.params.id,
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

      self.WxCode = self.$route.query.code;
      let userObj = JSON.parse(localStorage.getItem('_user'))
      if (!userObj) {
        if (!self.WxCode) {
          // self.getWxCode()
        } else {
          self.weChatLogin();
        }
      } else {
        self.$http.get('h9/api/stick/'+self.id+'/detail')
          .then(res => {
            if (res.data.code == 0) {
              self.detailData = res.data.data
              self.setTitle(self.detailData.name);
            }
          })
        self.init();
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
      init() {
        let self = this;
        const params = {
          params : {
            id: self.id,
            limit: 30,
            page: 1
          }
        }
        self.$http.get('h9/api/stick/'+self.id+'/list', params)
          .then(res => {
            if (res.data.code == 0) {
              if (self.homeData.length < 1) {
                self.homeData = res.data.data.data
              } else {
                self.homeData = [self.homeData, ...res.data.data.data];
              }
            }
          })
      },
      goLinkFn: function (item) {
          this.$router.push({path: '/bbs/detail/'+item.id})
      },
      add () {
        this.$router.push({ path: '/bbs/add' })
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
    margin-bottom: 60px;
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
  .onBtn {
    height: 50px;
    line-height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    color: #fff;
    background: #627984;
    font-size: 16px;
  }
  .listT {
    padding: 0 15px;
    background-color: #fff;
  }
  .listTbox {
    width: 100%;
    height: 90px;
    display: flex;
    align-items: center;
  }
  .listTcon {
    flex: 1;
    overflow: hidden;
  }
  .listT img {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    margin-right: 22px;
  }
  .TName {
    font-size: 16px;
color: #333333;
line-height: 16px;
  }
  .Tcontent {
    font-size: 12px;
color: #333333;
line-height: 12px;
padding: 8px 0 12px;
text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .Tcount {
    font-size: 12px;
color: #999999;
line-height: 12px;
  }
  .Tcount span {
    margin-right: 30px;
  }
</style>

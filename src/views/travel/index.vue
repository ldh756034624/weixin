<template>
  <div class="page shopPage mrgb" id="travelBanner">
    <div v-for="(item, index) in shopData" :key="index">
      <flexbox :gutter="0" wrap="wrap" class='sortBox' v-if="item.layoutStyle == 'NavigationBtn'"
               id="length0topBar">
        <flexbox-item :span="0.33" v-for='btn in item.imgList' @click.native='init(btn.link)' :key="btn.id">
          <div>
            <img :src="btn.imgUrl"/>
            <p class="title-bottom">{{btn.title}}</p>
          </div>
        </flexbox-item>
      </flexbox>
      <swiper dots-position="center" auto dots-class="custom-bottom" v-if="item.layoutStyle=='Roll'"
              :show-dots="item.imgList.length>1" height="9.375rem">
        <swiper-item class="swiper-demo-img" height="9.375rem" v-for="list in item.imgList" :key="list.id"
                     @click.native='goLinkFn(list)'>
          <img :src="list.imgUrl" width="100%" height="100%">
          <div class="swiperTitle">{{list.title}}</div>
        </swiper-item>
      </swiper>
      <div class="imgbox" v-if="item.layoutStyle=='TWO'">
        <div class="imgItem" v-for="imgList in item.imgList" @click='goLinkFn(imgList)'>
          <img :src="imgList.imgUrl">
          <p>{{imgList.title}}</p>
        </div>
      </div>
    </div>
    <Bottombar :index="1"></Bottombar>
  </div>
</template>

<script>
  import {Flexbox, FlexboxItem, Tab, TabItem, Swiper, SwiperItem, Scroller, Spinner} from 'vux'
  import Bottombar from '@/components/BottomBar'

  export default {
    mounted() {
      const self = this
      this.setTitle('旅游健康卡');
      self.WxCode = self.$route.query.code;
      let userObj = JSON.parse(localStorage.getItem('_user'))
      if (!userObj) {
        if (!self.WxCode) {
          self.getWxCode()
        } else {
          self.weChatLogin();
        }
      } else {
        self.init();
      }
    },
    data() {
      return {
        shopTop: [],
        shopData: [],
        WxCode: this.$route.query.code, //微信回调码
        getBarWidth: function (index) { // 动态计算每个bar条的宽
          return 60 + 'px'
        },
        status1: {
          pulldownStatus: 'default'
        },
        itembox: 0.5
      }
    },
    methods: {
      init(link) {
        var tabId = null
        if (link) {
          tabId = link.split(':')[1]
          this.$http.get('h9/api/travel/health/' + tabId)
            .then((res) => {
              if (res.data.code == 0) {
                this.shopData = res.data.data
                console.log(this.shopData)
              }
            })
        } else {
          this.$http.get('h9/api/travel/health/')
            .then((res) => {
              if (res.data.code == 0) {
                this.shopData = res.data.data
                console.log(this.shopData)
              }
            })
        }

      },
      weChatLogin: function () {
        let self = this;
        self.$http.get('h9/api/wechat/login?code=' + self.WxCode)
          .then(function (res) {
            if (res.data.code == 0) {
              _g.toastMsg('error', '微信登录成功');
              localStorage.setItem("_user", JSON.stringify(res.data.data));
              Vue.http.defaults.headers.token = (res.data.data.token) ? res.data.data.token : '';
              _g.toastMsg('error', self.barcode);
            }
          })
      },
      goLinkFn: function (item) {
        if (!item.link) {
          return
        }
        if ((item.link).indexOf('http') != -1) {
          window.open(item.link)
        } else {
          //所有商品'allGoods',食品'foods',日常家居'everydayGoods',今日新品'todayNewGoods')
          this.$router.push({path: '/shopDataile', query: {id: item.link.split(':')[1]}})
        }
      }
    },
    components: {
      Flexbox, FlexboxItem, Bottombar, Tab, TabItem, Swiper, SwiperItem, Scroller, Spinner
    }
  }
</script>
<style scoped lang='less'>
  .active-tab {
    color: #e60012 !important;
  }

  .shopPage {
    overflow-y: auto;
  }

  .mrgb {
    padding-bottom: 110/40rem;
  }

  .imgbox {
    display: flex;
    background: #fff;
    justify-content: center;
    padding-top: 30/40rem;
    padding-bottom: 35/40rem;
    .imgItem {
      width: 318/40rem;
      // height: 318/40rem;
      text-align: left;
      img {
        width: 318/40rem;
        height: 318/40rem;
        /*box-shadow: 6px 5px 16px 0px
        rgba(4, 0, 0, 0.15);*/
        box-shadow: 0px 4px 12px -1px rgba(77, 77, 77, .4);
        border: 1px solid #d1d1d1;
      }
      p {
        color: #221815;
        font-size: 25/40rem;
        line-height: 25/40rem;
        padding-top: 10/40rem;
      }
    }
    .imgItem:first-child {
      margin-right: 30/40rem;
    }
  }

  .swiperTitle {
    position: absolute;
    top: 260/40rem;
    left: 50/40rem;
    color: #221815;
    font-size: 36/40rem;
    text-shadow: #fff 1px 0 0, #fff 0 1px 0,#fff -1px 0 0, #fff 0 -1px 0;;
  }

  .sortBox {
    background: #fff;
    padding: 30/40rem 0 10/40rem;
    margin: 20/40rem 0 0 0;
    text-align: center;
    font-size: 26/40rem;
    border-bottom: 1px solid #EFEFEF;
    img {
      width: 122/40rem;
      height: 122/40rem;
      border-radius: 3rem;
      /*margin-bottom: 15/40rem;*/
    }
    .title-bottom {
      margin-bottom: 20/40rem;
    }
  }
</style>
<style type="text/css" lang='less'>
  .shopPage {
    .vux-slider .vux-indicator {
      bottom: 0;
    }
  }

  .pulldown-arrow {
    font-size: 24/40rem;
  }

  #shopBanner .vux-swiper {
    height: 375/40rem !important;
  }
</style>

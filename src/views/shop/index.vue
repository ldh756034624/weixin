<template>
  <div class="page shopPage">
    <div class="scroll-wrap">
      <scroller lock-x scrollbar-y ref="detailScroller" use-pulldown height="100%" @on-pulldown-loading="refresh"
                v-model="status1">
        <div class="mrgb" id="shopBanner">
          <swiper dots-position="center" auto dots-class="custom-bottom">
            <swiper-item class="swiper-demo-img" v-for="(item, index) in shopTop" height="12.5rem" :key="index"
                         @click.native='goLinkFn(item)'>
              <img :src="item.imgUrl" width="100%" height="100%">
            </swiper-item>
          </swiper>
          <flexbox :gutter="0" wrap="wrap" class='sortBox'>
            <flexbox-item :span="itembox" v-for='item in navBanner' @click.native='goLinkFn(item)' :key="item.id">
              <div>
                <img :src="item.imgUrl"/>
                <p class="title-bottom">{{item.title}}</p>
              </div>
            </flexbox-item>
          </flexbox>
          <section>
            <div class="exchangeBox" v-if='shopData.hotGoods'>
              <flexbox :gutter="0" wrap="wrap">
                <flexbox-item :span="1/2" class='shopLine' v-for='item in shopData.hotGoods' :key="item.id">
                  <router-link :to="{path:'/shopDataile',query:{id:item.id}}">
                    <div class='shopBox'>
                      <img class='shopImg' :src="item.img"/>

                    </div>
                    <div class="bottomBox">
                        <span class="desc">{{item.name}}</span>
                        <span class="joyMoney"><span>¥ {{item.price}}</span>{{item.unit?'/'+item.unit:''}}</span>
                      </div>
                  </router-link>
                </flexbox-item>
              </flexbox>
            </div>

          </section>
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
    <Bottombar :index="1"></Bottombar>
  </div>
</template>

<script>
  import {Flexbox, FlexboxItem, Swiper, SwiperItem, Scroller, Spinner} from 'vux'
  import Bottombar from '@/components/BottomBar'

  export default {
    mounted() {
      const self = this
      self.setTitle('徽酒商城');
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
        navBanner: [],
        WxCode:this.$route.query.code, //微信回调码
        shopData: {},
        status1: {
          pulldownStatus: 'default'
        },
        itembox: 0.5
      }
    },
    methods: {
      init() {
        this.$http.get('h9/store/home')
          .then((res) => {
            if (res.data.code == 0) {
              this.shopData = res.data.data
              this.navBanner = this.shopData.banners.storeNavigationBanner
              if(this.navBanner != undefined){
                if(this.navBanner.length == 0){
                this.itembox = 1
                }else if(this.navBanner.length === 2){
                  this.itembox =  0.5
                }else if(this.navBanner.length === 3){
                  this.itembox = 0.33
                }
                else {
                  this.itembox = 0.25
                }
              }
              this.shopTop = this.shopData.banners.convertStoreTopBanner
            }
            this.$nextTick(() => {
              setTimeout(() => {    // 图片加载完成后刷新高度
                this.$refs.detailScroller.reset()
              }, 1000)
            })
          })
      },
      weChatLogin:function(){
      let self=this;
      self.$http.get('h9/api/wechat/login?code='+self.WxCode)
      .then(function(res) {
        if(res.data.code==0){
          _g.toastMsg('error', '微信登录成功');
          localStorage.setItem("_user", JSON.stringify(res.data.data));
          Vue.http.defaults.headers.token = (res.data.data.token) ? res.data.data.token : '';
           _g.toastMsg('error', self.barcode);
        }
      })
    },
      goLinkFn: function (item) {
        console.log('item', item)
        if (!item.link) {
          return
        }
        if ((item.link).indexOf('http') != -1) {
          window.open(item.link)
        } else {
          //所有商品'allGoods',食品'foods',日常家居'everydayGoods',今日新品'todayNewGoods')
          this.$router.push({path: '/shopList', query: {type: item.link.split(':')[1], title: item.title}})
        }
      },
      refresh() {
        setTimeout(() => {
          this.init();
          this.$refs.detailScroller.reset({top: 0}, 500, 'ease');
        }, 2000)
      },
    },
    components: {
      Flexbox, FlexboxItem, Bottombar, Swiper, SwiperItem, Scroller, Spinner
    }
  }
</script>
<style scoped lang='less'>
  
  .shopPage {
    overflow-y: auto;
    .mrgb {
      padding-bottom: 110/40rem;
    }
    .shopTopImg {
      height: 400/40rem;
      width: 100%;
      border: none;
    }
    .shopMoneyFlexBox {
      background: #fff;
      margin-top: -15/40rem;
    }
    .shopMoneyBox {
      text-align: center;
      margin: 20/40rem 0;
      padding: 15/40rem 0;
      text-align: center;
      font-size: 30/40rem;
      .ft {
        color: #627984;
      }
      img {
        width: 48/40rem;
        height: 48/40rem;
        vertical-align: middle;
      }
      span {
        margin: 20/40rem;
      }
    }
    .lineRight {
      border-right: 2/40rem solid #d8d8d8;
    }
    .sortBox {
      background: #fff;
      padding: 30/40rem 0 10/40rem;
      margin: 20/40rem 0 0 0;
      text-align: center;
      font-size: 24/40rem;
      border-bottom: 1px solid #EFEFEF;
      img {
        width: 122/40rem;
        height: 122/40rem;
        border-radius: 3rem;
        /*margin-bottom: 15/40rem;*/
      }
      .title-bottom{
        margin-bottom: 20/40rem;
      }
    }
    .exchangeBox {
      padding-top: 25/40rem;
      background: #fff;
      margin-bottom: 20/40rem;
      font-size: 30/40rem;
      line-height: 45/40rem;
      .title {
        padding: 20/40rem 30/40rem;
        border-bottom: 2/40rem solid #f2f2f2;
      }
      .shopBox {
        box-sizing: border-box;
        text-align: center;
        margin:20/40rem;
        // height: 340/40rem;
        box-sizing: border-box;
        border: 1px solid #d1d1d1;
        box-shadow:0px 4px 12px -1px #4d4d4d;
            /*box-shadow: 0 0 10px #4d4d4d;*/
      }
      .bottomBox{
          line-height: 36/40rem;
          width: 90%;
          margin:0 auto;
          // background-color: #C7000A;
          color: #e60012;
          border-radius: 10/40rem 10/40rem 0 0;
          text-align: center;
          .desc {
            display: inline-block;
            font-size: 24/40rem;
            // width: 95/40rem;
            max-height: 72/40rem;
            color: #221815;
            overflow: hidden;
            word-break: break-all;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            // white-space: nowrap;
            text-overflow: ellipsis;
            text-align:left;
          }
          .joyMoney {
            display:inline-block;
            font-size: 24/40rem;
            display: block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align:left;
          }
        }
      .shopImg {
        width: 220/40rem;
        height: 220/40rem;
        margin-bottom: 16/40rem;
        padding-top: 40/40rem;
      }
    }
  }

  @media screen and (max-width: 340px) {
    .exchangeBox {
      margin-bottom: 40/40rem !important;
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
  #shopBanner .vux-swiper{
    height: 375/40rem!important;
  }
</style>

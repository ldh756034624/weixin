<template>
		<div class="page shopPage">
      <main>
        <swiper dots-position="center" auto dots-class="custom-bottom">
          <swiper-item class="swiper-demo-img"  v-for="(item, index) in shopTop" height="12.5rem" :key="index" @click.native='goLinkFn(item)'>
            <img :src="item.imgUrl">
          </swiper-item>
        </swiper>
        <flexbox :gutter="0" class='shopMoneyFlexBox'>
          <flexbox-item>
            <div class="shopMoneyBox lineRight">
              <img src="../../assets/img/shop/money.png"/>
              <span>酒元</span><i class='ft'>{{shopData.balance}}</i>
            </div>
          </flexbox-item>
          <flexbox-item>
            <router-link :to="{path:'/my/myOrder',query:{fromShop:true}}">
              <div class="shopMoneyBox">
                <img src="../../assets/img/shop/group_3.png"/>
                <span>兑换记录</span>
              </div>
            </router-link>
          </flexbox-item>
        </flexbox>
        <flexbox :gutter="0" wrap="wrap" class='sortBox'>
          <flexbox-item :span="1/4" v-for='item in navBanner' @click.native='goLinkFn(item)'>
            <div>
              <img :src="item.imgUrl"/>
              <p>{{item.title}}</p>
            </div>
          </flexbox-item>
        </flexbox>
        <section>
          <div class="exchangeBox" v-if='shopData.hotGoods'>
            <p class="title">大家都在兑</p>
            <flexbox :gutter="0" wrap="wrap" >
              <flexbox-item :span="1/2" class='shopLine' v-for='item in shopData.hotGoods'>
                <router-link :to="{path:'/shopDataile',query:{id:item.id}}">
                  <div class='shopBox'>
                    <p class="desc">{{item.name}}</p>
                    <p class="joyMoney"><span>{{item.price}}</span>酒元</p>
                    <img class='shopImg' :src="item.img"/>
                  </div>
                </router-link>
              </flexbox-item>
            </flexbox>
          </div>
          
        </section>
      </main> 
      <Bottombar :index="1"></Bottombar>
		</div>
</template>

<script>
import { Flexbox, FlexboxItem,Swiper, SwiperItem} from 'vux'
import Bottombar from '@/components/BottomBar'
export default {
  mounted() {
    this.setTitle('酒元商城');
    this.init()
  },
  data() {
    return {
      shopTop:[],
      navBanner:[],
      shopData:{},
    }
  },
  methods:{
    init(){
      this.$http.get('h9/store/home')
        .then((res)=>{
          if(res.data.code==0){
            this.shopData=res.data.data
            this.navBanner=this.shopData.banners.storeNavigationBanner
            this.shopTop=this.shopData.banners.convertStoreTopBanner
          }
        })
    },
    goLinkFn:function(item){
        if((item.link).indexOf('http')!=-1){
          window.open(item.link)
        }else{
          //所有商品'allGoods',食品'foods',日常家居'everydayGoods',今日新品'todayNewGoods')
          this.$router.push({path:'/shopList',query:{type:item.link.split(':')[1],title:item.title}})
        }
     },
  },
  components: {
    Flexbox, FlexboxItem,Bottombar,Swiper, SwiperItem
  }
}
</script>
<style scoped lang='less'>
  .shopPage{
    overflow-y: auto;
    .shopTopImg{
      height: 400/40rem;
      width: 100%;
      border:none;
    }
    .shopMoneyFlexBox{
      background: #fff;
      margin-top: -15/40rem;
    }
    .shopMoneyBox{
      text-align: center;
      margin: 20/40rem 0;
      padding: 15/40rem 0;
      text-align: center;
      font-size: 30/40rem;
      .ft{
        color: #627984;
      }
      img{
        width: 48/40rem;
        height: 48/40rem;
        vertical-align: middle;
      }
      span{
        margin: 20/40rem;
      }
    }
    .lineRight{
      border-right: 2/40rem solid #d8d8d8;
    }
    .sortBox{
      background: #fff;
      padding: 30/40rem 0;
      margin: 20/40rem 0;
      text-align: center;
      font-size: 24/40rem;
      img{
        width: 92/40rem;
        height: 92/40rem;
        border-radius: 3rem;
        margin-bottom: 15/40rem;
      }
    }
    .exchangeBox{
      background: #fff;
      margin-bottom: 110/40rem;
      font-size: 30/40rem;
      line-height: 45/40rem;
      .title{
        padding: 20/40rem 30/40rem;
        border-bottom: 2/40rem solid #f2f2f2;
      }
      .desc{
        font-size: 24/40rem;
      }
      .joyMoney{
        color: #627984;
      }
      .shopBox{
        padding: 16/40rem;
        height: 340/40rem;
        box-sizing:border-box;
        border-bottom: 2/40rem solid #f2f2f2;
      }
      .shopBox:nth-child(2n+1){
        border-right: 2/40rem solid #f2f2f2;
      }
      .shopImg{
        width: 220/40rem;
        height: 220/40rem;
        margin-bottom: 16/40rem;
        float: right;
      }
    }
  }
  @media screen and (max-width: 340px){
    .exchangeBox{
      margin-bottom: 140/40rem!important;
    }
  }
</style>
<style type="text/css" lang='less'>
  .shopPage{
    .vux-slider  .vux-indicator{
      bottom: 0;
    }
  }
</style>
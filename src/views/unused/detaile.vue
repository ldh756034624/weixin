<template>
  <div class="page publishUnused">
    <div class="content-wrap">
      <swiper  :show-dots=false v-show='showImg' v-model="goodsSwiperIndex" height="100%" class='bigImg'>
        <p class="closebigImg"><span class='closebigImgIcon' @click='showImg=false'></span></p>
        <swiper-item class="swiper-demo-img" v-for="(item, index) in detaileDatas.images" :key="index">
          <div class="cellBox"><img :src="item" ></div>
        </swiper-item>
        <div class="swiper-bar">
          <p class="current"><span class='numBggray'>{{goodsSwiperIndex+1}}/{{imagesLen}}</span></p>
        </div>
      </swiper>
      <scroller ref="scroller" class='overScroll' lock-x height="100%">
        <div class="scroller-wrap">
          <swiper v-model='swiperIndex' :show-dots=false @on-index-change="changeSwiper" class='detailminImg'>
            <swiper-item class="swiper-demo-img" v-for="(item, index) in detaileDatas.images" :key="index" @click.native='showbigImg(item,index)'>
            <span :style="{background: 'url(\''+item+'\') no-repeat center',backgroundSize:bgSize}" class='detaileImg'></span>
            </swiper-item>
            <div class="swiper-bar">
              <p class="current"><span class='numBggray'>{{swiperIndex+1}}/{{imagesLen}}</span></p>
            </div>
          </swiper>

          <section class="detailDescribe">
            <h4 class="wordBreak">{{detaileDatas.title}}</h4>
            <div class="addrText">
              <span>{{detaileDatas.city}}.{{detaileDatas.district}}</span>
              <div class="right">
                <span class="old">¥{{detaileDatas.originPrice | price2}}</span>
                <span class="now"><label>¥</label>{{detaileDatas.sellingPrice | price2}}</span>
              </div>
            </div>
            <article>
              <p class="font15 wordBreak">{{detaileDatas.content}}</p>
            </article>
          </section>
          <div class="detailuserBox">
          <div>
              <img :src='detaileDatas.avatar' class="detailuserImg">
              <div class="detailNickBox">
                  <p class="title">{{detaileDatas.nickname}}</p>
                  <p class="grayFont12">交易次数:{{detaileDatas.transactionTimes}}次</p>
                  <p class="grayFont12">最近活跃:{{detaileDatas.lastLoginTime}}</p>
              </div>
              </div>
              <div class="detailCard">
                  <p><span class='creditIcon'></span>芝麻信用 {{detaileDatas.zmEvaluate}}</p>
              </div>
          </div>
        </div>
      </scroller>

    </div>
    <footer class='footerBtnBox'  v-show='!showImg&&detaileDatas.sellerUserId!=userId'>
        <div class="footerStar">
          <Collection :datas='collecData' class='detailStar'></Collection>
        </div>
        <!-- <button class="footerBtn unUsedBtn">咨询</button> -->
        <button class="footerBtn saleleftBtn"><downloadApp :text="text"></downloadApp></button>
        <button class="footerBtn salerightBtn" @click='gobuyFn'>购买</button>
      </footer>
  </div>
</template>

<script>
import {Group, XInput, Swiper, SwiperItem, Scroller} from 'vux'
import Collection from '@/components/collection'
import downloadApp from '@/components/downloadApp'
// var url = require('aUrl')
export default {
  mounted(){
    this.setTitle('宝贝详情');
    this.init();
  },
  data () {
    return {
      goodId:this.$route.query.goodId,
      tableId:this.$route.query.tableId,
      userId: 0,
      type:'',
      detaileDatas:{},
      swiperIndex:0,
      currentBigIndex:1,
      imagesLen:0,
      collecData:{},
      showImg:false,
      text:"下载app咨询",
      lastActive:'',
      bgSize:'contain',
      goodsSwiperIndex:0,
    }
  },
  methods:{
    init(){
      let self = this
      //tableId为1闲置,2为拍卖,3是捐赠
      // console.log(this.$refs.imgSwiper)
      if(self.tableId==1){
        self.type='idleGoods'
      }else if(self.tableId==2){
        self.type='auctions'
      }else{
        self.type='donation'
      }
      if (localStorage.getItem('_user')) {
        self.userId = JSON.parse(localStorage.getItem('_user')).userId
      }
      self.$http.get('/sh/ja/v1/'+self.type+'/'+self.goodId+'/detail')
      .then(function(res) {
        if(res.data.statusCode==0){
          self.detaileDatas=res.data.data;
          self.imagesLen=self.detaileDatas.images.length
          //收藏组件数据
          self.collecData.goodId=self.goodId;
          self.collecData.status=self.detaileDatas.favoritesStatus;
          //self.collecData.tableId=self.tableId;
          self.$nextTick(()=>{
            self.$refs.scroller.reset();
          });
        }
      });
      this.share();
    },
    showbigImg(item,index){
      console.log(item)
      let self=this;
      self.showImg=true;
      self.goodsSwiperIndex=index;
      self.currentBigIndex=index+1;
    },
    share(){
      this.mxShare('/sh/ja/v1/share/config',{type:'idleGoods',id:this.$route.query.goodId});   //?type=idlegoods&id=33'
    },
    changeSwiper(index){
      this.swiperIndex=(index+1);
    },
    gobuyFn(){
      var userdatas = JSON.parse(localStorage.getItem('_user'));
      if(!userdatas){
         this.$router.push({path: '/login',query:{path:this.$route.path,goodId:this.$route.query.goodId,tableId:this.$route.query.tableId}})
      }else{
          if (this.detaileDatas.reservationPerson) {
            if (JSON.parse(localStorage.getItem('_user')).userId == this.detaileDatas.reservationPerson) {
              this.$router.push({path:'/account/orderdetail',query:{ orderId:this.detaileDatas.reservationOrderId}})
            } else {
              _g.toastMsg('error', '商品已被其他买家下单')
            }
            return
          }else{
            this.$router.push({path:'/unused/buy',query:{ goodsId:this.goodId}})
          }
      }
      
    }
  },
   components: {
    Group,
    XInput,
    Swiper,
    SwiperItem,
    Collection,
    downloadApp,
    Scroller
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  .content-wrap,.bigImg{
    height: 100%
  }
  .overScroll{
    overflow: scroll!important;
  }
  .bigImg{
    background-color: #222;
  }
  .cellBox{
    display: table-cell;
    vertical-align: middle;
  }
  .cellBox img{
    width: 100%;
    vertical-align: middle;
  }
  .closebigImg{
    position: absolute;
    z-index: 9;
    width: 100%;
    text-align: right;
    margin-top: 20/40rem;
  }
  .closebigImgIcon{
    background: url('../../assets/img/mian/xx@2x.png') no-repeat center 100%;
    display: inline-block;
    background-size: 100%;
    width: 35/40rem;
    height: 35/40rem;
    margin-right: 20/40rem;
  }
  .numBggray{
    background: rgba(216,216,216,0.7);
    color: #fff;
    display: inline-block;
    width: 80/40rem;
    text-align: center;
  }
  .scroller-wrap{
    padding-bottom: 120/40rem;
  }
  .content-wrap{
    position: absolute;
    top: 0;
    bottom: 98/40rem;
    left: 0;
    width: 100%;
    overflow: hidden;
  }
  .addrText{
    margin-top: 16/40rem;
    margin-bottom: 20/40rem;
    padding-left: 34/40rem;
    color: #999;
    font-size: 22/40rem;
    background-image: url('../../assets/img/index/dingwei@2x.png');
    background-repeat: no-repeat;
    background-position: left center;
    background-size: 24/40rem 33/40rem;
    .right{
      float: right;
      .old{
        font-size: 22/40rem;
        margin-right: 10/40rem;
        text-decoration: line-through;
      }
      .now{
        label{
          font-size: 24/40rem;
        }
        font-size: 34/40rem;
        color: #fa5b5b;
      }
    }
  }
  .font15{
    font-size: 30/40rem;
  }
  .detaileImg{
    display: inline-block;
      width: 100%;
      height: 100%;
      background-size: contain;
  }
  .swiper-bar{
    position: absolute;
    text-align: right;
    bottom: 20/40rem;
    font-size: 28/40rem;
    width: 100%;
    right: 30/40rem;
  }
  .current{
    font-size: 32/40rem;
    color:#fff;
  }
  .detailDescribe{
    padding: 30/40rem;
    background-color: #fff;
    line-height: 48/40rem;
    font-size: 32/40rem;
  }
  .detailuserImg{
    width: 78/40rem;
    height: 78/40rem;
    border-radius: 200/40rem;
    vertical-align: middle;
    margin-right: 20/40rem;
    vertical-align:middle
  }
  .detailuserBox{
    padding:20/40rem 0;
    background-color:#fff;
    margin-top:10/40rem;
    vertical-align:middle;
    display: flex;
    justify-content: space-around;
  }
  .detailNickBox{
    display:inline-block;
    vertical-align:middle;
    font-size: 30/40rem;
  }
  .detailCard{
    float:right;
    font-size: 30/40rem;
    margin-top:30/40rem;
    color:#29AB91;
  }
  .creditIcon{
      background:url('../../assets/img/mian/credit.png') no-repeat center;
      background-size:100%;
      display: inline-block;
      width: 24/40rem;
      height:28/40rem;
      margin-right: 0.3rem;
    }
  .grayFont12{
    color:#999;
    font-size:24/40rem;
  }
  .footerBtnBox{
    position:absolute;
    bottom:0;
    display:flex;
    width:100%;
    background-color: #fff;
  }
  .footerStar{
    flex:1;
    height: 98/40rem;    //flex子元素高度100% hack
  }
  .footerBtn{
    color:#fff;
    border:none;
    line-height: 98/40rem;
  }
  .saleleftBtn{
    flex:3;
    background-color:#38446A;
    font-size: 16px;
  }
  .salerightBtn{
    flex:3;
    background-color:#fff;
    color:#38446A;
    font-size: 16px;
  }
  .title {
    max-width: 280/40rem;
    display:block;
    white-space:nowrap; 
    overflow:hidden; 
    text-overflow:ellipsis;
    /*text-overflow: ellipsis;
    max-height: 28px;
    -webkit-line-clamp: 1;
    -ms-line-clamp: 1;
    -moz-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    -ms-box-orient: vertical;
    box-orient: vertical;
    display: -webkit-box;
    display: -ms-box;
    display: -moz-box;
    display: box;*/
  }
  .detailStar{
    margin-top: -25/40rem;
    background-color: #fff;
    height: 120/40rem!important;
    width: 110/40rem!important;
    box-shadow:0px 0 0px transparent, /*左边阴影*/  
              2px 0 10px #ccc, /*右边阴影*/  
              0 -1px 10px #ccc, /*顶部阴影*/  
              0 0px 0px #fff; /*底边阴影*/
  }
</style>

<style lang="less">
  .detailminImg{
    .vux-swiper{
      height: 712/40rem !important;
    }
  }
  .bigImg  .vux-swiper-item{
    display:table;
  }
</style>

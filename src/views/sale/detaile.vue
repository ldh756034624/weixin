<template>
  <div class="page publishSale">
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
         <scroller ref="detailScroller" class='overScroll' lock-x height="100%" 
            :pulldown-config="pulldefaultConfig"
            use-pulldown
            @on-pulldown-loading="refresh"
            :pulldown-status="pulldownStatus"
            @input="getCurrentValue">
            <div class="scroller-wrap">
         <swiper height='300px' :show-dots=false @on-index-change="changeSwiper" class='detailminImg'>
            <swiper-item class="swiper-demo-img" v-for="(item, index) in detaileDatas.images" :key="index"  @click.native='showbigImg(item,index)'>
                <!-- <img :src="item" class="detaileImg" > -->
                <span :style="{background: 'url(\''+item+'\') no-repeat center',backgroundSize:bgSize}" class='detaileImg'></span>
            </swiper-item>
            <div class="swiper-bar">
              <p class="current"><span class='numBggray'>{{currentIndex}}/{{imagesLen}}</span></p>
            </div>
          </swiper>
           <section class="detailDescribe">
            <h4 class="wordBreak">{{detaileDatas.title}}</h4>
            <!-- <p>当前价<span class='redFont'>￥{{detaileDatas.auctionCurrentPrice}}</span></p> -->
            <div class="addrText">
              <!-- <img src='../../assets/img/index/dingwei@2x.png' class="detailAdressIcon"> -->
              <span>{{detaileDatas.city}}.{{detaileDatas.district}}</span>
              <div class="right">
                当前价
                <span class="now"><label>¥</label><span>{{detaileDatas.auctionCurrentPrice | price2}}</span></span>
              </div>
            </div>
          </section>
          <div class="detailuserBox">
              <div class="recordText">
                  <span class='recordTimes'>出价记录 <span style='color:#222'>({{detaileDatas.auctionOfferCount}}次)</span></span>
                  <span class='right' v-show='showresidueTime'>剩余 <clocker style='color:#222' :time="residueTime"></clocker>{{saleText}}</span>
                  <span class='right' v-show='!showresidueTime'>结束</span>
              </div>
              <div class="recordContBox" v-if='showSaleRecorde==true'>
                <div v-for='(item,index) in detaileDatas.bidRecords' class="recordBox">
                     <img :src='item.avatar' class="detailuserImg">
                     <span class='nickname ellipsis'>{{item.nickName}}</span>
                     <span v-if='index==0' class='recordBtnRed'>领先</span>
                     <span v-if='index!=0' class='recordBtn'>出局</span>
                     <span class='recordPrice redFont ellipsis'>￥{{item.bidPrice | price2}}</span>
                </div>
              </div>
          </div>
          <div class="saildetailCont">
            <p class="">{{detaileDatas.content}}</p>
          </div>

          <div v-transfer-dom>
            <popup v-model="paymoney" class="payMoneyBox">
              <p class="nowPrice">当前价 <span>￥</span><span>{{detaileDatas.auctionCurrentPrice}}</span></p>
              <div class="moneyChooseBox">
                  <span class='sub' v-if='bidPrice-detaileDatas.offsetPrice>=detaileDatas.auctionCurrentPrice' @click='bidPrice=bidPrice-detaileDatas.offsetPrice'>{{'-'+detaileDatas.offsetPrice}}</span>
                  <span class='sub' v-if='bidPrice-detaileDatas.offsetPrice<detaileDatas.auctionCurrentPrice' >{{'-'+detaileDatas.offsetPrice}}</span>
                  <span class='moneyTex'><span>￥{{bidPrice}}</span></span>
                  <span class='add' @click='bidPrice=bidPrice+detaileDatas.offsetPrice'>{{'+'+detaileDatas.offsetPrice}}</span>
              </div>
              <div class="surePayBtnBox">
                  <button class="BlueBtn" @click='surePay'>确定出价</button>
              </div>
            </popup>
          </div>

            <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down downstyle xxxxxx">
              <span v-show="pulldownStatus === 'default'"></span>
              <span v-show="pulldownStatus === 'up'">松开刷新</span>
              <span v-show="pulldownStatus === 'loading'">正在刷新</span>
            </div>
          </div>  
          </scroller>
      </div>
      <footer class='footerBtnBox' v-show='!showImg&&detaileDatas.sellerUserId!=userId'>
        <span class="footerStar">
          <Collection :datas='collecData' class='detailStar'></Collection>
        </span>
        <button class="footerBtn saleleftBtn"><downloadApp :text="text"></downloadApp></button>
        <button class="footerBtn salerightBtn" @click='bidPriceFn'>出价</button>
      </footer>
  </div>
</template>

<script>
import {  Group, XInput,Swiper, SwiperItem,TransferDom,Popup,Clocker,dateFormat,Scroller} from 'vux'
import Collection from '@/components/collection'
import downloadApp from '@/components/downloadApp'
// var url = require('aUrl')
export default {
  directives: {
    TransferDom
  },
  mounted(){
    let self=this;
    self.setTitle('拍卖详情');
    self.init();
  },
  data () {
    return {
      goodId:this.$route.query.goodId,
      tableId:this.$route.query.tableId,
      type:'',
      userId: 0,
      detaileDatas:{},
      currentIndex:1,
      currentBigIndex:1,
      imagesLen:0,
      paymoney:false,
      bidPrice:0,
      residueTime:'2017-05-20 12:00:00',
      showresidueTime:true,
      collecData:{},
      showImg:false,
      saleText:'',
      text:"下载app咨询",
      showSaleRecorde:false,
      bgSize:'contain',
      goodsSwiperIndex:0,
    }
  },
  methods:{
    init(){
      let self=this;
      //tableId为1闲置,2为拍卖,3是捐赠
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
            self.bidPrice=self.detaileDatas.auctionCurrentPrice

            if(self.detaileDatas.bidRecords.length>0){
              self.showSaleRecorde=true
            }
            var timestamp = Date.parse(new Date());
            if(timestamp<self.detaileDatas.auctionStartDate){
              self.saleText='开拍'
              self.residueTime=self.detaileDatas.auctionStartTime+'';
            }else if(timestamp>self.detaileDatas.auctionStartDate && timestamp < self.detaileDatas.auctionEndDate){
              self.saleText='结束'
              self.residueTime=self.detaileDatas.auctionEndTime+'';
            }else{
              self.showresidueTime=false
            }


            //收藏组件数据
            self.collecData.goodId=self.goodId;
            self.collecData.status=self.detaileDatas.favoritesStatus;
          }
          self.$nextTick(()=>{
            self.listenScroller();
            self.$refs.detailScroller.reset({top: 0},500, 'ease');
          });
        })

    },
    showbigImg(item,index){
      console.log(item)
      let self=this;
      self.showImg=true;
      self.goodsSwiperIndex=index;
    },
    changeSwiper(index){
      let self=this;
      self.currentIndex=(index+1);
    },
     getCurrentValue(value){
      this.pullupStatus = value.pullupStatus;
      this.pulldownStatus = value.pulldownStatus;
    },
    listenScroller(){
       this.$nextTick(()=>{
       this.$refs.detailScroller._xscroll.on('scroll',(e)=> {
          let scrolly = this.$refs.detailScroller._xscroll.getScrollTop();
          this.$refs.detailScroller._xscroll.resetSize()
        });
      });
     },
    refresh () {
      setTimeout(() => {
        this.init();
      }, 2000)
    },
    surePay(){
        let self=this;
        self.$http.post('/sh/ja/v1/auction/bid/'+self.goodId+'/'+self.bidPrice)
        .then(function(res) {
          if(res.data.statusCode==0){

            self.init();
          }else{
             self.$vux.toast.show({
                text:  res.data.msg,
                type: 'text',
            })
          }
           self.paymoney=false;
        })
    },
    bidPriceFn(){
      let self=this;
      if(self.saleText=='开拍'){
          _g.toastMsg('error', '拍卖还未开始')
          return;
      }
      if (self.residueTime < dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')) {
        _g.toastMsg('error', '拍卖已结束')
        return
      }
      var userdatas = JSON.parse(localStorage.getItem('_user'));
      if(!userdatas){
         this.$router.push({path: '/login',query:{path:this.$route.path,goodId:this.$route.query.goodId,tableId:this.$route.query.tableId}})
      }else{
          if(self.detaileDatas.payEnsure==false){
            self.$router.push({path:'/sale/payensure',query:{goodId:self.goodId,tableId:self.tableId}})
          }else{
            self.paymoney=true;
          }
      }
      

    }
  },
   components: {
    Group,
    XInput,
    Swiper,
    SwiperItem,
    TransferDom,
    Popup,
    Clocker,
    Collection,
    dateFormat,
    Scroller,
    downloadApp
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
  .saildetailCont{
    background-color: #fff;
    font-size: 28/40rem;
    padding: 20/40rem 35/40rem;
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
  .bigImg{
    background-color: #222;
  }
  .scroller-wrap{
    padding-bottom: 120/40rem;
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
    .publishSale{
      overflow: auto;
    }
    .content-wrap{
    position: absolute;
    top: 0;
    bottom: 98/40rem;
    left: 0;
    width: 100%;
    overflow: hidden;
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
      right: 60/40rem;
    }
    .current{
      color:#fff;
    }
    .detailDescribe{
      padding: 30/40rem;
      background-color: #fff;
      line-height: 48/40rem;
      font-size: 32/40rem;
    }
     .detailDescribe p{
      margin-top: 10/40rem;
     }
     .addrText{
    margin-top: 16/40rem;
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
        color: #F58237;
      }
    }
  }
  .detailuserImg{
    width: 90/40rem;
    height: 90/40rem;
    border-radius: 200/40rem;
    vertical-align: middle;
    margin-right: 20/40rem;
    vertical-align:middle
  }
  .detailuserBox{
    padding:20/40rem 40/40rem;
    background-color:#fff;
    margin:20/40rem 0 20/40rem;
    vertical-align:middle;
    font-size: 30/40rem;
  }
  .detailNickBox{
    display:inline-block;
    vertical-align:middle;
  }
  .footerBtnBox{
    position:fixed;
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
  .recordBtnRed,.recordBtn{
    width: 172/40rem;
    height: 60/40rem;
    line-height: 60/40rem;
    color: #fff;
    border-radius: 5px;
    text-align: center;
  }
  .recordBtnRed{
    background-color:#FA5B5B;
  }
  .recordBtn{
    background-color: #C5C5C5;
  }
  .recordBox{
    margin: 20/40rem 0;
  }
  .recordContBox{
    margin-top: 15/40rem;
    border-top: 1px solid #e2e2e2;
  }
  .recordBox span{
    display: inline-block;
    vertical-align: middle;
  }
  .nickname{
    width: 4.5rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .recordText{
    padding: 15/40rem 0 15/40rem;
    font-size: 26/40rem;
    color: #A5A5A5;
   
  }
  .recordTimes{
  }
  .recordPrice{
    float: right;
    height: 90/40rem;
    line-height: 90/40rem;
    width: 4rem;
    text-align: right;
  }
  .payMoneyBox{
    position: fixed;
    background-color: #fff;
    text-align: center;
    width: 100%;
    bottom: 0;
  }
  .nowPrice{
    border-bottom: 1px solid #e2e2e2;
    padding: 40/40rem 0;
  }
  .surePayBtnBox{
    width:250/40rem;
    margin: 0 auto;
  }
  .surePayBtnBox button{
    height: 94/40rem;
    margin-bottom: 60/40rem;
  }
  .moneyChooseBox{
    text-align: center;
    margin: 30/40rem 0 72/40rem;
  }
  .moneyChooseBox span{
    display: inline-block;
    vertical-align: middle;
  }
  .moneyTex{
    width: 240/40rem;
    font-size: 60/40rem;
    color: #999;
  }
  .add,.sub{
    width: 152/40rem;
    height: 152/40rem;
    line-height: 152/40rem;
    font-size: 40/40rem;
  }
  .sub{
    background:url('../../assets/img/mian/subtracter.png') no-repeat center;
    background-size: 100%;
    color: #999;
  }
  .add{
    background:url('../../assets/img/mian/add.png') no-repeat center;
    background-size: 100%;
    color: #fff;
  }
  @media screen and (max-width: 330px){
    .recordText{
      font-size: 18/40rem;
    }
  }
  .downstyle{
    position: absolute; 
    width: 100%; 
    top: -3.4rem; 
    text-align: center;
    font-size: 28/40rem;
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

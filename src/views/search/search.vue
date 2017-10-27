<template>
  <div class="page search">
    <flexbox :margin-left='0' class="search-input">
      <flexbox-item class="back" @click.native="goBack()"><div>&nbsp;</div></flexbox-item>
      <flexbox-item class="input">
      <div class="input-wrap">
        <form target="frameFile" id="search_from" action="#" > 
            <input type="search" id="searchInput" placeholder="包" v-model="keyword"/> 
            <iframe name='frameFile' style="display: none;"></iframe>
          </form>
      </div>
      </flexbox-item>
      <flexbox-item class="btn"><div  @click="doSearch">筛选</div></flexbox-item>
    </flexbox>
    <flexbox :margin-left='0' class="searh-filter">
      <flexbox-item class="option filterOption" :class="[filtersAcitve==1 ? 'searchActive':'']">
        <div class="city">
          {{value}}
          <img src="../../assets/img/search/areaGray.png">
          <!-- <span class='downIcon'></span> -->
          <x-address class="address" title="" :value.sync="address" raw-value :list="addressData" @input="addressChange" @on-hide="logHide"></x-address>
        </div>
      </flexbox-item>
      <flexbox-item class="option filterOption " :class="[filtersAcitve==2 ? 'searchActive':'']" @click.native='initFilter(1,2)'>综合</flexbox-item>
      <flexbox-item class="option filterOption" :class="[filtersAcitve==3 ? 'searchActive':'']" @click.native='initFilter(1,3)'>时间</flexbox-item>
      <flexbox-item class="option filterOption" :class="[filtersAcitve==4 ? 'searchActive':'']" @click.native='initFilter(1,4)'>距离</flexbox-item>
      <flexbox-item class="option filterOption" :class="[priceAcitve ? 'searchActive':'']" @click.native='initFilter(1,5)'>价格
        <span class='priceIcon' v-if='showPriceIcon1==false && showPriceIcon2==false'></span>
        <span class='priceIcon1' v-show='showPriceIcon1'></span>
        <span class='priceIcon2' v-show='showPriceIcon2'></span>
      </flexbox-item>
    </flexbox>
    <div class="content scroll-wrap" v-show='hasItem'>
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
        <div>
        <flexbox  :gutter="0" wrap="wrap" class="list">
          <flexbox-item class="option" :span='1/2' v-for='item in searchData'>
            <img class="thumb" :src="item.images[0]">
            <div class="title font-one-line-ellipsis">{{item.title}}</div>
            <div class="price" v-if="item.goodsType=='idleGoods'">¥ {{item.sellingPrice | price2}}</div>
            <div class="price" v-if="item.goodsType=='auctions'">¥ {{item.auctionCurrentPrice | price2}}</div>
            <div class="price" v-if="item.goodsType=='donation'"></div>
            <div class="location">
              <span class='searchArea'>{{item.city}}·{{item.district}}</span>
              <span v-if="item.goodsType=='idleGoods'" class="idleGoodsIcon">闲置</span>
              <span v-if="item.goodsType=='auctions'" class="auctionsIcon">拍卖</span>
              <span v-if="item.goodsType=='donation'" class="donationIcon">捐赠</span>
            </div>
          </flexbox-item> 
        </flexbox>
        </div>
        <pull-header-footer :status-up="pullupStatus" :status-down="pulldownStatus"></pull-header-footer>
      </scroller>
    </div>
     <div v-transfer-dom>
          <popup v-model="showPriceChoose" class='priceChooseBox'>
            <calculate ref='calculate' v-on:listenToChildCalcu='showParamsFormChild'></calculate>
          </popup>
     </div> 
     <div class="searchnoItem" v-show='!hasItem'>
        <blankPage  :text='text2' v-show='!hasItem' :images='blankImg2'> </blankPage>
    </div>
  </div>
</template>

<script>
import {Flexbox, FlexboxItem, XAddress, ChinaAddressData , Scroller,Popup,TransferDom} from 'vux'
import value2name from 'vux/src/filters/value2name'
import PullHeaderFooter from '@/components/pullHeaderFooter'
import Calculate from '@/components/calculate'
import blankPage from '@/components/blankPage'
export default {
  directives: {
    TransferDom
  },
  mounted(){
    let self=this;
    self.setTitle('搜索');
    self.initGetArea();
    document.onkeyup=function(e){
      if(e.keyCode==13){
        self.searchTile=self.keyword;
        self.initFilter(1,self.type);
      }
    }
  },
  data () {
    return {
      addressData: ChinaAddressData,
      address: ['广东省', '深圳市', '南山区'],
      value: '区域',
      getAddress:'',
      keyword:this.$route.query.title,
      searchTile:this.$route.query.title,
      showPriceChoose:false,
      searchData:{},
      showPriceIcon1:false,
      showPriceIcon2:false,
      getAccuracy:true,
      hasItem:true,
      text2:'没有搜到相关商品哦!',
      blankImg2:require('../../assets/img/blank/search.png'),
      isPriceSort:false,
      searchParams:{
        area:'' ,
        city:'',
        provice:'',
        maxPrice:'',
        minPrince:'',
        sort:'',
        latitude:'',
        longitude:'',
        title:'',
        type:'',
      },
      type:2,
      filtersAcitve:2,
      priceAcitve:false,
    }
  },
  methods:{
    showParamsFormChild:function(data){
      let self=this;
      if(data==false){
        self.showPriceChoose=false
      }
      self.searchParams.maxPrice=self.$refs.calculate.maxPrice
      self.searchParams.minPrince=self.$refs.calculate.minPrice
      self.initFilter(1,self.type)
    },
    initGetArea:function(){
      let self=this;
      if(navigator.geolocation){
          var geolocation = new BMap.Geolocation();
          geolocation.getCurrentPosition(function (position) {
              if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                let accuracy = position.accuracy;
                //let accuracy = false;
                if(!accuracy){   //用户拒绝
                  self.getAccuracy=false;
                  self.initFilter(1,2);
                  return;
                }else{
                  self.searchParams.latitude = position.point.lat;
                  self.searchParams.longitude = position.point.lng;
                  self.initFilter(1,2);
                }
              }
              
          });
      }
      
    },
    initFilter(nowPage,type){
        let self=this;
      if (nowPage == 1) {
        self.searchData = []
      }
     
      if(typeof(type)=='undefined'){
        type=parseInt(self.type)
      }
      if(type!=5){
        self.type=type
        self.filtersAcitve=type;
        self.showPriceIcon2=false
        self.showPriceIcon1=false
        self.priceAcitve=false;
      }else{
        self.isPriceSort=!self.isPriceSort;
        self.priceAcitve=true;
        if(self.isPriceSort){
          self.searchParams.sort='asc'
          self.showPriceIcon2=true
          self.showPriceIcon1=false
        }else{
          self.searchParams.sort='desc'
          self.showPriceIcon1=true
          self.showPriceIcon2=false
        }
        
      }
      if(self.type==1){
        self.searchParams.provice=self.getAddress[0]
        self.searchParams.city=self.getAddress[1]
        self.searchParams.area=self.getAddress[2]
      }
      self.searchParams.title=self.searchTile
      if(self.getAccuracy==false && self.type=='2' || self.getAccuracy==false && self.type=='4'){ //没有定位的综合,距离搜索
        self.searchParams.type='3'
      }else{
        self.searchParams.type=self.type //1地区2综合3时间4距离
      }
      self.$http.post('/sh/ja/v1/search/findgoods?page='+nowPage+'&limit=10', self.searchParams)
        .then(function(res) {
          if(res.data.statusCode==0){
            if(res.data.data.data){
              self.hasItem=true;
              
              self.searchData=res.data.data.data;
              self.searchData = [...self.searchData, ...res.data.data.data]
              
              self.page.totalpage = res.data.data.totalpage;
              if(res.data.data.hasNext){
                  self.page.currPage++;
              }
              self.page.hasNext = res.data.data.hasNext;
            }else{
              self.hasItem=false;
            }
          } else {
            self.$vux.toast.show({
              text: res.data.msg,
              type: 'text',
            })
          }
          self.$nextTick(()=>{
            self.$refs.detailScroller.donePullup();
            if(!self.page.hasNext){
              self.$refs.detailScroller.disablePullup();
            }
            if (res.data.currPage==1) {
              self.$refs.detailScroller.reset({top: 0},500, 'ease');
            }
          });
        })
    },
    logHide(str){
      let self=this;
      if(str==true){
        self.initFilter(1,1)
        this.value = self.getAddress[2];
      }
    },
    addressChange(val){
      let self=this;
      let address = value2name(val,ChinaAddressData).split(" ");
      self.getAddress=address
      console.log(address)
      
    },
    loadMore () {
      let self=this;
      if(this.page.hasNext){
        setTimeout(() => {
          self.initFilter(this.page.currPage,self.type)
        }, 2000)
      }
    },
    refresh () {
      let self=this;
      setTimeout(() => {
        self.initFilter(1,self.type);
      }, 2000)
    },
    goBack:function(){
      history.go(-2) 
    },
    doSearch(){
      let self=this;
      self.showPriceChoose=true;
    },
  },
  components: {
    Flexbox,FlexboxItem,XAddress,ChinaAddressData,Scroller,PullHeaderFooter,Calculate,Popup,TransferDom,blankPage
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  .scroll-wrap{
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
    top: 5rem;
    overflow: hidden;
  }
  #searchInput{
    font-size: 28/40rem;
  }
  .search-input{
    padding: 18/40rem 0;
    background-color: #fafdfd;
    height: 56/40rem;
  }
  .searchActive{
    color: #38446a;
  }
  .location span{
    vertical-align: middle;
  }
  .searchArea{
    width: 220/40rem;
    display:inline-block;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .downIcon{
    display: inline-block;
    width: 21/40rem;
    height: 12/40rem;
    vertical-align: top;
    margin-top: 36/40rem;
    background:url('../../assets/img/search/areaGray.png') no-repeat; 
    background-size:100%; 
  }
  .searchActive .downIcon{
    background:url('../../assets/img/search/down.png') no-repeat; 
    background-size:100%; 
  }
  .priceIcon,.priceIcon1,.priceIcon2{
    display: inline-block;
    width: 20/40rem;
    height: 30/40rem;
    vertical-align: top;
    margin: 30/40rem 0 0 10/40rem;
  }
  .priceIcon{
    background:url('../../assets/img/search/searchGray.png') no-repeat; 
    background-size:100%; 
  }
  .priceIcon1{
    background:url('../../assets/img/search/priceDown.png') no-repeat; 
    background-size:100%; 
  }
  .priceIcon2{
    background:url('../../assets/img/search/priceUp.png') no-repeat; 
    background-size:100%; 
  }
  .content{
    .list{
      margin-top: 12/40rem;
      .option:nth-child(2n){
        padding-left:6/40rem;
      }
      .option:nth-child(2n+1){
        padding-right:6/40rem;
      }
      .option{
        background-color: #fff;
        box-sizing:border-box;
        .thumb{
          width: 100%;
          height: 370/40rem;
        }
        .title{
          padding: 16/40rem 20/40rem 0 20/40rem;
          font-size: 28/40rem;
          color: #0f0f0f;
        }
        .price{
          padding-top: 10/40rem;
          padding-left: 20/40rem;
          color: #fa5b5b;
          font-size: 30/40rem;
        }
        .location{
          margin-top: 10/40rem;
          padding-left: 36/40rem;
          margin-bottom: 20/40rem;
          color: #999;
          font-size: 20/40rem;
          background-image: url('../../assets/img/search/location.png');
          background-repeat: no-repeat;
          background-size: 17/40rem 24/40rem;
          background-position: 12/40rem center;
        }
      }
    }
  }
  .searchnoItem{
    position: fixed;
    width: 100%;
    height: 100%;
  }
  .idleGoodsIcon,.auctionsIcon,.donationIcon{
    display: inline-block;
    width: 92/40rem;
    height: 42/40rem;
    line-height: 42/40rem;
    text-align: center;
    font-size: 24/40rem;
  }
  .idleGoodsIcon{
    background: url('../../assets/img/search/idleGoodsIcon.png') no-repeat center;
    background-size: 100%;
    color: #03a0F0;
  }
  .auctionsIcon{
    background: url('../../assets/img/search/auctionsIcon.png') no-repeat center;
    background-size: 100%;
    color: #fecd51;
  }
  .donationIcon{
    background: url('../../assets/img/search/donationIcon.png') no-repeat center;
    background-size: 100%;
    color: #ff5060;
  }
</style>
<style lang='less'>
  .priceChooseBox{
    background-color: rgba(0,0,0,0)!important;
  }
  .page.search{
    background-color: #f0f0f0;
    .search-input{
      .vux-flexbox-item{
        height: 56/40rem;
        line-height: 56/40rem;
        margin-left: 0 !important;
        flex: initial;
        &.back{
          width: 78/40rem !important;
          background-image: url('../../assets/img/search/back.png');
          background-repeat: no-repeat;
          background-size: 18/40rem 32/40rem;
          background-position: center;
        }
        &.input{
          flex: 1;
          .input-wrap{
            border: 1.2/40rem solid #dcdcdc;
            border-radius: 8/40rem;
            height: 100%;
            font-size: 28/40rem;
            background-image: url('../../assets/img/search/search.png');
            background-repeat: no-repeat;
            background-size: 28/40rem;
            background-position: 24/40rem center;
            padding-left: 66/40rem;
            overflow: hidden;
            input{
              outline: none;
              width: 100%;
              height: 100%;
              border: none;
            }
          }
        }
        &.btn{
          width: 110/40rem;
          text-align: center;
          font-size: 30/40rem;
        }
      }
    }
    .searh-filter{
      background-color: #fafdfd;
      color: #999;
      .vux-flexbox-item{
        margin-left: 0 !important;
        &.option{
          font-size: 30/40rem;
          text-align: center;
          height: 92/40rem;
          line-height: 92/40rem;
          .city{
            position: relative;
            overflow: hidden;
            height: 2.3rem;
            img{
              margin-left: 14/40rem;
              width: 18/40rem;
              vertical-align: top;
              margin-top: 42/40rem;
            }
            .address{
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              opacity: 0;
            }
          }
        }
      }
    }
  }
</style>

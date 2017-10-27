<template>
	<div class="page">
      <main class='arbitrationDetailMain'>
          <section class='arbitrationDetailBox'>
              <p class="redFont">{{arbitratDetaileData.tip}}</p>
              <div class="arbitrationDetailMsg" v-for='item in arbitratDetaileData.arbitrationDetailVOList'>
                  <p class='arbitDetaiTime'><span>{{item.reqDate}}</span></p>
                  <div class="arbitDetaiUserDesc">
                      <span class='arbitrationUser' >
                          <i v-if="item.userType=='2'">买家:</i>
                      </span>
                      <div class="flex1" :class="[item.userType=='1' ? 'alignR':'']">
                          {{item.content}}                                    
                      </div>
                      <span class='arbitrationUser' style='text-align:right'>
                        <i v-if="item.userType=='1'">:卖家</i>
                      </span>
                  </div>
                  <!-- <ImgUpload :maxlength="4" :uploadurl="uploadurl"  :imagedatas='images' ref="uploadImg"></ImgUpload> -->
                  <div>
                    <div class='arbitratUpload'> 
                      <span v-for='(itemImg,index) in item.imgs' @click='showBigImgFn(item.imgs,index)'>
                        <i :style="{backgroundImage: 'url('+itemImg+')',backgroundSize:'cover',backgroundPosition:'center'}"></i>
                      <!-- <img :src='itemImg'> -->
                      </span>
                    </div>
                  </div>
              </div>
          </section>
          <div class="arbitDetaiBtnBox">
            <router-link  :to="{ path: '/back/arbitration', query: { orderId: orderId}}">  
            <x-button class=" BlueBtn">我要举证</x-button>
            </router-link>
          </div>
      </main>
      <swiper :show-dots=false v-show='showImg' v-model="swiperIndex" height="100%" class='bigImg'>
        <p class="closebigImg"><span class='closebigImgIcon' @click='showImg=false'></span></p>
        <swiper-item class="swiper-demo-img" v-for="(item, index) in bigImageList" :key="index">
         <div class="cellBox"><img :src="item" ></div>
        </swiper-item>
        <div class="swiper-bar">
          <p class="current"><span class='numBggray'>{{swiperIndex+1}}/{{imagesLen}}</span></p>
        </div>
      </swiper>
  </div>
</template>
<script>
import {XButton, XTextarea,Swiper,SwiperItem} from 'vux'
import ImgUpload from '@/components/ImgUpload'

export default {
  
  mounted(){
    this.setTitle('仲裁详情')
    this.init();
  },
  data () {
    return {
       images:[],
       uploadurl:'/sh/ja/v1/file/goods/upload',
       orderId:this.$route.query.orderId,
       topText:'',
       arbitratDetaileData:{},
       showImg:false,
       bigImageList:[],
       swiperIndex:0,
       imagesLen:0,
    }
  },
  methods:{
    init:function(){
      let self=this;
       self.$http.post('/sh/ja/v1/arbitration/detail/'+self.orderId)
        .then(function(res) {
          if(res.data.statusCode==0){
            self.arbitratDetaileData=res.data.data
          }else{
            _g.toastMsg('error', res.data.msg)
          }
        })
    },
    showBigImgFn:function(item,index){
      let self=this;
      self.showImg=true;
      self.imagesLen=item.length
      self.bigImageList=item
      self.swiperIndex=index;
      self.currentBigIndex=index+1;
    },
  },
   components: {
    XButton,ImgUpload,XTextarea,Swiper,SwiperItem,
  },
}

</script>

<style scoped lang='less'>
    .content-wrap,.bigImg{
    height: 100%
  }
  .bigImg{
    background-color: #222;
    position: fixed;
    top:0;
    width: 100%;
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
  .swiper-bar{
    position: absolute;
    text-align: right;
    bottom: 20/40rem;
    font-size: 28/40rem;
    width: 100%;
    right: 30/40rem;
  }
  .numBggray{
    background: rgba(216,216,216,0.7);
    color: #fff;
    display: inline-block;
    width: 80/40rem;
    text-align: center;
  }

    .arbitrationDetailMain{
      height: 100%;
      overflow: auto;
    }
    .arbitrationDetailBox{
      background-color: #fff;
      border-radius: 15/40rem;
      font-size: 30/40rem;
      margin: 30/40rem 30/40rem 0;
      margin-bottom: 84/40rem;
      overflow: auto;
    }
    .arbitrationDetailBox .redFont{
      text-align: center;
       padding: 30/40rem 20/40rem;
    }
    .arbitDetaiTime{
      text-align: center;
      border-top: 1px solid #eee;
      margin: 0 20/40rem;
      padding: 30/40rem 0;
    }
    .arbitDetaiTime span{
      background-color: #DCDCDC;
      padding: 10/40rem 20/40rem;
      color: #fff;
      border-radius: 15/40rem;
    }
    .arbitDetaiUserDesc{
      display: flex;
      padding: 0 20/40rem;
    }
    .arbitDetaiUserDesc .flex1{
      flex:1;
      font-size: 24/40rem;
    }
    .arbitrationUser{
      font-weight: 600;
      display: inline-block;
      width: 100/40rem;
    }
    .arbitrationUser i{
      font-style: normal;
    }
    .arbitDetaiBtnBox{
      position: fixed;
      bottom: 0;
      width: 100%;
    }
    .arbitratUpload{
      margin: 0 20/40rem 0 10/40rem;
    }
    .arbitratUpload span{
      box-sizing:border-box;
      display: inline-block;
      width: 25%;
      height: 170/40rem;
      padding: 10/40rem 0 0 10/40rem;
     }
     .arbitratUpload span img,.arbitratUpload span i{
      display: inline-block;
      width: 100%;
      height: 100%;
     }
</style>
<style type="text/css" lang='less'>
  .arbitDetaiBtnBox .weui-btn{
    border-radius: 0;
  }
  .bigImg  .vux-swiper-item{
    display:table;
  }
</style>
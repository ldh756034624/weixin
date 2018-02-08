<template>
		<div class="page shopDatailePage">
      <main>
        <img class="shopImg" :src="shopData.img"/>
        <div class="shopTitleBox">
          <p>{{shopData.name}}</p>
          <p class="joyMoney">¥ {{shopData.price}}/{{shopData.unit}}</p>
        </div>
        <section>
          <div  class="descBox">
            <p class="desc">商品详情</p>
            <div class="descCont" v-html='shopData.desc'>
            </div>
          </div>
        </section>
        <p v-if='isApple' class="isApple">{{shopData.tip}}</p>
        <!--垫底用-->
        <p v-else style="height: 2.7rem;width: 100%"></p>
      </main>
      <footer>
        <div>
          <x-button class='bottomBtn gradientBtn' :class="shopData.stock == 0 && 'grayBtn'" @click.native="goExchange">立即购买（兑换）</x-button>
        </div>
      </footer>
		</div>
</template>

<script>
import { XButton} from 'vux'
export default {
  mounted() {
    this.setTitle('商品详情');
    this.deviceFn();
    this.init()
  },
  data() {
    return {
      isApple:false,
      shopData:{},
    }
  },
  methods:{
    init(){
      this.$http.get('h9/store/goods/'+this.$route.query.id)
        .then((res)=>{
          if(res.data.code==0){
            this.shopData=res.data.data
          }
        })
    },
    goExchange:function(){
//      let userBalance =  parseFloat(this.shopData.balance)
//      let price = parseFloat(this.shopData.price)
      let {price, balance, stock} = this.shopData
      // if(parseInt(balance) < parseInt(price)) {
      //   _g.toastMsg('error', '余额不足')
      //   return
      // }
      if(stock == 0) {
        _g.toastMsg('error', '库存不足')
        return
      }
      this.$router.push({path:'/shopOrder',query:{id:this.$route.query.id}})
    },
    deviceFn:function(){
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if(isAndroid){
          this.isApple=false;
      }else{
          this.isApple=true;
      }
    }
  },
  components: {
    XButton
  }
}
</script>
<style scoped lang='less'>
  .page{
    overflow: auto;
  }
  .shopDatailePage{
    font-size: 30/40rem;
    .shopImg{
      width: 100%;
    }
    .shopTitleBox{
      background: #fff;
      margin-top: -12/40rem;
      margin-bottom: 20/40rem;
      padding: 20/40rem 30/40rem;
      font-size: 32/40rem;
      line-height: 60/40rem;
    }
    .joyMoney{
      color: #e60012;
      font-size: 34/40rem;
    }
    .descBox{
      background: #fff;
    }
    .desc{
      font-size: 24/40rem;
      background: #fff;
      margin: 0 30/40rem;
      padding: 20/40rem 0;
      border-bottom: 2/40rem solid #f2f2f2;
    }
    .descCont{
      color: #999;
      padding: 10/40rem 30/40rem;
      background: #fff;
    }
    .isApple{
      text-align: center;
      font-size: 24/40rem;
      padding: 20/40rem 0 2.7rem;
      color: #999;
    }
    .bottomBtn {
      height: 100/40rem;
      line-height: 100/40rem;
      color: #fff;
      position: fixed;
      bottom: 0;
      border-radius: 0;
      width: 100%;
      text-align: center;
      font-size: 32/40rem;
    }
    .gradientBtn {
      background: #e60012;
    }
    .grayBtn{
      background: #999;
    }
  }

</style>

<style lang='less'>
  .descCont {
    img {
      width: 100% !important;
      height: auto !important;
    }
  }
</style>

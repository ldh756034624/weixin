<template>
  <div class="page">
      <div class="buyUnused">
          <main class='payMain'>
              <div class="buyGoods payGoods">
                 <img :src="firstImage" class="goodImg">
                 <div class="buyGoodsDesc">
                    <p>{{goodData.title}}</p>
                    <p class="redFont"><i>¥</i><span>{{goodData.sellingPrice}}</span></p>
                 </div>
              </div>
              <p class="buyMoneyBox line paychooseBox" @click='choosedWX=true'>
              		<img src='../../assets/img/mian/WX.png'/>
              		<span>微信</span>
              		<span class='paychooseIcon'  :class="[choosedWX ? 'payChoosed' : 'payUnchoose']"></span>
              </p>
              <p class="buyMoneyBox paychooseBox" @click='choosedWX=false' >
              		<img src='../../assets/img/mian/zhifubao.png'/>
              		<span>支付宝</span>
              		<span class='paychooseIcon' :class="[choosedWX==false ? 'payChoosed' : 'payUnchoose']"></span>
              </p>
          </main>
          <footer class='footerBtnBox'>
            <button class="BlueBtn buyBtn" @click='surePay'>确定支付</button>
          </footer>
      </div>
      
  </div>
</template>

<script>
// var url = require('aUrl')
var hyburl=  require('commonUrl')

export default {
  mounted(){
    let self=this;
    self.setTitle('订单支付');
    self.init();
  },
  data () {
    return {
      goodsId:this.$route.query.goodsId,
      address:{},
      goodData:{},
      choosedWX:true,
      firstImage:''
    }
  },
  methods:{
    init(){
      let self=this;
      self.$http.get('/sh/ja/v1/idleGoods/'+self.goodsId+'/ready')
        .then(function(res) {
          if(res.data.statusCode==0){
            self.goodData=res.data.data
            self.address=res.data.data.address
            self.firstImage=self.goodData.images[0]
          }
        })
    },
    surePay(){
      let curl = hyburl+'/ja/paygateway/v1/pay/request/'+appId+'/order/'+self.goodsId+'/'+self.goodData.sellingPrice+'/'+JSON.parse(localStorage.getItem('_user')).token;
      location.href = curl; 
    }
  },
   components: {
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
    .buyUnused{
      padding: 20/40rem;
    }
    .payMain{
      background-color:#fff;
      border-radius: 10/40rem;
      font-size: 30/40rem;
      padding-top: 20/40rem;
     }
     .payGoods{
        background-color: #FAFBFD;
        margin: 20/40rem 30/40rem;
     }
     .payGoods img{
      margin-right: 10/40rem;
     }
     .buyGoodsDesc{
        display: inline-block;
        vertical-align: top;
        line-height: 80/40rem;
     }
     .buyGoodsDesc p:first-child{
        margin-bottom: 50/40rem;
     }
     .buyMoneyBox{
        padding: 30/40rem;
     }
     .buyBtn{
        height: 90/40rem;
        margin-top: 60/40rem;
        font-size: 30/40rem;
     }
     .goodImg{
        height: 200/40rem;
        width: 200/40rem;
     }
     .paychooseBox img{
     	width: 80/40rem;
     	height: 80/40rem;
     	margin-right: 30/40rem;
     	vertical-align: middle;
     }
     .paychooseIcon{
     	width: 44/40rem;
     	height: 44/40rem;
     	float: right;
     }
     .payChoosed{
     	background:url('../../assets/img/mian/icon@2x.png') no-repeat center;
     	background-size:100%; 
     }
     .payUnchoose{
     	background:url('../../assets/img/mian/ic_like_unselect.png') no-repeat center;
     	background-size:100%; 
     }
</style>
 
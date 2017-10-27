<template>
	<div class="page ">
      <main>
          <section class='showMoneyBox'>
              <div class="showMoneyTop">
                <img src="../../assets/img/back/refund@2x.png" v-if="moneyData.type=='1'" class="showMoneyImg">
                <img src="../../assets/img/back/ok@2x.png" v-if="moneyData.type!='1'" class="showMoneyImg">
                <p>{{moneyData.title}}</p>
                <p class="redFont">￥{{moneyData.money | price2}}</p>
                <p>{{moneyData.tip}}<span class='backMoney'>￥{{moneyData.money | price2}}</span></p>
              </div>
              <div class="showMoneyText">
                <p class="gray9Font">钱款明细</p>
                <p v-if='moneyData.goodsType=="2"'>保证金 <span class='right'>￥{{moneyData.ensurePrice | price2}}</span></p>
                <p>货款 <span class='right'>￥{{moneyData.goodsPrice | price2}}</span></p>
                <p>其他 <span class='right'>￥{{moneyData.other | price2}}</span></p>
              </div>
          </section>
          <p class="backTimeTip">到帐时间:预计最晚到帐时间1到15个工作日,请您注意查收,如未到帐请联系客服fk_zzjs@hey900.com</p>
      </main>
  </div>
</template>
<script>
export default {
  
  mounted(){
    this.setTitle('查看钱款')
    this.init();
  },
  data () {
    return {
       moneyData:{},
       type:this.$route.query.type,//0我买到的,1我卖出的
       orderId:this.$route.query.orderId,
       uploadurl:'/sh/ja/v1/file/goods/upload',
    }
  },
  methods:{
    init(){
      let self=this;
      self.$http.get('/sh/ja/v1/order/show/money/'+self.orderId) //查看钱款去向
        .then(function(res) {
          if(res.data.statusCode==0){
             self.moneyData=res.data.data
          }
        })
    },
  },
   components: {
  },
}

</script>

<style scoped lang='less'>
    
    .showMoneyBox{
      background-color: #fff;
      border-radius: 15/40rem;
      font-size: 30/40rem;
      margin: 30/40rem 30/40rem 0;
      padding: 30/40rem;
    }
    .showMoneyBox p{
      padding: 10/40rem 0;
    }
    .showMoneyTop p{
      padding: 5/40rem 0;
    }
    .showMoneyTop p:last-child{
      margin-top: 15/40rem;
    }
    .showMoneyTop{
      text-align: center;
    }
    .backMoney{
      margin-left: 1rem
    }
    .showMoneyImg{
      width: 120/40rem;
      padding: 40/40rem 0;
    }
    .showMoneyText{
      border-top: 1px solid #eee;
      margin-top: 30/40rem;
      padding-top: 30/40rem;
    }
    .backTimeTip{
      color: #999;
      padding: 20/40rem 30/40rem;
      font-size: 30/40rem;
    }
</style>
<style type="text/css" lang='less'>
</style>
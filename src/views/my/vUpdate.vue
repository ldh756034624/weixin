<template>
		<div class="page vMoneyUpdataPage">
      <main>
        <div class="announce" v-html='DealData'>
          <!-- <p>亲爱的高炉家用户</p>
          <p>
             我们从2017年12月12日将使用“酒元”代替现有的积分的发放和使用，原V币获取渠道和兑换服务将停止，同时酒元的获取和使用将变得更加的丰富，您将更容易获取和使用酒元，希望这次升级能给你带来更好的用户体验。
        您账户剩余的V币可以按 10V币 = 1酒元 的比例兑换成酒元，赶快兑换成酒元换取各类好礼吧！
          </p> -->
        </div>
        <div class="exchangeRate flexBox">
          <div class="flex1">
            <p class="num">{{vUpdateData.vb}}</p>
            <p>v币</p>
          </div>
          <img src="../../assets/img/account/jiantou.png">
          <div class="flex1 rateNew">
            <p class="num">{{vUpdateData.jiuYuan}}</p>
            <p><img src='../../assets/img/account/group_3copy.png'/>酒元</p>
          </div>
        </div>
        <p class="endTime">截止{{vUpdateData.endTimeTip}}</p>
        <div class="vUpdateBtnBox">
          <x-button class='exchangeBtn' @click.native="showTip=true">立即兑换  </x-button>
        </div>
      </main>
      <div v-transfer-dom>
        <x-dialog v-model='showTip'>
          <div class="vMoneyAlert">
            <p class='alertTitle'>确定要兑换吗?</p>
            <p class='alertCont'>{{vUpdateData.vb}}V币将兑换为{{vUpdateData.jiuYuan}}酒元,完成立即生效,此过程不可逆。</p>
            <p class='alertState' @click='watchDeal'>[查看酒元使用说明]</p>
            <x-button class='alertBtn' mini @click.native="showTip=false">取消</x-button>
            <x-button class='alertBtn exchangeBtn' mini @click.native="exchangeFn">兑换成酒元</x-button>
          </div>
        </x-dialog>
      </div>
      <div v-transfer-dom>
        <popup v-model="showUserDeal" height="100%" class='dealPopup'>
          <platformDeal v-model="showUserDeal" :dealType='dealStr' v-on:listenToDealShow='dealShowFn'></platformDeal>
        </popup>
     </div>
		</div>
</template>

<script>
import { XButton,XDialog,Popup,TransferDomDirective as TransferDom} from 'vux'
import platformDeal from '../deal/platformDeal'
export default {
  directives: {
    TransferDom
  },
  mounted() {
    this.setTitle('v币升级');
    this.init()
    this.getDeal('vbConvetDescription').then(data=>{
      this.DealData=data.data.content
    })
  },
  data() {
    return {
      vUpdateData:{},
      DealData:'',
      showTip:false,
      showUserDeal:false,
      dealStr:'moneyUseDescription',
    }
  },
  methods:{
    init(){
      this.$http.get('h9/api/account/vb/convert')
        .then((res) => {
          if(res.data.code==0){
              this.vUpdateData=res.data.data
          }
        })
    },
    exchangeFn:function(){
      let self=this;
      this.$http.post('h9/api/account/vb/convert')
        .then((res) => {
          if(res.data.code==0){
            self.$router.replace({
              path:'/account/result',
              query: {type: 'vMoneyExchange'}
            })
          }
        })
    },
    watchDeal:function(){
      this.showUserDeal=true;
      this.showTip=false;
    },
    dealShowFn:function(data){
      let self=this;
      if(data==false){
        self.showUserDeal=false
        this.showTip=true
      }
    },
  },
  components: {
    XButton,XDialog,Popup,platformDeal
  }
}
</script>
<style scoped lang='less'>
  .vMoneyUpdataPage{
    overflow-y: auto;
    background: #fff;
    .announce{
      padding: 50/40rem;
      margin: 50/40rem 50/40rem 80/40rem;
      border:2/40rem solid #ddd;
      box-shadow:  0  0 18/40rem 0 rgba(204,204,204,0.5);
      line-height: 50/40rem;
      font-size:28/40rem;
      p:nth-child(1){
        font-size:36/40rem!important;
        color: #222!important;
        margin: 20/40rem 0!important;
      }
      p:nth-child(2){
        color: #999!important;
      }
    }
    .exchangeRate{
      font-size: 28/40rem;
      border-top: 2/40rem solid #f2f2f2;
      padding-top: 60/40rem;
      img{
        width: 92/40rem;
        height: 92/40rem;
      }
      .flex1{
        text-align: center;
        p:nth-child(2){
          margin-top:30/40rem;
        }
      }
      .num{
        font-size: 72/40rem;
        font-weight: 600;
      }
      .rateNew{
        .num{
          color: #627984;
        }
        img{
          display: inline-block;
          width: 48/40rem;
          height: 48/40rem;
          margin-right: 10/40rem;
          vertical-align: middle;
        }
      }
    }
    .endTime{
      text-align: center;
      font-size: 24/40rem;
      color: #999999;
      padding: 30/40rem 0;
    }
    .vUpdateBtnBox{
      padding: 30/40rem;
      .exchangeBtn{
        background: #627984;
        border-radius: 8/40rem;
        color: #fff;
        font-size: 32/40rem;
        height: 100/40rem;
      }
    }
  }
  .vMoneyAlert{
    .alertTitle{
      font-size: 32/40rem;
      color: #627984;
      padding: 20/40rem;
      border-bottom: 2/40rem solid #f2f2f2;
    }
    .alertCont{
      font-size: 28/40rem;
      padding: 30/40rem 60/40rem;
      color: #999;
      text-align: left;
    }
    .alertState{
      text-align: right;
      margin-top: -20/40rem;
      padding:0 70/40rem 30/40rem 0;
      font-size: 24/40rem;
      color: #627984;
    }
    .alertBtn{
      height: 80/40rem;
      line-height: 80/40rem;
      width: 220/40rem;
      font-size: 28/40rem;
      background: #fff;
      margin: 10/40rem 15/40rem 30/40rem;
      border: 2/40rem solid #999;
      padding: 0;
    }
    .exchangeBtn{
      background: #627984;
      color: #fff;
    }
  }

</style>
<style lang='less'>
  .announce{
      padding: 50/40rem;
      margin: 50/40rem 50/40rem 80/40rem;
      border:2/40rem solid #ddd;
      box-shadow:  0  0 18/40rem 0 rgba(204,204,204,0.5);
      line-height: 50/40rem;
      font-size:28/40rem;
      color: #999;
      p:nth-child(1){
        font-size:36/40rem!important;
        color: #222!important;
        margin: 20/40rem 0!important;
      }
    }
</style>

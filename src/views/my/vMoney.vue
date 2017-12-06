<template>
  <div class="page">
      <group class="purseBox">
          <p>我的V币</p>
          <div class="purseCont flexBox">
              <img src=""/>
              <div class="purseMoney flex1 redFont">
                {{vbNum}}
              </div> 
              <!-- <x-button mini class='purseFundBtn' @click.native="goFunds()" >提现</x-button> -->
          </div>
          <cell title="V币记录" link='/my/vMoneyParticulars' is-link>
              <img slot="icon" width="30" style="display:block;margin-right:5px;" src="../../assets/img/index/icon_order@2x.png">
          </cell>
      </group>
      <p class="blockTips">增值服务</p>
      <flexbox :gutter="0" class='purseWaiterBox'>
          <flexbox-item>
            <div class="purseItemBox">
              <img src="../../assets/img/account/vcoin_icon_exchange@2x.png"/>
              <p>V币兑换</p>
            </div>
          </flexbox-item>
          <flexbox-item class='ItemBorder'>
            <div class="purseItemBox">
              <img src="../../assets/img/account/vcoin_icon_hotel@2x.png"/>
              <p>H9酒店预订</p>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="purseItemBox">
              
            </div>
          </flexbox-item>
        </flexbox>
        <div v-transfer-dom>
          <x-dialog v-model='showTip'>
            <div class="vMoneyAlert">
              <p class='alertTitle'>V币换酒元啦</p>
              <p class='alertCont'>我们V币已升级为“酒元”啦，原V币可一键兑换为酒元继续使用</p>
              <x-button class='alertBtn' mini @click.native="showTip=false">取消</x-button>
              <x-button class='alertBtn exchangeBtn' mini @click.native="exchange">立即兑换</x-button>
            </div>
          </x-dialog>
        </div>
  </div>
</template>
<script>
import {Group,Cell,Flexbox, FlexboxItem,XButton,XDialog,TransferDomDirective as TransferDom} from 'vux'
// var url = require('aUrl')
export default {
  directives: {
    TransferDom
  },
  mounted(){
    let  self=this;
    self.setTitle('我的V币');
  },
  data () {
    return {
      purseData:{},
      vbNum:this.$route.query.vbNum,
      showTip:true,
    }
  },
  methods:{
    init(){
      let self = this
      
    },
    goFunds:function(){
      let self=this;
      self.$router.push({path:'/account/funds'})
    },
    exchange:function(){
      this.$router.push({path:'/my/vUpdate'})
    }
    
  },
   components: {
    Group,Cell,Flexbox, FlexboxItem,XButton,XDialog
  },
}

</script>

<style scoped lang='less'>
  .purseBox{
    margin-top: -42/40rem;
    font-size: 28/40rem;
    padding: 40/40rem 30/40rem 0;
    background: #fff;
  }
  .purseMoney{
    font-size: 96/40rem;
  }
  .purseCont{
    height: 96/40rem;
    line-height: 96/40rem;
    padding: 70/40rem 0;
  }
  .purseFundBtn{
    height: 60/40rem;
    margin-top: 20/40rem;
    color: #666;
    padding: 0 0.6rem!important;
    border:1px solid #666;
    background: #fff;
  }
  .purseWaiterBox{
    background: #fff;
    padding: 42/40rem 0;
  }
  .purseItemBox{
    text-align: center;
    line-height: 0;
    img{
      width: 70/40rem;
      height: 70/40rem;
    }
    p{
      font-size: 28/40rem;
      line-height: 0;
      margin-top: 20/40rem;
    }
  }
  .ItemBorder{
    border-left:1px solid #f2f2f2;
    border-right:1px solid #f2f2f2;
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
    .alertBtn{
      height: 80/40rem;
      line-height: 80/40rem;
      width: 200/40rem;
      font-size: 28/40rem;
      background: #fff;
      margin: 10/40rem 30/40rem 30/40rem;
      border: 2/40rem solid #999;
    }
    .exchangeBtn{
      background: #627984;
      color: #fff;
    }
  }
  
</style>
<style lang='less'>
  .purseBox .weui-cells p{
    font-size: 28/40rem;
  }
  .purseBox .weui-cells:before{
    border-top:none;
  }
  .purseMoney{
    font-size: 96/40rem;
  }
  .purseBox .weui-cell:before{
    left: 0!important;
    right: 0!important;
  }
  .purseBox .weui-cell{
    padding: 30/40rem 0!important;
  }
  .purseBox .vux-label{
    font-size: 30/40rem;
  }
  .vMoneyAlert .weui-btn:after{
    border:none!important;
  }
</style>
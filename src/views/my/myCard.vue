<template>
	<div class="page cardListPage">
    <div class="cardListBox flexBox" :style="{backgroundColor:item.color}" v-for='item in myCardData'>
      <img class="cardIcon" :src="item.bankImg"/>
      <div class="flex1">
        <p class="cardName">{{item.name}}</p>
        <p class="cardType">储蓄卡</p>
        <p class="cardNo">{{item.no}}</p>
      </div>
      <img class="cardSetIcon" @click='goCancel(item)' src="../../assets/img/account/bankcard_btn_setting@2x.png"/>
    </div>
    <router-link to='/account/addBank'>
      <div class="addCard">
        <img src="../../assets/img/account/bankcard_icon_add@2x.png"/>
        添加银行卡
      </div>
    </router-link>
    <div v-transfer-dom>
      <popup v-model="cardSetPopup" >
        <div class="cardSet">
          <p @click='cancelBind()'>解除绑定</p>
          <p class="redFont" @click='cardSetPopup=false'>取消</p>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
import { Popup,TransferDom} from 'vux'
export default {
  directives: {
    TransferDom
  },
  mounted(){
    let  self=this;
    self.setTitle('银行卡');
    self.init();
  },
  data () {
    return {
      colo:'#C65055',
      cardSetPopup:false,
      myCardData:[],
      cancelCardId:'',
    }
  },
  methods:{
    init(){
      let self = this
      self.$http.get('h9/api/my/bankcards')
        .then(function(res) {
          if(res.data.code==0){
              self.myCardData=res.data.data
          }
        })
    },
    goCancel:function(item){
      this.cancelCardId=item.id
      this.cardSetPopup=true
    },
    cancelBind:function(){
      let self = this
      self.cardSetPopup=false
      self.$http.put('h9/api/bankCard/update/'+self.cancelCardId)
        .then(function(res) {
          if(res.data.code==0){
              _g.toastMsg('error','解绑成功');
              self.init();
          }
        })
    },
    goOrderDetail:function(){
      this.$router.push({path:'/my/orderDetail'})
    }

  },
  components: {
     Popup,TransferDom
  }
}

</script>

<style scoped lang='less'>
  .cardListPage{
    background: #fff;
    color: #fff;
    overflow-y:auto;
    .cardListBox{
      padding: 30/40rem;
      margin: 30/40rem;
      border-radius: 15/40rem;
    }
    .cardIcon{
      width: 72/40rem;
      height: 72/40rem;
      margin-right: 20/40rem;
    }
    .cardName{
      font-size: 32/40rem;
      line-height: 30/40rem;
    }
    .cardType{
      font-size: 24/40rem;
      margin-top: 15/40rem;
    }
    .cardNo{
      font-size: 40/40rem;
      margin-top: 14/40rem;
    }
    .cardSetIcon{
      width: 50/40rem;
      height: 50/40rem;
    }
    .addCard{
      padding: 0 30/40rem;
      color: #4d4d4d;
      font-size: 30/40rem;
      height: 120/40rem;
      line-height: 120/40rem;
      img{
        width: 60/40rem;
        height: 60/40rem;
        margin-right: 20/40rem;
        vertical-align: middle;
      }
    }
  }
  .cardSet{
    p{
      padding: 30/40rem;
      text-align: center;
      font-size: 30/40rem;
      background: #fff;
      border-top: 1px solid #f2f2f2;
    }
  }
</style>

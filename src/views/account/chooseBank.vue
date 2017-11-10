<template>
	<div class="page">
    <div class="chooseBankCont">
      <div v-for='item in cardData' class="chooseBankBox flexBox" @click='chooseCardFn(item)'>
          <img class="chooseBankImg" :src="item.bankImg"/>      
          <div class="flex1">
              <p class="chooseBankName">{{item.name}}</p>
              <p class="chooseBankNo">尾号({{item.cardLast}})</p>
          </div>
          <!-- <span v-if='chooseId==item.id'>X</span> -->
      </div>
      <router-link :to="{path:'/account/addBank',query:{type:'funds'}}">
        <group class="chooseNewBank groupNoLine">
            <cell title="使用新卡提现"  is-link></cell>
        </group>
      </router-link>
    </div>
    
  </div>
</template>
<script>
import {Group,Cell} from 'vux'
export default {
  mounted(){
    let  self=this;
    self.setTitle('选择银行卡');
    self.init()
  },
  data () {
    return {
      cardData:[],
      chooseId: 1,
    }
  },
  methods:{
    init(){
      let self = this
      self.$http.get('h9/api/my/bankcards')
        .then(function(res) {
          if(res.data.code==0){
              self.cardData=res.data.data 
              for(var i=0;i<self.cardData.length;i++){
                var strLen=self.cardData[i].no.length
                var str=self.cardData[i].no.substr(strLen-4,strLen);
                self.cardData[i].cardLast=str;
              }
          }
        })
    },
    chooseCardFn:function(item){
      let self=this;
      self.chooseId=item.id
      self.$router.replace({path:'/account/funds',query:{cardIcon:item.bankImg,cardName:item.name,cardLast:item.cardLast,bankId:item.id}})
    }
  },
  components: {
    Group,Cell
  },
}

</script>

<style scoped lang='less'>
    .chooseBankCont{
      background: #fff;
    }
    .chooseBankBox{
      padding: 40/40rem 0;
      margin: 0 30/40rem;
      border-bottom: 1px solid #f2f2f2;

      .chooseBankImg{
        width: 100/40rem;
        height: 100/40rem;
        margin-right: 20/40rem;
        border-radius: 4rem;
      }
      .chooseBankName{
        font-size: 32/40rem;
      }
      .chooseBankNo{
        font-size: 28/40rem;
      }
    }
    .chooseNewBank{
      margin-top: -40/40rem;
    }
</style>
<style scoped lang='less'>
    .chooseNewBank  .weui-cell{
      font-size: 30/40rem;
      padding: 40/40rem 30/40rem;
    }
</style>
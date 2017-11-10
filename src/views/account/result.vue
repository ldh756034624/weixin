<template>
	<div class="page resultPage">
      <div class="resultImgBox">
          <img class="resultImg" src="../../assets/img/account/tixian_img_success@2x.png"/>
          <p>{{type}}{{status}}</p>
      </div>
      <div v-if=''>
          <p class="flexBox">手机号 <span class='flex1 alignR'>13602687596</span></p>
          <p class="flexBox">充值金额 <span class='flex1 alignR'>￥20.00</span></p>
      </div>
      <div>
          <p class="flexBox">手机号 <span class='flex1 alignR'>13602687596</span></p>
          <p class="flexBox">充值金额 <span class='flex1 alignR'>￥20.00</span></p>
      </div>
      <div class="fundsBtnBox">
          <x-button class='gradientBtn' @click.native="">{{buttonText}}</x-button>
      </div>
  </div>
</template>
<script>
import {Group,Cell, XInput,XButton} from 'vux'
export default {
  mounted(){
    let  self=this;
    self.setTitle('提现');
  },
  data () {
    return {
      type:self.$route.query.type,
      status:self.$route.query.status,
      buttonText:self.$route.query.buttonText,
    }
  },
  methods:{
    init(){
      let self = this
      
    },
    
  },
   components: {
    Group,Cell, XInput,XButton
  },
}

</script>

<style scoped lang='less'>
    .resultPage{
      background: #fff;
      .resultImgBox{
        padding: 100/40rem 0 40/40rem;
        text-align: center;
        font-size: 28/40rem;
        line-height: 46/40rem;
        color: #999;
      }
      .resultImg{
        width:140/40rem;
        height: 140/40rem;
      }
    }
</style>
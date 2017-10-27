<template>
	<div class="page">
    <div class="input-wrap">
      <group title="">
        <x-input v-model="price" title="售价(元):" :max='9' placeholder="输入售价" type="number"></x-input>
        <x-input v-model="express" title="运费(元):" :max='9' placeholder="输入运费" type="number"></x-input>
      </group>
      <div class="commonbtn-wrap">
          <x-button @click.native="changePrice" mini class="commonbtn">确定</x-button>
      </div>
    </div>
  </div>
</template>
<script>
import {Group,XInput,XButton} from 'vux'

// var url = require('aUrl')
// @keyup="price=price.replace(/\D/g,'')"
export default {
  mounted(){
    this.setTitle('修改价格');
    this.init();
  },
  data () {
    return {
      nickname: '',
      price: '',
      express: '',
      reg: /^[0-9]*(\.[0-9]{1,2})?$/
    }
  },
  methods:{
    init(){
      this.price = JSON.parse(this.$route.query.price).toFixed(2);
      this.express = JSON.parse(this.$route.query.express).toFixed(2);
    },
    changePrice(){
        let self=this;
        console.log(self.orderId)
        let msg = this.check();
        if(msg){
          self.$vux.toast.show({
            text:  msg,
            type: 'text',
          })
        }else{
          self.$http.put('/sh/ja/v1/idleGoods/'+this.$route.query.orderId,{sellingPrice:self.price,expressFee: self.express})
          .then(function(res) {
            if(res.data.statusCode==0){
              self.$router.replace({path:'/account/mysell/'})
            }else{
              self.$vux.toast.show({
                text:  res.data.msg,
                type: 'text',
              })
            }
          })
        }
    },
    check(){
      let msg = '';
      if(!this.price.trim()){
        msg = '请输入转让价';
        return msg;
      }
      if(!this.reg.test(this.price.trim())){
        msg = '请输入正确的转让金额';
        return msg;
      }
      if(!this.express.trim()){
        msg = '请输入运费';
        return msg;
      }
      if(!this.reg.test(this.express.trim())){
        msg = '请输入正确的金额';
        return msg;
      }
      return msg;
    }
  },
  components: {
    Group,
    XInput,
    XButton
  },
}

</script>

<style scoped lang='less'>
    .input-wrap{
        padding: 0 20/40rem;
        margin-top: 40/40rem;
    }
</style>
<style lang='less'>
    .input-wrap{
        .weui-cells{
            border-radius: 10/40rem;
            &:before{
              border-top: none;
            }
            .weui-label{
              font-size: 34/40rem;
            }
            .weui-input{
              text-align: right;
              font-size: 30/40rem;
            }
        }
        .weui-input{
          color: #999;
        }
    }
</style>
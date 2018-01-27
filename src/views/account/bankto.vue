<template>
  <div class="page">
    <div class="backgound">
      <group class="banktoBox  groupNoLine">
        <p class="flexBox fundsMoneyTips">对方手机号</p>
        <x-input mask="999 9999 9999" :max="13" v-model="fundMoney"
                 :show-clear="false" keyboard="number" placeholder='请输入手机号'>
        </x-input>
        <p class="leastMoney">钱将实时转入对方账户，无法退款
        </p>
      </group>
      <div class="fundsBtnBox">
        <x-button class='gradientBtn' @click.native="fundsFn">下一步</x-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {Group, Cell, XInput, XButton} from 'vux'
  import codeAlert from '@/components/codeAlert'

  export default {
    mounted() {
      let self = this;
      self.setTitle('转账');
      // self.init();
    },
    data() {
      return {
        fundMoney:null
      }
    },
    methods: {
      init() {
      },
      fundsFn: function () {
        let self = this
        function trim(str){
            return str.replace(/\s|\xA0/g,"");   
        }
        const reg = /^1[3|5|7|8][0-9]\d{4,8}$/;
        if(self.fundMoney == null || self.fundMoney.length !=13 || !reg.test(trim(self.fundMoney))){
          _g.toastMsg('error', "请输入正确的手机号")
          return
        }
        self.$http.get('/h9/api/user/transfer/info/' + trim(self.fundMoney))
        .then(function(res){
          if (res.data.code == 0) {
            self.$router.push({path:'/account/redPaperAmount',query:{tel: trim(self.fundMoney)}})
          } else {
            _g.toastMsg('error', res.data.msg)
          }
        })
        
      }
    },
    components: {
      Group, Cell, XInput, XButton, codeAlert
    },
  }

</script>

<style scoped lang='less'>
  .backgound{
    background-color: #fff;
    margin: 30/40rem;
  }
  .banktoBox {
    background-color: #fff;
    .fundsMoneyTips {
      padding: 1rem 30/40rem;
    }
    .flexBox {
      font-size: 24/40rem;
    }
    .flex1 {
      font-size: 24/40rem;
      color: #999;
    }
    .leastMoney {
      font-size: 24/40rem;
      margin: 0 30/40rem;
      padding: 30/40rem 0;
      color: #999999;
      border-top: 1px solid #f2f2f2;
    }
    .fundMoney {
      font-size: 48/40rem;
    }
    .fundsCardIcon {
      width: 100/40rem;
      height: 100/40rem;
      margin-right: 20/40rem;
      border-radius: 4rem;
    }
    .fundsCardName {
      font-size: 32/40rem;
      line-height: 60/40rem;
    }
    .fundsCardNo {
      font-size: 24/40rem;
    }
  }

</style>
<style type="text" lang='less'>
  .banktoBox {
    .weui-cell_access {
      padding: 60/40rem 30/40rem;
      font-size: 32/40rem;
    }
    .vux-x-input {
      padding: 30/40rem 30/40rem;
      font-size: 48/40rem;
      height: 48/40rem;
      margin:0 30/40rem;
      background-color: #F2F2F2;
    }
    .weui-label {
      width: 50/40rem !important;
    }
    input::-webkit-input-placeholder { /* WebKit browsers */
      font-size: 28/40rem
    }
    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      font-size: 28/40rem
    }
    input::-moz-placeholder { /* Mozilla Firefox 19+ */
      font-size: 28/40rem
    }
    input:-ms-input-placeholder { /* Internet Explorer 10+ */
      font-size: 28/40rem
    }
  }
  .vux-input-icon.weui-icon-warn:before, .vux-input-icon.weui-icon-success:before{
    font-size: 0px;
  }
  .weui-btn:after{
    border:none;
  }
  .weui-input{
    color: #333!important;
  }
    
</style>

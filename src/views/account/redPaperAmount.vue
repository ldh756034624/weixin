<template>
  <div class="page">
    <div class="backgound">
      <div class="userInfo">
        <img class="img" :src="transferInfo.img" alt="" />
        <p class="uresName">{{transferInfo.targetUserName}}</p>
        <p>{{transferInfo.targetUserPhone}}</p>
      </div>
      <div class="title">
        <span>转账金额</span>
        <span class="right" style="color: #999999;">可用金额 : {{transferInfo.balance}}</span>
      </div>
      <group class="redPaperBox  groupNoLine">
        <x-input type="number" :title="moneyMark"  v-model="transferMoney"
                 :show-clear="false" keyboard="number">
        </x-input>
      </group>
      <div class="fundsBtnBox">
        <x-button class='gradientBtn' @click.native="fundsFn">确认</x-button>
        <span class="right transfer ">
          <router-link :to="{path:'/account/transferInfo'}">
              转账账单
          </router-link>
        </span>
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
      this.moneyMark = "¥"
      self.setTitle('转账');
      let tel = this.$route.query.tel
      self.init(tel);
    },
    data() {
      return {
        transferMoney:null,
        transferInfo:{},
        moneyMark:null

      }
    },
    methods: {
      init(tel) {
        let self = this
        this.$http.get('/h9/api/user/transfer/info/' + tel)
        .then(function(res){
          if (res.data.code == 0) {
            self.transferInfo = res.data.data
            self.transferInfo.targetUserPhone = self.transferInfo.targetUserPhone.replace(/\B(?=(\d{4})+(?!\d))/g,' ') //转换手机格式999 9999 9999
          } else {
            _g.toastMsg('error', res.data.msg)
          }
        })
      },
      fundsFn: function () {
        let self = this
        function trim(str){
            return str.replace(/\s|\xA0/g,"");    
        }
        let params = {
          targetUserPhone:trim(self.transferInfo.targetUserPhone),
          transferMoney:self.transferMoney
        }
        self.$http.post('/h9/api/user/transfer' ,params)
        .then(function(res){
          if (res.data.code === 0) {
             self.$router.push({path:'/account/success',query:{success:res.data.data.tips}})
          } else if(res.data.code === 1) {
            _g.toastMsg('error', res.data.msg)
          }else{
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

<style lang='less'>
  .backgound{
    background-color: #fff;
    margin: 30/40rem;
    .userInfo{
      text-align: center;
      .img{
        margin-top: 48/40rem;
        width: 100/40rem;
        height: 100/40rem;
        border-radius: 50%;
      }
      .uresName{
        font-size: 28/40rem;
        color: #999999;
        line-height: 29/40rem;
      }
      .tel{
        font-size: 28/40rem;
        color: #333333;
        line-height: 28/40rem;
      }
    }
    .title{
      padding: 0 45/40rem;
      margin-top: 40/40rem;
      font-size: 24/40rem;
      color: #333333;
      line-height: 24/40rem;
      
    }
    .redPaperBox {
      margin: 0 20/40rem;
      border-bottom: 1px solid #F2F2F2;
    }
    .fundsBtnBox{
      margin-top: 50/40rem;
      .gradientBtn{
        margin-bottom: 40/40rem;
      }
      .transfer{
        font-size: 24/40rem;
        color: #627984;
        line-height: 24/40rem;
      }
    }
  }
  .right{
    float: right;
  }
</style>
<style type="text/css"  lang='less'>
  .redPaperBox {
    .weui-cell_access {
      padding: 60/40rem 30/40rem;
      font-size: 32/40rem;
    }
    .vux-x-input {
      padding: 30/40rem 30/40rem;
      font-size: 32/40rem;
      height: 40/40rem;
    }
    .weui-label {
      width: 50/40rem !important;
      font-size: 72/40rem;
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

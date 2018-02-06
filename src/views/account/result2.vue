<template>
  <div class="page resultPage">
    <div class="resultImgBox">
      <img class="resultImg" v-if="txt=='领取成功'" src="../../assets/img/account/tixian_img_success@2x.png"/>
      <img class="resultImg" v-else src="../../assets/img/account/tixian_img_fail@2x.png">
      <p class="typeBox">{{txt}}</p>
      <p class="moneyBox" v-if="resultData"><i>¥</i>{{resultData.money}}</p>
    </div>
    <div class="resultText" v-if="resultData">
      <span>红包发起人</span>
      <div><img :src="resultData.img">{{resultData.nickName}}</div>
    </div>
    <div class="fundsBtnBox">
        <x-button class='gradientBtn' @click.native="goBack">完成</x-button>
    </div>
  </div>
</template>
<script>
  import {Group, Cell, XInput, XButton} from 'vux'

  export default {
    created() {
      sessionStorage.isInResult = true
    },
    mounted() {
      let self = this;
      this.$http.get('h9/api/user/redEnvelope/scan/qrcode', {params: {tempId : self.id}} )
        .then((res) => {
          if (res.data.code == 0) {
            self.resultData = res.data.data
            self.setTitle('领取成功');
          } else {
            self.txt = res.data.msg
            self.setTitle(res.data.msg);
          }
        })
    },
    data() {
      return {
        coponShow: true,
        resultData: null,
        txt: '领取成功',
        id:this.$route.query.id
      }
    },
    methods: {
      goPurse() {
//        sessionStorage.isInResult = false
        this.$router.push('/account/purse')
      },
      goBack: function () {
        this.$router.replace({path:'/account/purse'})
      }
    },
    components: {
      Group, Cell, XInput, XButton
    },
  }

</script>

<style scoped lang='less'>
  .resultPage {
    background: #fff;
    .resultImgBox {
      padding: 100/40rem 0 0rem;
      text-align: center;
      font-size: 28/40rem;
      line-height: 46/40rem;
      color: #999;
    }
    .resultImg {
      width: 100/40rem;
      height: 100/40rem;
    }
    .typeBox {
      font-size: 28/40rem;
      color: #627984;
    }
    .moneyBox {
      font-size: 48/40rem;
      color: #627984;
      margin: 70/40rem 0 20/40rem;
      i {
        font-style: normal;
        font-size: 30/40rem;
      }
    }
    .resultText {
      font-size: 24/40rem;
      color: #999;
      line-height: 40/40rem;
      display: flex;
      justify-content: space-between;
      margin-top: 60/40rem;
      padding: 0 30/40rem;
      img {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        margin-right: 6px;
        vertical-align: -4px;
      }
    }

    .shopResultBtnBox{
      text-align: center;
      margin: 40/40rem 0 30/40rem;
      .backIndex{
        background: #fff;
        border: 2/40rem solid #f2f2f2;
      }
      .gradientBtn{
        color: #fff;
      }
      .backIndex,.gradientBtn{
        height: 2.5rem;
        font-size: 30/40rem;
        padding: 0 70/40rem;
        margin: 0 35/40rem;
      }
    }

  }
</style>

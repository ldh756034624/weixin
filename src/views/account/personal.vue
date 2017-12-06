<template>
	<div class="page personalPage">
      <div class="personalTopBg">

          <router-link to='/account/setting'>
              <img src="../../assets/img/index/my_btn_setting@2x.png" class="settingIcon">
          </router-link>
          <router-link to='/account/infoChange'>
              <div class="accountUserImg">
                  <img :src="userHeadImg">
              </div>
              <p class="nickName">{{personalData.nickName}}</p>
          </router-link>
      </div>
       <flexbox :gutter="0">
          <flexbox-item>
            <router-link :to="{path:'/account/purse',query:{balance:personalData.balance,limit:personalData.withdrawalCount}}">
              <div class="personalItemBox">
                <p class="redFont">{{personalData.balance  || 0 | price2}}</p>
                <p>酒元</p>
              </div>
            </router-link>
          </flexbox-item>
          <flexbox-item>
            <router-link :to="{path:'/my/vMoney',query:{vbNum:personalData.vb}}">
              <div class="personalItemBox ItemBorder">
                <p class="redFont">{{personalData.vb || 0.00}}</p>
                <p>V币</p>
              </div>
            </router-link>
          </flexbox-item>
          <flexbox-item>
            <router-link to="/my/cupon">
              <div class="personalItemBox">
                <p class="redFont">{{personalData.cardNum || 0}}</p>
                <p>卡券</p>
              </div>
            </router-link>
          </flexbox-item>
        </flexbox>
      <div class="accountCont">
              <group class='personBox'>

                  <cell title="我的订单" link='/my/myOrder'>
                      <img slot="icon" width="30" style="display:block;margin-right:10px;"
                      src="../../assets/img/index/icon_order@2x.png">
                      <span class='cellValueBox'  style="margin-right:-12px;">
                        <i class='arrow'></i>
                      </span>
                  </cell>
                  <cell title="H9酒店记录"  value='暂未开放'>
                      <img slot="icon" width="30" style="display:block;margin-right:10px;"
                      src="../../assets/img/index/icon_hotel@2x.png">
                      <span class='cellValueBox'>
                        <i>暂未开放</i>
                        <i class='arrow'></i>
                      </span>
                  </cell>
                   <cell title="银行卡" link='/my/myCard'>
                      <img slot="icon" width="30" style="display:block;margin-right:10px;"
                      src="../../assets/img/index/icon_bankcard@2x.png">
                      <span class='cellValueBox'  style="margin-right:-12px;">
                        <i class='arrow'></i>
                      </span>
                  </cell>
                  <cell title="收货地址"  link='/addrList'>
                      <img slot="icon" width="30" style="display:block;margin-right:10px;"
                      src="../../assets/img/index/icon_adress@2x.png">
                      <span class='cellValueBox' style="margin-right:-12px;">
                        <i class='arrow'></i>
                      </span>
                  </cell>
              </group>
      </div>
      <div class="emptyBox">

      </div>
      <Bottombar :index="2"></Bottombar>
  </div>
</template>
<script>
import { Flexbox, FlexboxItem,Group,Cell} from 'vux'

import userimg from '../../assets/img/index/my_img_user@2x.png'
import Bottombar from '@/components/BottomBar'

export default {
  mounted(){
    this.setTitle('个人中心');
    this.init();
    if(localStorage.getItem('img')){
      this.userHeadImg=localStorage.getItem('img')
    }
  },
  data () {
    return {
      personalData:{},
      userok: false,
      userHeadImg: userimg,
      styles: {},
    }
  },
  methods:{
    init(){
      let self = this
      self.$http.get('h9/api/account/info')
        .then(function(res) {
          if(res.data.code==0){
              self.personalData=res.data.data
              localStorage.setItem('balance',self.personalData.balance)
              if(self.personalData.imgUrl){
                self.userHeadImg=self.personalData.imgUrl
                localStorage.setItem('img',self.personalData.imgUrl)
              }
          }
        })
    }
  },
   components: {
    Flexbox, FlexboxItem,Group,Cell,Bottombar
  },
}

</script>

<style scoped lang='less'>
    .personalPage{
      background: #fff;
      overflow-y:auto;
    }
    .personalTopBg{
      background:url('../../assets/img/index/my_img_bg@2x.png') no-repeat;
      background-size: 100%;
      height: 470/40rem;
    }
    .settingIcon{
      width: 60/40rem;
      height: 60/40rem;
      float: right;
      margin: 70/40rem 20/40rem 0 0;
    }
    .accountUserImg{
      width: 150/40rem;
      height: 150/40rem;
      margin: 0 auto;
      padding: 140/40rem 0 15/40rem;
    }
    .nickName{
      text-align: center;
      font-size: 36/40rem;
      color: #222;
      margin-top: 10/40rem;
    }
    .accountUserImg img,.accountUserImg span{
      display: inline-block;
      width: 150/40rem;
      height: 150/40rem;
      border-radius: 99/40rem;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-color: #f0f0f0;
    }
    .personalItemBox{
      text-align: center;
      font-size: 24/40rem;
      line-height: 0;
      margin:46/40rem 0;
      .redFont{
        font-size: 48/40rem;
      }
      .font12{
        font-size: 24/40rem;
      }
    }
    .personalItemBox p:last-child{
      margin-top: 55/40rem;
    }
    .ItemBorder{
      border-left:1px solid #d9d9d9;
      border-right:1px solid #d9d9d9;
    }
    @media screen and (max-width: 360px){
      .accountCont{
        padding-bottom: 120/40rem;
      }
    }
    .personBox{
      .cellValueBox{
        display: inline-block;
        height: 60/40rem;
        line-height: 60/40rem;
      }
      i{
        display: inline-block;
        font-style: normal;
        vertical-align: top
      }
      .arrow{
        width: 60/40rem;
        height: 60/40rem;
        background: url('../../assets/img/index/my_arrow_right@2x.png') no-repeat bottom center ;
        background-size: 100%;
      }
    }

</style>
<style lang='less'>
  .personBox .weui-cells:before,.personBox .weui-cell:before{
    border-top:none;
  }
  .personBox .weui-cells{
    font-size: 30/40rem;
  }
  .personBox .weui-cell__ft{
    font-size: 24/40rem;
  }
  .accountCont .weui-cells:after{
    border-bottom:none!important;
  }
  .accountCont .weui-cell_access .weui-cell__ft:after{
    border: none
  }
</style>

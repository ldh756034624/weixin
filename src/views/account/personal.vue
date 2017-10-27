<template>
	<div class="page accountPage">
      <div class="bgBlue"></div>
      <div class="accountCont">
          <div class="accountUser personBox">

                  <div class="accountUserTop">
                  <router-link to='/account/perMsg'>
                      <div class="accountUserImg">
                          <span :style="styles"></span>
                      </div>
                      <p>{{personalData.nickname}}</p>

                      <p v-if="!userok" class="credit">登录/注册</p>
              </router-link>
                      <p v-if="userok" class="credit" v-bind:class="{ creditok: personalData.isZmAuthorize }" @click="zmgo"><span v-bind:class="personalData.isZmAuthorize ? 'creditIcon': 'crediterrIcon'"></span>{{personalData.isZmAuthorize?'芝麻信用 '+personalData.zmEvaluate: '芝麻信用未认证'}}</p>
                  </div>
              <group class='cellMrg' v-bind:class="{ err: !userok}">
                <cell title="我的账户" @click.native='gohybAccount()'>
                  <img slot="icon" width="23" style="display:block;margin-right:10px;"
                  src="../../assets/img/personal/myaccount.png">
                </cell>
              </group>
          </div>

              <group class='personBox'>
                  <cell title="我发布的" link='/account/mypublish' >
                      <img slot="icon" width="23" style="display:block;margin-right:10px;"
                      src="../../assets/img/personal/mypublish.png">
                  </cell>
                  <cell title="我卖出的" link='/account/mysell' >
                      <img slot="icon" width="23" style="display:block;margin-right:10px;"
                     src="../../assets/img/personal/myselled.png">
                  </cell>
                  <cell title="我买到的"  link='/account/mybuy'>
                      <img slot="icon" width="23" style="display:block;margin-right:10px;"
                      src="../../assets/img/personal/mybuy.png">
                  </cell>
                  <cell title="我收藏的" link='/account/mycollection' >
                      <img slot="icon" width="23" style="display:block;margin-right:10px;"
                      src="../../assets/img/personal/mycoleection.png">
                  </cell>

              </group>

          <group class='personBox mrgBottom'>
              <cell title="更多设置" link='/account/moreset'>
                  <img slot="icon" width="23" style="display:block;margin-right:10px;"
                  src="../../assets/img/personal/myset.png">
              </cell>
          </group>
      </div>
      <!-- <setNick></setNick> -->
      <Bottombar :index="2"></Bottombar>
  </div>
</template>
<script>
import {Group,Cell} from 'vux'
import uploadHeadImg from '@/components/uploadHeadImg'
import userImg from '@/assets/img/personal/user.png'
import Bottombar from '@/components/BottomBar'
 import setNick from '@/components/index/setNick'

// var url = require('aUrl')
export default {
  mounted(){
    let  self=this;
    self.setTitle('个人中心');
    if (JSON.parse(localStorage.getItem('_user'))) {
      self.init();
      self.userok = true
      self.styles = {
        backgroundImage:`url(${JSON.parse(localStorage.getItem('_user')).img})`
      }
      
    } else {
      self.styles = {
        backgroundImage:`url(${self.userimg})`
        }
    }

  },
  data () {
    return {
      personalData:{},
      userok: false,
      userimg: userImg,
      styles: {},
    }
  },
  methods:{
    init(){
      let self = this
      self.$http.get('/sh/ja/v1/user/msg')
        .then(function(res) {
          if(res.data.statusCode==0){
              self.personalData=res.data.data
              localStorage.setItem('_user',JSON.stringify(res.data.data))
          }
        })
    },
    zmgo() {
      let self = this
      if (self.personalData.isZmAuthorize) {
        return
      }
      self.$http.get('/sh/ja/v1/zm/getAuthInfoAuthorize')
        .then(function(res) {
          if(res.data.statusCode==0){
               window.location.href = res.data.data
          }
        })
    },
    gohybAccount(){
      let self = this;

      let hyburl = '',windowUrl=document.location.href.split('#')[0]
      if (windowUrl.indexOf('localhost:8080')!=-1 || windowUrl.indexOf('dev-usedgoods.thy360.com/used_good')!=-1) {
        hyburl = 'https://api-devtest-hyb.thy360.com'
      } else if (windowUrl.indexOf('weixin-usedgoods.thy360.com')!=-1) {
        hyburl = 'https://hybapi.thy360.com'
      }
      window.location.href=hyburl+"/hyb/#!/home/?appId=appidzzerhuo0vyokl&token="+JSON.parse(localStorage.getItem('_user')).token
    }
  },
   components: {
    Group,
    uploadHeadImg,
    Cell,
    Bottombar,
    setNick,
    Cell
  },
}

</script>

<style scoped lang='less'>
    .bgBlue{
      background-color: #38446A;
      height: 8rem;
    }
    .mrgBottom{
      margin-bottom: 4rem;
    }
    .accountPage{
      background-color: #f0f0f0;
      overflow: auto;
      position: relative;
      z-index: 999;
    }
    .accountCont{
      padding: 0 0.6rem 0.3rem;
    }
    .personBox{
      background-color: #fff;
      border-radius: 10/40rem;
      margin-top: -20/40rem;
    }
    .accountUser{
        margin-top: -3rem;
        position: relative;
        line-height: 56/40rem;
    }
    .accountUserTop{
      position: absolute;
      width: 100%;
      text-align: center;
      font-size: 34/40rem;
      color: #222;
    }
    .credit{
      font-size: 30/40rem;
      color: #666;
    }
    .credit.creditok {
      color: #29AB91;
    }
    .creditIcon{
      background:url('../../assets/img/mian/credit.png') no-repeat center;
      background-size:100%;
      display: inline-block;
      width: 24/40rem;
      height:28/40rem;
      margin-right: 0.3rem;
    }
    .crediterrIcon{
      background:url('../../assets/img/mian/crediterr.png') no-repeat center;
      background-size:100%;
      display: inline-block;
      width: 24/40rem;
      height:28/40rem;
      margin-right: 0.3rem;
    }
    .cellMrg{
      padding-top: 6rem;
    }
    .cellMrg.err {
      padding-top: 4rem;
    }
    .accountUserImg{
      width: 184/40rem;
      height: 184/40rem;
      margin: -2.5rem auto 0.5rem;
    }
    .accountUserImg img,.accountUserImg span{
      display: inline-block;
      width: 100%;
      height: 100%;
      border-radius: 99/40rem;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-color: #f0f0f0;
    }

</style>
<style type="text/css" lang='less'>
  .personBox .vux-cell-primary{
    font-size: 30/40rem;
    color: #666;
  }
</style>
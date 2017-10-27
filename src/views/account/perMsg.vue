<template>
	<div class="page">
      <div  class="persMsg">
          <group class='personBox radius'>
                  <cell title="头像" >
                      <!-- <img  src="../../assets/img/personal/mypublish.png"> -->
                      <div class="userhead">
                          <uploadHeadImg ref='headImg'></uploadHeadImg>
                      </div>
                  </cell>
                  <router-link to='/account/setNick'>
                    <div class='persnickName'>
                        <span class='persnickSpan'>昵称</span>
                        <p class="persnickText">{{nickname}}</p>
                        <span class='iconArrow'></span>
                    </div>
                  </router-link>
                  <!-- <cell title="昵称" class='persnickName' link='/account/setNick' v-model='nickname2' is-link>

                  </cell> -->
          </group>
      </div>

  </div>
</template>
<script>
import {Group,Cell} from 'vux'
import uploadHeadImg from '@/components/uploadHeadImg'

// var url = require('aUrl')
export default {
  mounted(){
    this.setTitle('个人信息');
    if (localStorage.getItem('_user')) {
      this.init();
      this.nickname = JSON.parse(localStorage.getItem('_user')).nickname
    } else {
      _g.toastMsg('error', '未登录')
      setTimeout(() => {
        router.push({path: '/login?path=/account/permsg', replace: true})
      }, 1500)
    }
  },
  data () {
    return {
      nickname: '',
      nickname2: '000000000000000000000000000000000000'
    }
  },
  methods:{
    init(){
      let self=this;
      // 获取缓存，不需要重新请求 meow.zhong 2017/6/15
      // self.$http.get('/sh/ja/v1/user/msg')
      //   .then(function(res) {
      //     if(res.data.statusCode==0){
      //         self.personalData=res.data.data
      //     }
      //   })
    }
  },
   components: {
    Group,
    uploadHeadImg,
    Cell
  },
}

</script>

<style scoped lang='less'>
    .persMsg{
      margin: 10/40rem 20/40rem;
      border-radius: 15/40rem;
    }
    .userhead{
      width: 100/40rem;
      height: 100/40rem;
    }
</style>
<style type="text/css" lang='less'>
    .persMsg .vux-no-group-title:before{
      border-top: none!important;
    }
    .persnickName .weui-cell__ft{
      flex:4;
      overflow: hidden;
      padding-right: 10/40rem;
    }
    .persnickSpan{
      width: 100/40rem;
    }
    .persnickName{
      border-top: 1px solid #e2e2e2;
      display: flex;
      margin: 0 30/40rem;
      padding: 20/40rem 0;
      color: #222;
    }
    .persnickText{
      flex:1;
      overflow: hidden;
      color: #222;
      text-align: right;
    }
    .iconArrow{
      display: inline-block;
      width: 30/40rem;
      height: 30/40rem;
      margin-top: 10/40rem;
       background:url('../../assets/img/personal/iconfontBack.png') no-repeat center; 
      background-size: 100%;
      vertical-align: middle;
    }
</style>
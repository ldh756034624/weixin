<template>
	<div class="page">
      <div  class="persMsg">
          <group class='personBox radius'>
                  <x-input placeholder="请输入您要修改的昵称" v-model='nickname' :max='20'></x-input>
          </group>
          <group class='mrgT30'>
              <x-button class='nickBtn BlueBtn' @click.native='changeUser'>保存</x-button>
          </group>
      </div>

  </div>
</template>
<script>
import {Group,Cell,XInput,XButton} from 'vux'
import uploadHeadImg from '@/components/uploadHeadImg'

// var url = require('aUrl')
export default {
  mounted(){
    this.setTitle('昵称设置');
  },
  data () {
    return {
      nickname:JSON.parse(localStorage.getItem('_user')).nickname
    }
  },
  methods:{

    changeUser(){
      let self = this
      self.nickname = self.nickname.replace(/\s/g,"")
      if (self.nickname == '') {
        _g.toastMsg('error', '昵称不能为空')
        return
      }
      var _user=JSON.parse(localStorage.getItem('_user'));
      // console.log(_user)
      var user={
        avatar:JSON.parse(localStorage.getItem('_user')).img,
        nickname:self.nickname,
        sex:JSON.parse(localStorage.getItem('_user')).sex,
      }
      self.$http.post('/sh/ja/v1/user/edit',user)
        .then(function(res) {
          if(res.data.statusCode==0){
            _user.nickname=self.nickname;
            localStorage.setItem("_user", JSON.stringify(_user));
            _g.toastMsg('success', '修改成功')
            setTimeout(() => {
                self.$router.go(-1)
              }, 1500)
          }
        })
    }
  },
   components: {
    Group,
    uploadHeadImg,
    Cell,
    XButton,
    XInput
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
    .mrgT30{
      margin-top: 60/40rem;
    }
</style>
<style type="text/css" lang='less'>
    .persMsg .vux-no-group-title:before{
      border-top: none!important;
    }
</style>
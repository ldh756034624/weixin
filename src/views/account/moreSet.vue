<template>
  <div class="page">
    <div class="moreSet">
        <div class="setBox">
            <router-link to="/account/advice">
              <p class="vux-1px-b">用户反馈</p>
            </router-link>
            <router-link to="/account/aboutUs">
            <p>关于我们</p>
            </router-link>
        </div>
        <div class="setBox">
            <p @click='loginout'>退出登录</p>
        </div>
    </div>
    <confirm v-model="show"
      title="确定退出？"
      @on-confirm="onConfirm" class='loginOutConf'>
      </confirm>

  </div>
</template>

<script>
import {Confirm} from 'vux'
// var url = require('aUrl')
export default {
  mounted(){
    let self=this;
    self.setTitle('更多设置');
  },
  data () {
    return {
      show:false,
    }
  },
  methods:{
    loginout(){
      this.show=true;
    },
    onConfirm () {
      delete localStorage._user;
      _g.toastMsg('success', '退出登录成功')
      setTimeout(() => {
        this.$router.replace({path:'/account/personal'});
      }, 1500)
    },
  },
  components: {
    Confirm
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
    .moreSet{
      margin: 0 20/40rem;
    }
    .setBox{
      background-color: #fff;
      border-radius: 15/40rem;
      margin-top: 20/40rem;
      padding: 0 30/40rem;
      border:1px solid #F0F0F0;
    }
    .setBox p{
      padding: 30/40rem 0;
      text-align: center;
      color: #999;
      font-size: 30/40rem;
    }

</style>
<style >
  .moreSet .vux-1px-b:after{
    border-bottom: 1px solid #e2e2e2;
  }
  .loginOutConf .weui-dialog__bd{ 
    height: 0;
    min-height: 20px;
    padding: 0!important
  }
  .weui-toast_success{
    min-height: 6rem!important;
  }
</style>

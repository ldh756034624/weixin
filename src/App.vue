<template>
  <div id="app">
	    <router-view></router-view>
      <div class="loading" v-show='loadingShow'>
        <div class="cellBox">
          <img :src="lodingImg">
          <p>正在加载中</p>
        </div>
      </div>
  </div>
</template>

<script>
import {ViewBox,TransferDom,XDialog,XButton} from 'vux'
import Bottombar from '@/components/BottomBar'
import blankPage from '@/components/blankPage'
import wx from 'weixin-js-sdk'
export default {
  name: 'app',
  components: {
    ViewBox,Bottombar,blankPage,TransferDom,XDialog,XButton
  },
  directives: {
    TransferDom
  },
  mounted(){
    let self=this;
    self.wxSign();
    self.loadingShow=this.$store.state.showLoading
  },
  beforeUpdate: function () {
    let self=this;
    self.loadingShow=this.$store.state.showLoading
  },
  data(){
    return {
      loading:this.$store.state.showLoading,
      loadingShow:true,
      lodingImg:require('./assets/img/blank/loading.gif')
    }
  },
  methods: {
  	isTabbar(){
  	  let path = this.$route.path;
     if(path == '/' || /index/.test(path) || /account/.test(path) || /shop/.test(path)){
  	  	return true;
  	  }else{
  	  	return false;
  	  }
    },
    wxSign: function(){   //获取微信分享签名参数
      let self = this
      let rcmurl = "/h9/api/wechat/config";
      self.$http.get(rcmurl)
        .then(function(res) {
          if(res.data.code==0){
            console.log(res.data.data)
            self.wxConfig(res.data.data);
          } else {
            _g.toastMsg('error', res.data.msg)
          }
        })
    },
    wxConfig: function(config){   //微信分享参数初始化
      let self = this;
      wx.config({
        debug: false,
        appId: config.appId,
        timestamp: config.timestamp,
        nonceStr: config.nonceStr,
        signature: config.signature,
        jsApiList: ['getLocation','scanQRCode'],
      });
      wx.ready(function(){
          self.getLocal();
      });
    }
  },
}

</script>
<style scoped lang='less'>
  .loading{
    position: fixed;
    z-index: 9;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    display: table;
    .cellBox{
      display: table-cell;
      vertical-align: middle;
      width: 3rem;
      text-align: center;
      margin: 0 auto;
      font-size: 24/40rem;
    }
    img{
      width: 60/40rem;
      height: 60/40rem;
    }
    .loadingImg{
      display: inline-block;
      width: 60/40rem;
      height: 60/40rem;
      background: url('./assets/img/blank/loading.gif');
    }
  }
</style>
<style lang='less'>
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import './assets/css/common.less';
body {
  background-color: #fbf9fe;
}
.pbt0{
  #vux_view_box_body{
    padding-bottom: 0;
  }
}
.appDialogUnBox .weui-mask{
  display: inline-block!important;
}
.appDialogUnBox .weui-dialog{
  display: inline-block!important;
}
</style>

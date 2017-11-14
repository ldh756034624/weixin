<template>
  <div id="app">
	    <router-view></router-view>
      <!-- <div class="noNet" v-if='hasNetA==false && noLogin==false'>
          <blankPage  :text='text' v-show='!hasNetA' :images='blankImg'> </blankPage>
      </div>
      <div class="noLogin" v-if='hasNetA==false && noLogin==true'>
          <blankPage  :text='loginText' v-show='noLogin' :blankType='blankType'> </blankPage>
      </div> -->
      <div v-transfer-dom>
        <x-dialog v-show="!dialogShow" class="dialogUnBox appDialogUnBox">
          <div>
            {{dialogText}}
          </div>
          <x-button mini class="dialogSureBtn" @click.native="gologin()" >确定</x-button>
        </x-dialog>
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
  },
  data(){
    return {
      text:'网络出故障了,点击重新加载哦～',
      hasNetA:true,
      blankImg:'',
      dialogShow:true,
      dialogText:'',
      loginText:'暂时没有登录,登录有惊喜！',
      noLogin:false,
      blankType:'noLogin',
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
        debug: true,
        appId: config.appId,
        timestamp: config.timestamp,
        nonceStr: config.nonceStr,
        signature: config.signature,
        jsApiList: ['getLocation','scanQRCode'],
      });
      wx.ready(function(){
          self.getLocal();
          console.log("=====self.getLocal()======")
          console.log(self.getLocal())
      });
    }
  }
}

</script>
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
.noLogin{
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>

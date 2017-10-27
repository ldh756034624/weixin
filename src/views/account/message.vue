<template>
<div class="page" transition="app">

    <tab :line-width=2    active-color='#38446a' :custom-bar-width="getBarWidth" >
        <tab-item selected @on-item-click="onItemClick">对话</tab-item>
        <tab-item @on-item-click="onItemClick">通知</tab-item>
      </tab>
    <div class="content message">
      <group title="">
        <cell title="留言" is-link link="/message/comment">
          <!-- <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/img/xx.png"> -->
          <span>{{msgcount.message}}</span> 
        </cell>
<!--         <cell title="私信" is-link>
          <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/img/sx.png">
          <span>{{msgcount.private}}</span> 
        </cell> -->
        <cell title="系统通知" is-link link="/message/system">
          <!-- <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/img/tz.png"> -->
          <span>{{msgcount.notice}}</span>
        </cell>
      </group>
    </div>
    <div class="noNet">
        <blankPage  :text='text' v-show='!hasNet' :images='blankImg'> </blankPage>
    </div>

  <!--bottom slot-->
  <Bottombar :index="3"></Bottombar>

</div>
</template>

<script>
import { Tab, TabItem, Cell, Group} from 'vux';
import Bottombar from '@/components/BottomBar'
// var url = require('aUrl');
export default {
  mounted() {
    this.setTitle("消息");
    let self=this;
    this.getUnreadSystemmsg();
    this.getUnreadComments();
  },
  data() {
    return {
      toast : {
        show : false,
        msg: '验证码发送成功'
      },
      msgcount:{
        message: 0,  //留言
        private: 0,  //私信
        notice: 0,  //通知
      },
      text:'网络出故障了,点击重新加载哦～',
      hasNet:false,
       // blankImg:'../../../assets/img/search/up-down.png'
       blankImg:require('../assets/img/blank/net.png')
    };
  },
  methods:{
    getUnreadComments: function(){    //获取未读留言条数
      let self = this
      let rcmurl = "/sh/ja/v1/comments/unread";
      self.$http.get(rcmurl)
	    .then(function(res) {
	      if(res.data.statusCode==0){
	        self.msgcount.message = res.data.data;
	      } else {
	        self.$vux.toast.show({
                  text:  res.data.msg,
                  type: 'text',
              })
	       }
	    })
    },
    getUnreadSystemmsg: function(){    //获取未读系统消息数
      let self = this
      let rcmurl = "/sh/ja/v1/systemmsg/unread";
      self.$http.get(rcmurl)
      .then(function(res) {
        self.hasNet=true;
        if(res.data.statusCode==0){
          self.msgcount.notice = res.data.data;
        } else {
          self.$vux.toast.show({
                  text:  res.data.msg,
                  type: 'text',
              })
         }
      })
    },
    onItemClick(){

    },
    getBarWidth: function (index) {
      return   25 + 'px'
    }
  },
  components: {
    Tab, 
    TabItem,
    Cell,
    Group,
    Bottombar
  }
}
</script>
<style scoped lang='less'>
  .noNet{
    position: fixed;
    height: 100%;
    width: 100%;
    z-index: 99;
    background-color: #fff;
  }
  .content{background-color: #f1f1f1;}
</style>
<style lang='less'>
  .content.message{
    .weui_cells{
      margin-top: 0;
    }
    .weui_cell{
      padding: 0 30/40rem;
      line-height: 126/40rem;
      img{width: 70/40rem;height: 70/40rem;margin-right: 30/40rem !important;}
      .weui_cell_ft{
        span{
          font-size: 30/40rem;
          color: #999;
        }
      }
      .weui_cell_bd{
        p{font-size: 30/40rem;}
      }
    }
  }
</style>
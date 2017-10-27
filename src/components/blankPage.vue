<template>
		<div class="tableBox">
			<div class="cellbox" >
				<div class="blackCont">
          <img :src='images' v-show='!isNoImg'>
          <img src='../assets/img/blank/net.png' v-if='isNoImg==true && noLogin==false'>
          <img src='../assets/img/blank/noLogin.png' v-if='isNoImg==true &&noLogin==true'>
					<p>{{text}}</p>
          <x-button mini v-show='showReload' class='blankPageBtn' @click.native="reload">重新加载</x-button>
          <!-- <x-button mini v-show='showPublish' class='blankPageBtn' @click.native="goPublish">去发布</x-button> -->
          <x-button mini v-show='noLogin' class='blankPageBtn' @click.native="goLogin">去登录</x-button>
				</div>
			</div>
		</div>
</template>

<script>

// var url = require('aUrl');
import {XButton} from 'vux'
export default {
  mounted() {
    let self=this;
    if(!self.images ){
      self.isNoImg=true;
    }
    if(self.blankType=='noLogin'){
      self.noLogin=true
    }
    if((self.text).indexOf('网络')!=-1){
      self.showReload=true;
    }
    if((self.text).indexOf('暂时没有相关商品呢')!=-1){
      self.showPublish=true;
    }
  },
   props:{
    images: {
      type: String,
      default: ""
    },
    text:{
      type: String,
      default: ""
    },
    blankType:{
      type: String,
      default: ""
    },
  },
  data() {
    return {
      showReload:false,
      showPublish:false,
      isNoImg:false,
      noLogin:false,
    }
  },
  methods:{
    reload:function(){
        let self=this;
        window.location.reload()
    },
    goPublish:function(){

    },
    goLogin:function(){
      let self=this;
      self.noLogin='goLogin'
      self.$router.push({path:'/login'})
    }
  },
  components: {
    XButton
  }
}
</script>
<style scoped lang='less'>
    .tableBox{
    	display: table;
    	width: 100%;
    	height: 100%;
    	vertical-align: middle;
      position: relative;
      background-color: #fff;
    }
    .cellbox{
    	display: table-cell;
    	vertical-align: middle;
    }
    .blackCont{
    	text-align: center;
      margin-top: -120/40rem;
    }
    .blackCont img{
      width: 330/40rem;
      margin-top: -150/40rem;
    }
    .blackCont p{
    	margin-top: 15/40rem;
    	font-size: 30/40rem;
      color: #999;
    }
    .blankPageBtn{
      background-color: #38446A;
      color: #fff;
      border-radius: 99/40rem;
      margin-top: 1.5rem;
    }
</style>
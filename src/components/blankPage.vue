<template>
		<div class="tableBox">
			<div class="cellbox" >
				<div class="blackCont">
          <div v-if="blankType==='order'">
            <img src='../assets/img/blank/img_ordererror@2x.png' >
            <p>还未下单</p>
          </div>
          <div v-if="blankType==='cupon'">
            <img src='../assets/img/blank/img_couponerror@2x.png' >
            <p>还未获得卡券</p>
          </div>
          <div v-if="blankType==='particulars'">
            <img src='../assets/img/blank/img_detailerror@2x.png' >
            <p>目前没有交易明细</p>
          </div>
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
    
  },
   props:{
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
      width: 250/40rem;
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
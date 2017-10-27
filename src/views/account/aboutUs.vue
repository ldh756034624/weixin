<template>
  <div class="page">
    <div class="moreSet">
        <div class="aboutUsBox">
            <cell title='联系我们' value='zhuzhujishi@hey900.com'></cell>
        </div>
        <div class="aboutUsBox">
            <cell title='平台规范' @click.native='showdeal1=true' is-link></cell>
            <cell title='服务条款' @click.native='showdeal2=true' is-link></cell>
        </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="showdeal1" height="100%" class='dealPopup'>
        <platformDeal v-model="showdeal1" v-on:listenToDealShow='dealShowFn1'></platformDeal>
      </popup>
    </div> 
    <div v-transfer-dom>
      <popup v-model="showdeal2" height="100%" class='dealPopup'>
        <waiterDeal v-model="showdeal2" v-on:listenToDealShow='dealShowFn'></waiterDeal>
      </popup>
    </div>   
  </div>
</template>

<script>
import {Cell,Popup,TransferDom} from 'vux'
import platformDeal from '../deal/platformDeal'
import waiterDeal from '../deal/waiterDeal'
export default {
  directives: {
    TransferDom
  },
  mounted(){
    let self=this;
    self.setTitle('关于我们');
  },
  data () {
    return {
      show:false,
      showdeal1:false,
      showdeal2:false,
    }
  },
  methods:{
    loginout(){
      this.show=true;
    },
    dealShowFn:function(data){
      let self=this;
      if(data==false){
        self.showdeal2=false
      }
    },
    dealShowFn1:function(data){
      let self=this;
      if(data==false){
        self.showdeal1=false
      }
    }
  },
  components: {
    Cell,waiterDeal,platformDeal,Popup,TransferDom,  
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
    .moreSet{
      margin: 0 20/40rem;
    }
    .aboutUsBox{
      background-color: #fff;
      border-radius: 15/40rem;
      margin-top: 20/40rem;
      padding: 0 30/40rem;
      border:1px solid #F0F0F0;
      font-size: 26/40rem;
    }
    .aboutUsBox p{
      padding: 30/40rem 0;
      text-align: center;
      color: #999;
      font-size: 30/40rem;
    }
    .dealPopup{
      font-size: 26/40rem;
      background-color: #fff;
      overflow: auto;
      line-height: 50/40rem;
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

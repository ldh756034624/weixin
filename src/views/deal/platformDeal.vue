<template>
	<div class="dealPopup">
      	<input ref='input' v-bind:value='value' style="display:none">
        <div class="popup1">
          <p v-show='show' @click='show=false' class="alignR">X</p>
          <p class='dealName'>用户协议</p>
          <div v-html='DealData'>
            
          </div>
        </div>
  </div>
</template>    
<script>
import { Popup,TransferDom} from 'vux'
export default {
  directives: {
    TransferDom
  },
  mounted () {
    let self=this;
    this.setTitle("用户协议");
    self.getDeal('serviceProtocol').then(function(data){
      self.DealData=data.data
    })
  },
  props:{
  	value:'',
  },
  data () {
    return {
    	show:false,
      DealData:''
    }
  },
  methods:{
  },
  watch: {
  	value(val){
  		if(val){
	  		this.show=true;
  		}
  	},
  	show(val){
      let self=this;
  		if(!val){
  			self.$emit("listenToDealShow",val)
  		}
  	}
	},
   components: {
    Popup,
    TransferDom,  
  },
}

</script>

<style scoped lang='less'>
    .dealPopup{
      font-size: 26/40rem;
      background-color: #fff;
      overflow: auto;
      line-height: 50/40rem;
      height: 100%;
      position: absolute;
      z-index: 999;
    }
    .popup1{
      padding: 30/40rem;
    }
    .dealName{
      text-align: center;
      font-size: 34/40rem;
      margin-bottom: 20/40rem;
      font-weight: 600;
    }
    .dealTitle{
      font-size: 28/40rem;
      margin: 10/40rem 0;
      font-weight: 600;
    }
</style>
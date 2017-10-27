<template>
	<div class="collectionTpl">
		<span  @click='collecFn'
		:class="[colleced ? 'collectionStarLight':'collectionStar']"></span>
	</div>
</template>
<script>
import {  Group, XInput,Datetime } from 'vux'
// var url = require('aUrl')
export default {
  mounted(){
  	let self=this;
    console.log("=======")
    
  	setTimeout(()=>{
  		if(self.datas.status==1){
	  		self.colleced=true
	  	}else{
	  		self.colleced=false
	  	}
	  },150)

  },
  props:{
    datas: {
      type: Object,
      default: ""
    }
  },
  data () {
    return {
    	colleced:false
    }
  },
  methods:{
  	collecFn(){
  		let self = this
      var userdatas = JSON.parse(localStorage.getItem('_user'));
      if(!userdatas){
         this.$router.push({path: '/login',query:{path:this.$route.path,goodId:this.$route.query.goodId,tableId:this.$route.query.tableId}})
      }else{
          if (self.colleced) {
            self.datas.status = 0
          } else {
            self.datas.status = 1
          }
          self.$http.post('/sh/ja/v1/favorites/update',self.datas)
            .then(function(res) {
              if(res.data.statusCode==0){
                self.colleced = !self.colleced
                var toastText='';
                if(self.datas.status == 0){
                   toastText='取消收藏'
                }else{
                    toastText='收藏成功'
                }
                self.$vux.toast.show({
                    text:  toastText,
                    type: 'text'
                })
              }
            })
      }
  		
  	}
  },
   components: {
    Group,
    XInput,
    Datetime
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
	.collectionTpl,.collectionTpl span{
		display: inline-block;
		width: 100%;
		height: 100%;
	}
  .collectionStar{
    background:url('../assets/img/personal/Star.png') no-repeat center;
    background-size: 50%;
  }
  .collectionStarLight{
    background:url('../assets/img/personal/StarCollecLight.png') no-repeat center;
    background-size: 50%;
  }
</style>

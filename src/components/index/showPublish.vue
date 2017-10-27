<template>
<div>

    <div class="addPublish" @click="getZmAuthorize()"></div>
	<div v-transfer-dom>
      <popup v-model="showPublishPop" class="indexPopup" height='100%'>
      <div class="indexPopupBox">
        <div class="dialogUnSayText" v-show='publisShowShade'> {{dialogUnSayText}}</div>
        <div class="publisBottomShadeBox" v-show='publisShowShade'></div>
        <div class="publisBottomBox">
          <div class="publisBottomFlex">

              <router-link to="/sale/publish?publishType=2">
              <span class="icon pubSaleIcon"></span>
              <p>拍卖</p>
              </router-link>
          </div>
          <div class="publisBottomFlex">
              <router-link to="/unused/publish?publishType=1">
                <span class="icon pubUnusedIcon"></span>
                <p>闲置</p>
              </router-link>
          </div>
          <div class="publisBottomFlex">

              <router-link to="/donate/publish?publishType=3">
              <span class="icon pubDonateIcon"></span>
              <p>捐赠</p>
              </router-link>
          </div>
        </div>
        <p class="closeIndexPop"><img src="../../assets/img/index/CombinedShape@2x.png" @click='showPublishPop=false' ></p>
      </div>  
      </popup>
      
    </div>
</div>
</template>
<script>
import {TransferDom, Popup} from 'vux'
export default {
  directives: {
    TransferDom
  },
  props: {
    showPublish: {
      type: Boolean
    }
  },
  mounted(){
  },
  data(){
    return {
    	showPublishPop:false,
    	publisShowShade:false,
      	dialogUnSayText:''
    }
  },
  methods: {
  	getZmAuthorize(){
	  	let self=this
	  	var userdatas = JSON.parse(localStorage.getItem('_user'));
	  	if(!userdatas){
	         this.$router.push({path: '/login',query:{path:this.$route.path}})
	     }else{
	     	self.$http.get('/sh/ja/v1/shutup/info')
	        .then(function(res) {
	          self.showPublishPop=true
	          console.log("=================")
	          console.log(self.showPublishPop)
	          if(res.data.statusCode==4006){
	          	self.publisShowShade=true;
	          	self.dialogUnSayText=res.data.msg
	          }else  if(res.data.statusCode==0){
				self.publisShowShade=false;
	          }
	        })
	     }
	  },
  },
  
  components: {
     TransferDom, Popup,
  },
}

 
</script>
<style scoped lang='less'>
	.addPublish{
	  position: fixed;
	  z-index: 999;
	  width: 143/40rem;
	  height: 143/40rem;
	  bottom: 128/40rem;
	  right: 40/40rem;
	  background:url('../../assets/img/index/addPublish.png') no-repeat center; 
	  background-size: 100%; 
	}
	.publisBottomBox{
	  display: flex;
	}
	.publisBottomFlex{
	  flex:1;
	  text-align: center;
	  color: #222;
	  font-size: 30/40rem;
	  padding: 1rem 0;
	  margin-bottom: 2rem;
	}
	.publisBottomShadeBox{
		position: fixed;
		z-index: 9999999;
		width: 100%;
		height: 6.5rem;
		bottom: 5rem;
		background-color: rgba(0,0,0,0.5);
	}
	.dialogUnSayText{
		font-size: 32/40rem;
		color: #FA5B5B;
		padding: 2rem;
		text-align: center;
	}
	.indexPopup{
	  background: rgba(252,254,255,0.9);
	  position: fixed;
	  z-index: 999;
	}
	.indexPopupBox{
	  position: absolute;
	  bottom: 0.5rem;
	  width: 100%;
	}
	.closeIndexPop{
	  text-align: center;
	  border-top:1px solid #e2e2e2;
	  padding-top:20/40rem;
	}
	.closeIndexPop img{
	  width: 34/40rem;
	  height: 34/40rem;
	}
	.publisBottomFlex a{
	  color:#222
	}
	.publisBottomFlex span{
	  display: inline-block;
	  width: 120/40rem;
	  height: 120/40rem;
	  border-radius: 200/40rem;
	  margin-bottom: 20/40rem;
	}
	.pubSaleIcon{
	  background:url('../../assets/img/index/Group2@2x.png') no-repeat center; 
	  background-size: 100%; 
	}
	.pubUnusedIcon{
	  background:url('../../assets/img/index/Group3@2x.png') no-repeat center; 
	  background-size: 100%; 
	}
	.pubDonateIcon{
	  background:url('../../assets/img/index/Group4@2x.png') no-repeat center; 
	  background-size: 100%; 
	}
</style>
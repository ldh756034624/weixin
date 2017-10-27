<template>
	<div class="myGoodsTpl" @click.stop="godetail">
		<h4>{{gooddata.title}}</h4>
		<scroller lock-y :scrollbar-x=false >
            <div class="box1" v-bind:style="{width:imagesLen*5.35-0.5+'rem'}">
              <div class="box1-item" v-for="item in gooddata.images" >
                  <img :src="item">
              </div>
            </div>
        </scroller>
        <p v-if="tableId!='2'">
	        <span class="oldPrice" v-if="tableId=='0'">￥{{!gooddata.auctionStartDate?gooddata.originPrice:gooddata.startPrice | price2}}</span>
	        <span class='nowPrice'><i>￥</i>{{!gooddata.auctionStartDate?gooddata.sellingPrice :gooddata.startPrice | price2}}</span>
        </p>
        <section class="describe">
        	<article>
        		<p class="font14">{{gooddata.content}}</p>
        	</article>
        	<div class='goodAddrText'>
        		<img src='../assets/img/index/dingwei@2x.png' class="adressIcon">
        		<span >{{gooddata.city}}.{{gooddata.district}}</span>
        		<span class="right"><span class='star' :class="[gooddata.favoritesStatus==1?'starLight':'star' ]"></span><span style="vertical-align: -4px;">{{gooddata.favoritesCount}}</span></span>
        	</div>
        </section>
	</div>
</template>
<script>
import {Scroller} from 'vux'
export default {

  data () {
    return {
    	imagesLen:this.gooddata.images.length,
    	oldPrice:0.00,
    	nowPrice:0.00,
    }
  },
  mounted () {
    let self=this;
    /*setTimeout(function(){
    	self.oldPrice=!self.gooddata.auctionStartDate?self.gooddata.originPrice:self.gooddata.startPrice;
    	self.nowPrice=!self.gooddata.auctionStartDate?self.gooddata.sellingPrice:self.gooddata.startPrice
    },100)*/
    
  },
  methods: {
  	godetail(){
  		this.$router.push({path:'/unused/detaile',query: { tableId:(this.tableId+1),goodId:this.gooddata.id}})
  	}
  },
  props: {
    gooddata: {
      type: Object,
      default: ""
    },
    tableId: {
      type: Number,
      default: 0
    }
  },
  components: {
    Scroller,
  }

}
</script>
<style scoped lang='less'>
	.myGoodsTpl{
		padding: 30/40rem;
		background-color: #fff;
		margin-top: 18/40rem;
	}
	.myGoodsTpl h4{
		font-size: 34/40rem;
		margin-bottom: 10/40rem;
	}
	.oldPrice{
		text-decoration:line-through;
		font-size: 24/40rem;
		color: #999;
		margin-right: 12/40rem;

	}
	.adressIcon{
		width: 24/40rem;
		height: 34/40rem;
		vertical-align:middle;
		margin-right:8/40rem;
	}
	.nowPrice i{
		font-size: 30/40rem;
		color: #FA5B5B;
		font-style: normal;
	}
	.nowPrice{
		font-size: 40/40rem;
		color: #FA5B5B;
	}
	.describe{
		color: #9A9A9A;
	}
	.font14{
		font-size: 28/40rem;
	}
	.goodAddrText{
		font-size: 22/40rem;
	}
	.star,.starLight{
		display: inline-block;
		width: 34/40rem;
		height: 34/40rem;
		vertical-align: middle;
		margin-right: 10/40rem;
	}
	.star{
		background:url('../assets/img/index/Star3@2x.png') no-repeat left center;
		background-size: 100%;

	}
	.starLight{
		background:url('../assets/img/personal/StarCollecLight.png') no-repeat left center;
		background-size: 100%;
	}
	.goods_user{
		vertical-align: middle;
	}
	.box1 {
	  height: 194/40rem;
	  position: relative;
	  width: 1490/40rem;
	  margin-bottom: 10/40rem;
	}
	.box1-item {
	  width: 194/40rem;
	  height: 194/40rem;
	  background-color: #ccc;
	  display:inline-block;
	  margin-left: 20/40rem;
	  float: left;
	  text-align: center;
	  line-height: 194/40rem;
	  overflow: hidden;
	}
	.box1-item:first-child {
	  margin-left: 0;
	}
	.box1-item img{
		width: 194/40rem;
		height: 100%;
	}
</style>
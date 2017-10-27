<template>
	<div class="userGoodTpl">
		<div class="goods_user ">
			<img :src="gooddata.avatar" class="goods_userHeadImg"/>
			<span class="goods_userNick ellipsis">{{gooddata.nickname}}</span>
			<span class="indexLabel" v-if="gooddata.label.name"  v-bind:style='{color:gooddata.label.color,borderWidth:"1px",borderStyle:"solid"}'>{{gooddata.label.name}}</span>
			<div class="goods_userRight" v-if='tableId==1'>
				<p class="redFont">¥{{gooddata.sellingPrice | price2}}</p>
			</div>
			<div class="goods_userRight" v-if='tableId==2'>
				<p class="redFont">¥{{salePrice | price2}}</p>
				<p>{{saleStatus}}</p>
			</div>
			
		</div>
		<scroller lock-y :scrollbar-x="false">
            <div class="box1" v-bind:style="{width:((datalength)*(240+20))/40+'rem'}">
	            <div class="box1-item" v-for="item in gooddata.images" >
	                <img :src="item">
	            </div>
            </div>
        </scroller>
        <section class="describe vux-1px-b">
        	<h4 class="font-one-line-ellipsis wordBreak">{{gooddata.title}}</h4>
        	<article>
        		<p class="desc">{{gooddata.content}}</p>
        	</article>
        	<div class="btom">
        		<img src='../assets/img/index/dingwei@2x.png' class="adressIcon">
        		<span>{{gooddata.city}}.{{gooddata.district}}</span>
        		<span class='right collectBox' v-if='tableId!=2'>
	        		<span  :class="[gooddata.favoritesStatus==1 ? 'starLight' :'star']" ></span>
	        		<span>{{gooddata.favoritesCount}}</span>
        		</span>
        		<span class='right collectBox' v-if='tableId==2'>
	        		<span>{{saleTime}}</span>
        		</span>
        	</div>
        </section>
	</div>
</template>
<script>
import {Scroller} from 'vux'
export default {

  data () {
    return {
      salePrice: 0.00,
      saleStatus:"已结束",
      saleTime:'',
      datalength:0,
    }
  },
  mounted () {
    let self=this;
    if(self.gooddata.images){
    	self.datalength=self.gooddata.images.length
    }
    
    var timestamp = Date.parse(new Date());
    self.salePrice=self.gooddata.auctionCurrentPrice
    if(timestamp<self.gooddata.auctionStartDate){
    	self.saleStatus='起拍价'
    	self.salePrice=self.gooddata.startPrice
    	self.formateSaleTime(self.gooddata.auctionStartDate,'开始') 
    }else if(timestamp>self.gooddata.auctionStartDate && timestamp < self.gooddata.auctionEndDate){
    	self.saleStatus=self.gooddata.auctionOfferCount+'次出价'
    	self.formateSaleTime(self.gooddata.auctionEndDate,'结束')
    }else{
    	self.saleStatus='已结束'
    }
  },
   methods: {
   	formateSaleTime:function(time,str){
   		let self=this;
   		var starstamp=new Date(time)
    	self.saleTime=self.add0(starstamp.getMonth()+1)+'-'+self.add0(starstamp.getDate())+' '+self.add0(starstamp.getHours())+":"+self.add0(starstamp.getMinutes())+str;
   	},
   	add0:function(m){
   		return m<10? '0'+m : m
   	}
  },
  props: {
    gooddata: {
      type: Object,
      default: ""
    },
    tableId:{
      type: Number,
      default: ""
    }
  },
   components: {
    Scroller,
  }

}
</script>
<style scoped lang='less'>
.desc {
	font-size: 14px;
    color: #666666;
    text-overflow: ellipsis;
    overflow: hidden;
    max-height: 80px;
    line-height: 21px;
    -webkit-line-clamp: 4;
    -ms-line-clamp: 4;
    -moz-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    -ms-box-orient: vertical;
    -moz-box-orient: vertical;
    box-orient: vertical;
    display: -webkit-box;
    display: -ms-box;
    display: -moz-box;
    display: box;
    word-wrap:break-word;
}
.indexLabel{
	display: inline-block;
	font-size: 24/40rem;
	line-height: 50/40rem;
	height: 50/40rem;
	margin-top: 10/40rem;
	padding: 0 10/40rem;
	border-radius: 20/40rem 0 20/40rem 0;
}
	.userGoodTpl{
		margin:15/14rem;
		border-top:1px solid #eee;
	}
	.describe{
		color: #666;
	}
	.goods_user{
		padding: 40/40rem 0 0 0;
		margin:0 0  30/40rem 40/40rem;
		color: #333;
		display: flex;
		font-size: 0;
		.goods_userNick{
			font-size: 32/40rem;
			display: inline-block;
			vertical-align: middle;
			flex:1;
			padding-right: 10/40rem;
			overflow: hidden;
			line-height: 80/40rem;
		}
	}
	.goods_userHeadImg{
		width: 70/40rem;
		height: 70/40rem;
		border-radius: 50%;
		vertical-align: middle;
		margin-right: 10/40rem;
	}
	.box1 {
		font-size: 0;
		padding: 0 30/40rem;
		.box1-item {
			width: 240/40rem;
			height: 240/40rem;
			display:inline-block;
			margin: 0 10/40rem;
			overflow: hidden;
			position: relative;
			img{
				display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%,-50%,0);
            -webkit-transform: translate3d(-50%,-50%,0);
				width:100%;
			}
		}
	}
	.describe{
		margin-left: 1rem;
		padding: 0 0 1/40rem 0;
		line-height:24px;
		color:#999;
		font-size:24/40rem;
		.btom{
			margin-top: 16/40rem;
			margin-bottom: 40/40rem;
			img,span{
				vertical-align: -webkit-baseline-middle;
			}
		}
		h4{
			color:#030303;
			font-size:30/40rem;
			line-height: 70/40rem;
		}
	}
	.adressIcon{
		width: 24/40rem;
		height: 33/40rem;
		vertical-align:middle;
		// margin-right: 10/40rem;
	}
	.collectBox{
		vertical-align: middle;
	}
	.collectBox span{
		display: inline-block;
		vertical-align: middle;
		text-align: center;
	}
	.star,.starLight{
		display: inline-block;
		width: 17/14rem;
		height: 17/14rem;
	}
	.star{
		background:url('../assets/img/index/Star3@2x.png') no-repeat center;
		background-size: 34/40rem 34/40rem;
	}
	.starLight{
		background:url('../assets/img/personal/StarCollecLight.png') no-repeat center;
		background-size: 34/40rem 34/40rem;
	}
	.goods_userRight{
		float: right;
		vertical-align: middle;
		display: inline-block;
		height: 70/40rem;
		line-height: 70/40rem;
		margin-left: 10/40rem;
		font-size: 28/40rem;
		text-align: center;
	}
</style>
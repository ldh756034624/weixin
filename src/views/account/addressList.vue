<template>
	<div class="page full-screen" transition="page">
		<div  v-show="noItem" class="content addrscroll-wrap">
			<!-- <scroller height="100%" lock-x scrollbar-y use-pulldown use-pullup @pulldown:loading="refresh"
	  :pullup-config="pullupConfig"  :pulldown-config="pulldownConfig" :pullup-config="pullupConfig" @pullup:loading="loadMore" v-ref:scroller> -->
				<!-- <scroller height='100%' class='addrScroller'> -->
				<div style="padding-bottom:60px;">
					<div @click="detail(item.id)" v-for="item in list">
						<div class="div-flex">
							<div class="flex-left">
								<div class="flex-name">
									<span class="text">{{item.contact}}</span>
									<span class="text">{{item.phone}}</span>
								</div>
								<div>
									<span class="text single-line">{{item.village}}{{item.room1}}</span>
								</div>
							</div>
							<div class="addrListChangeBtn" @click.stop="edit(item.id)">
								<x-button class="btn-edit">修改</x-button>
							</div>
						</div>
					</div>
				</div>
			<!-- </scroller> -->
		</div>
		<div class="add-addr">
			<x-button class="btn-add" @click.native="addFn">添加地址</x-button>
		</div>
		<loading :show="loading.show" :text="loading.msg"></loading>
	</div>
</template>
<script>
	import {  XHeader,Loading,XButton, Scroller} from 'vux'
	// var url = require('aUrl'); 
	export default{
		components:{
			XHeader,
			XButton,
			Scroller,
			Loading
		},
		mounted(){
			this.setTitle("选择收货地址");
			this.loading.show = true;
			this.requestData();
		},
		data(){
			return{
				path:this.$route.query.path,
				noItem:false,
				/*pullupConfig:{
                  content: '上拉加载',
                  downContent: '释放加载',
                  upContent: '上拉加载',
                  loadingContent: '加载中'
                },
                 pulldownConfig:{
                  content: '下拉刷新',
                  downContent: '释放刷新',
                  upContent: '下拉刷新',
                  loadingContent: '刷新中'
                },*/
                list:[],
                lastIndex:1,
                itemsPerLoad:20,
                loading:{
		         show:false,
		         msg:'数据加载中'
			    },
			}
		},
		methods:{
			requestData(){	
				let self = this		
				self.$http.get('/sh/ja/v1/address',{limit:this.itemsPerLoad,page:this.lastIndex})
         			 .then(function(res) {
         			 	// console.log('=============')
         			 self.loading.show = false;
		            if(res.data.data.length>0){
		            	self.noItem = true;
		            	if(self.lastIndex == 1){
		            		self.list = [];
		            	}
		           	 	self.list = [...self.list,...res.data.data];

		          // 		 this.$nextTick(() => {
					       //     this.$refs.scroller.reset();
			       		// })

		         //   	 	if(!res.data.hasNext){
		         //   	 		this.$broadcast('pullup:disable', this.$refs.scroller.uuid)
		         //   	 	}else{
					    	 // this.$broadcast('pullup:enable', this.$refs.scroller.uuid)
		         //   	 	}
		           	 }else{
		           	 	if(self.lastIndex == 1){
		           	 		self.noItem = false;
		           	 	}
		           	 }
		          })
			},

			loadMore () {
				  this.lastIndex++;
			      this.requestData();
			       // setTimeout(() => {
					     //    this.$nextTick(() => {
					     //       this.$broadcast('pullup:reset', this.$refs.scroller.uuid)
			       // 		})
			     	 // }, 2000)
	   			 },

		    refresh () {
		    	  this.lastIndex = 1;
			      this.requestData();
			      setTimeout(() => {
					        this.$nextTick(() => {
					        this.$broadcast('pulldown:reset', this.$refs.scroller.uuid)
			       		})
			     	 }, 2000)
			    },

			  addFn:function(){
			  	let query = this.$route.query;
			  	this.$router.push({path:'/account/addaddress',query:query});
			  },

			  edit:function(addressId){
			  	let query = this.$route.query;
			  	query.addressId = addressId;
			  	this.$router.push({path:'/account/addaddress',query:query});
			  },

			  detail:function(addressId){
			   	let query = this.$route.query;
			   	
			   	query.addressId = addressId;
			   	let _path = this.$route.query.path;
			   	console.log(_path)
			   	delete query.path;
			   	console.log(query)
			   	this.$router.push({path:_path,query:query});
			   	
			  }
			}
	}
</script>
<style scoped lang='less'>
	.content{
		bottom: 1.6rem;
	}
	.full-screen{
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		position: absolute;
		background-color:#f1f1f1;
	}
	.addrscroll-wrap{
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    bottom: 0;
    overflow: scroll;
  }
	.div-flex{
		padding-left: 0.75rem;
		padding-right: 0.75rem;
		padding-top: 0.6rem;
		padding-bottom: 0.6rem;
		background-color: #fff;
		flex-direction: row;
		align-items: center;
		display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
	    display: -moz-box; /* 老版本语法: Firefox (buggy) */
	    display: -ms-flexbox; /* 混合版本语法: IE 10 */
	    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
	    display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
		padding-bottom: 0.75rem;
		margin-top: 0.3rem;
	}
	.flex-left{
		display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
	    display: -moz-box; /* 老版本语法: Firefox (buggy) */
	    display: -ms-flexbox; /* 混合版本语法: IE 10 */
	    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
	    display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
		flex-direction: column;
		margin-right: 0.75rem;
		flex: 1;
	}
	.flex-name{
		justify-content:space-between;
		display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
	    display: -moz-box; /* 老版本语法: Firefox (buggy) */
	    display: -ms-flexbox; /* 混合版本语法: IE 10 */
	    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
	    display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
		flex-direction: row;
	}
	.text{
		font-size: 0.75rem;
		color: #262626;
	}
	.single-line{
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-top: 0.2rem;
		max-width: 500/40rem;
		 display:block;
	    white-space:nowrap; 
	    overflow:hidden; 
	    text-overflow:ellipsis;
	}
	.add-addr{
		height: 2.1rem;
		line-height: 2.4rem;
		background-color: #fff;
		text-align: center;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.btn-add{
		background-color: #38446A!important;

	}
</style>
<style type="text/css" lang='less'>
	.add-addr .weui-btn:after,.addrListChangeBtn button.weui-btn:after{
		border:1px solid #38446A!important;
	}
	.add-addr .weui-btn_default{
		background-color: #fff;
		color: #fff!important;
	}
	.addrListChangeBtn button.weui-btn{
		font-size: 14px;
		background-color: #fff;
		color: #38446A!important;

	}
</style>
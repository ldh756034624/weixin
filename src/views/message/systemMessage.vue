<template >

	<div transition = "app" style="width:100%;height:100%"> 
		<x-header :left-options="{showBack: true}" >留言</x-header>
		<Scroller v-ref:scroller lock-x scrollbar-y use-pullDown use-pullUp :pulldown-config="pullDownConfig" :pullup-config="pullUpConfig" @pulldown:loading="refresh" @pullup:loading="loadMore" :pulldown-status.sync="pulldownStatus" :pullup-status.sync="pullupStatus">
			<div></div>
			<div>

				<div v-for = "item in messagesArray" class="lineBottom" style="padding: 0.75rem;position:relative">
					<div class = "flexFull flexRow flexItemsStart" style="position:relative;margin:0rem">
						<div class="flexColumn flexContentStart flexItemsCenter">
							<img style="width:3rem;height:3rem;border-radius:1.5rem;background-color: #f60000"/>
							<badge text=" " style="width:0.8rem;height:0.8rem;position:absolute;top: 0rem;left:2.05rem"></badge>
						</div>
						
						<div class="flexColumn flexContentCenter flexFull" style="margin-left: 0.75rem ">
							<div class="flexRow flexContentBetween" style="margin-bottom: 0.75rem">
								<p class="fontSizeBig textBlack" >猪猪二货官方</p>
								<p class="fontSizeSmall textGray">{{item.dealTime}}</p>
							</div>
							
							<span class="fontSizeMidium textGray" style="word-break:break-all; word-wrap:break-word ;">{{item.processMsg}}</span>
						</div>
						
						
					</div>
					
				</div>
			</div>
			

		</Scroller>
	</div>
</template>

<script>
import Scroller from 'vux-components/scroller'
import Loading from 'vux-components/loading'
import spinner from 'vux-components/spinner'
import badge from 'vux-components/badge'
import Vue from 'vue'
import XHeader from 'vux-components/x-header'

// var url = require('aUrl');
var currentPage = 1;
var limit = 10;
// var hasNext = false;

export default{
	components:{
		Scroller,
		Loading,
		spinner,
		badge,
		XHeader
	},
	ready:function(){
		this.setTitle("留言");
		this.refresh();
	},

	data(){
		return{
			pulldownStatus:'default',
			pullupStatus:'default',
			messagesArray:[
			{
				processMsg:'haohaohhhhdfsdfasfdsfsdfsffddfsdfsdfsdfsdfdfsdfhaohaohhhhdfsdfasfdsfsdfsffddfsdfsdfsdfsdfdfsdfhaohaohhhhdfsdfasfdsfsdfsffddfsdfsdfsdfsdfdfsdf',
				dealTime:'2000-2-2',
			},
			],
			pullUpConfig:{
  			 	content: '上拉加载',
  			 	pullUpHeight: 60,
  			 	height: 40,
  			 	autoRefresh: false,
  			 	downContent: '释放加载',
  			 	upContent: '上拉加载',
  			 	loadingContent: '加载中',
  			 	clsPrefix: 'xs-plugin-pullup-'
  			},
  			pullDownConfig:{
  				content: '下拉刷新',
  			 	height: 60,
  			 	autoRefresh: false,
  			 	downContent: '下拉刷新',
  			  	upContent: '释放刷新',
  			  	loadingContent: '加载中',
  			  	clsPrefix: 'xs-plugin-pulldown-'
  			},
			
		}

	},

	methods:{

		init:function(){

		},
		loadData(pageIndex,finished){
			// Vue.http.headers.common['token'] = (localStorage.token) ? localStorage.token : 'e3be0d6e-d66c-48f2-9f38-9281166af148';
			let self = this
			self.$http.get('/sh/ja/v1/systemmsg/all?page='+currentPage+'&&limit='+limit).then(function(res){

				for (var i = 0; i < res.data.data.length; i++) {
					self.messagesArray.push(res.data.data[i]);
				};

				if (res.data.hasNext) {
					self.$broadcast('pullup:enable', self.$refs.scroller.uuid);
				}else{
					self.$broadcast('pullup:disable', self.$refs.scroller.uuid);
					console.log('没有更多数据');
				}


				self.$nextTick(()=>{
					self.$refs.scroller.reset();
					self.$broadcast('pulldown:reset',self.$refs.scroller.uuid);
					finished();
				});

			}).catch(function(data, status, request) {
            	console.log('fail' + status + "," + request);

            	self.$nextTick(()=>{
					self.$refs.scroller.reset();
					self.$broadcast('pulldown:reset',self.$refs.scroller.uuid);
					self.$broadcast('pullup:disable', self.$refs.scroller.uuid);
				});
        	});
		},
		refresh(){
			currentPage = 1;
			// this.messagesArray = [];
			this.loadData(currentPage,(()=>{
				
			}));

		},

		loadMore(){
			currentPage++;
			this.loadData(currentPage,(()=>{
				// this.$broadcast('pulldown:reset',this.$refs.scroller.uuid);
			}));
		}
	}
}
</script>


<style scoped>
.flexFull{
  flex:1;
  align-content:stretch;
}
.flexRow{
  display: flex;
  flex-direction:row;
}

.flexColumn{
  display: flex;
  flex-direction:column;
}
.flexContentStart{
  justify-content:flex-start;
}

.flexContentBetween{
  justify-content:space-between;
}

.flexContentCenter{
  justify-content:center;
}
.flexItemsCenter{
  align-items:center;
}
.flexItemsStart{
	align-items:felx-start;
}

.fontSizeBig{
	font-size: 0.75rem;
	line-height: 0.75rem;
}

.fontSizeMidium{
	font-size: 0.7rem;
	line-height: 0.7rem;
}

.fontSizeSmall{
	font-size: 0.6rem;
	line-height: 0.6rem;
}
.textGray{
	color:#999999;
}
.textBlack{
	color: #242424;
}

.lineBottom{
  border-width: 0.0025rem;
  border-bottom-style: solid;
  border-color: #eeeeee;
}
</style>
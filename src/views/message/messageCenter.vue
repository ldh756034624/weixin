<template>

	
	<div transition = "app" style="width:100%;height:100%;background-color:ff5060">

		<div style="height:3.2rem;width:100%;position: relative;background-color: #ff5060;overflow: hidden">
			<div class="flexColumn flexContentCenter flexItemsCenter" style="width:100%;position: absolute;top: 1rem;bottom:0rem"><p style="color:#ffffff;font-size: 1rem">消息</p></div>
		</div>
		<Scroller scrollbar-y lock-x>
			<div>
				<div v-for="item in items" class="flexRow flexContentBetween flexItemsCenter lineBottom" style="height:2.4rem;padding: 0.75rem" @click="jumTo(item.url)">
					
						<img style="height:1.75rem;width:1.75rem;border-radius: 0.875rem" :src=item.imageName>
						<p class="flex flexFull fontSizeBig textBlack" style="margin-left:0.7rem ">{{item.title}}</p>
						<div class="flexRow flexContentBetween flexItemsCenter" style="height:2.4rem">
							<p v-show="item.unreadCount!==0" class="fontSizeSmall textGray">{{item.unreadCount}}</p>
							<!-- <img src="/img/message/arrow.png" style="width:0.4rem;height:0.8rem;margin-left: 0.75rem;line-height: 0.8rem"/> -->
						</div>
					
				 </div>
			</div>
		</Scroller>
		<div style="position: fixed;width:100%;height:100%;z-index: 1000;left:0rem;top: 0rem;background-color: rgb(0.9922,0.6000,0.4118,0.5)">
			
		</div>
		
	</div>
</template>

<script>
import Scroller from 'vux-components/scroller'

import Vue from 'vue'
// var url = require('aUrl');
export default{
	components:{
		Scroller,
	},
	ready:function(){
		this.setTitle("消息");
		this.loadData();
	},

	data(){
		return{
			items:[
			{
	 			//imageName:'/img/message/comment_msg.png',
				unreadCount:0,
				title:'留言',
				url:'/comment_msg'
	 		},
	 		{
	 			//imageName:'/img/message/conversation_msg.png',
				unreadCount:0,
				title:'私信',
				url:''
	 		},
	 		{
	 			//imageName:'/img/message/system_msg.png',
				unreadCount:0,
				title:'系统通知',
				url:'/system_msg'
	 		},
			],
		}
	},

	methods:{
		loadData(){
			let self = this
			// Vue.http.headers.common['token'] = (localStorage.token) ? localStorage.token : 'e3be0d6e-d66c-48f2-9f38-9281166af148';
			self.$http.get('/sh/ja/v1/comments/unread').then(function(res){
				self.$set('items[0].unreadCount',res.data.data);
				// console.log('finished comment');
				// console.log(res.data);
			});
			self.$http.get('/sh/ja/v1/systemmsg/unread').then(function(res){
				self.$set('items[2].unreadCount',res.data.data);
				// console.log('finished sys');
				// console.log(res.data);
			});

		},

		jumTo(url){
			this.$route.router.go({path:url});
		}

	}
}


</script>

<style scoped>
.flex{
	display: flex;
}
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
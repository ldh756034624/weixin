<template>
	<div class="page full-screen addAddr" transition="app">
		<!-- <x-header class="" :left-options="{showBack:true}">
			{{isEdit?'编辑收货地址':'添加收货地址'}}
			<a @click="save" slot="right" style="font-size: 0.8rem;color:#262626">保存</a>
		</x-header> -->
		<div class="addressMain">
			<div class="sectionBox">
				<div class="div-content margin-top">
					<div class="div-key">
						<span class="text-key">联系人</span>
					</div>
					<input class="input-value" v-model="address.contact" type="text" placeholder="请输入姓名" maxlength="10">
					</div>
				<div class="div-content">
					<div class="div-key"></div>
					<label>
						<input class="rb-male" :checked="address.gender == 0" name="sex" type="radio" @click="radioClick(0)">
						<span class="rb-text">先生</span>
					</label>
					<label>
						<input class="rb-male" :checked="address.gender == 1" name="sex" style="margin-left: 1.4rem;" type="radio" @click="radioClick(1)">
						<span class="rb-text">女士</span>
					</label>
				</div>
				<div class="div-content">
					<div class="div-key">
						<span class="text-key" style="display: inline-block">联系电话</span>
					</div>
					<input class="input-value" maxlength="11" v-model="address.phone" type="number" placeholder="请输入电话号码">
					</div>
			</div>
			<div  class="margin-top sectionBox">
				<div class="div-content">
					<div class="div-key">
						<span class="text-key" style="word-break:keep-all;">地址</span>
					</div>
					<x-address title='' class="seleAddr" v-model="valueAddr" placeholder="请选择" raw-value :list="addressData"></x-address>
				</div>
				<div class="div-content">
					<div class="div-key">
						<span class="text-key">详细地址</span>
					</div>
					<input class="input-value" maxlength="50" type="text" v-model="address.room1" placeholder="请输入详细的门牌号或地址">
					</div>
			</div>
			<div class="saveAddrBtn-wrap">
				<button @click="show=true" v-if="isEdit"  class="deleteBtn WhiteBtn flex div-content-item margin-top">
					删除收货地址
				</button>
				<button class="BlueBtn saveAddrBtn" @click="save">
					保存
				</button>
			</div>

		</div>
		<confirm v-model="show" confirm-text="确定" cancel-text="取消" title="操作提示" @on-confirm="deleteFn">
		  <p style="text-align:center;">是否删除该地址?</p>
		</confirm>
		<loading :show="loading.show" :text="loading.msg"></loading>
		<!-- toast 提示 -->
		<!-- <toast :show.sync="toast.show" type="text" :time="1000" :callback="callback">
			<p v-text="toast.msg"></p>
		</toast> -->
	</div>
</template>

<script>
	import {  XHeader,Loading,XAddress, ChinaAddressV3Data, Value2nameFilter as value2name, Name2valueFilter as name2value,Confirm} from 'vux'
	// var url = require('aUrl');
	export default{
		components:{
			XHeader,
			XAddress,
			Loading,
			Confirm
		},
		mounted:function(){
			if(this.$route.query.addressId){
				this.isEdit = true;
				this.addressId = this.$route.query.addressId;
				this.getAdress();
		    }else{
				this.isEdit = false;
		   	}
		   	let title = this.isEdit?'编辑收货地址':'添加收货地址';
		   	this.setTitle(title);
		},
		data(){
			return{
				path:this.$route.query.path,
				addressId:0,
				isEdit:false,
				addressData: ChinaAddressV3Data,
				valueAddr:[],
				phoneExp:/0?(13|14|15|17|18)[0-9]{9}/,
				address:{
					contact:'',
					gender:0,
					phone:'',
					village:'',
					room1:''
				},
				loading:{
			       show:false,
			       msg:'保存中...'
			    },
			    toast : {
			       show : false,
			       msg: ''
			    },
			    show: false
			};
		},
		methods:{
			getAdress:function(){
				let self = this
				self.loading.show = true;
				self.loading.msg = '加载中...';
				self.$http.get('/sh/ja/v1/setting/address/get/'+this.addressId)
         			 .then(function(res) {
         			self.loading.show = false;
         			if(res.data.statusCode == 0){
		           	 	self.address = res.data.data;
		           	 	if(self.address.village != ''){
							var addr = self.address.village.split(' ');
							var addrIds = name2value(addr, ChinaAddressV3Data).split(' ');
							self.valueAddr = [...self.valueAddr, ...addrIds]
							// for(var i = 0;i<addrIds.length;i++){
							// 	self.valueAddr.push(addrIds[i]);
							//    }

				        }
		        	  }
         		})
			},

			radioClick:function(sex){
				this.address.gender = sex;
			},
			deleteFn:function(){
				let self = this
				self.$http.delete('/sh/ja/v1/setting/address/'+this.address.id)
         			 .then(function(res) {
         			self.loading.show = false;
         			if(res.data.statusCode == 0){
		           	 	let query = self.$route.query;
		           	 	// self.$router.replace({path:'/account/addresslist',query:query});
		           	 	self.$router.replace({path:'/account/addresslist'});
		        	  }
		        	  self.toast.show = true;
         			  self.toast.msg = res.data.msg;
         		})
			},
			save:function(){
				let self = this
				self.address.village = value2name(self.valueAddr, ChinaAddressV3Data);
				if(self.address.contact == ''){
					self.toast.show = true;
					self.toast.msg = '请输入收货人姓名';
					self.$vux.toast.show({
		                text: '请输入手机号',
		                type: 'text',
		            })
					return;
				}
				if(self.address.phone == ''){
					self.$vux.toast.show({
		                text: '请输入收货人电话',
		                type: 'text',
		            })
					return;
				}
				if(!self.phoneExp.test(self.address.phone)){
					self.$vux.toast.show({
		                text: '请输入正确的手机号',
		                type: 'text',
		            })
					return;
				}
				if(self.address.village.length <= 0){
					self.$vux.toast.show({
		                text: '请选择收货地址',
		                type: 'text',
		            })
					return;
				}
				if(self.address.room1.length <= 0){
					self.$vux.toast.show({
		                text: '请输入门牌号',
		                type: 'text',
		            })
					return;
				}
				self.$http.post('/sh/ja/v1/setting/address',self.address)
         			 .then(function(res) {
         			self.loading.show = false;
         			if(res.data.statusCode == 0){
         				// if(this.$route.query.path){
         				//   this.$router.push({path:this.$route.query.path});
         				// }else{
         				self.$router.replace({path:'/account/addresslist',query:self.$route.query});
         				// }
		        	  }else{
         			 	self.$vux.toast.show({
		                  text:  res.data.msg,
		                  type: 'text',
		                })
         		      }
         		})
			  }
		}
	}
</script>
<style scoped lang='less'>
	.addressMain{
		margin: 20/40rem;
	}
	.sectionBox{
		padding: 30/40rem;
	}
	.full-screen{
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		position: absolute;
		background-color:#f1f1f1;
	}
	.div-content{
		display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
	    display: -moz-box; /* 老版本语法: Firefox (buggy) */
	    display: -ms-flexbox; /* 混合版本语法: IE 10 */
	    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
	    display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
		flex-direction: row;
		align-items: center;
	}
	.margin-top{
		margin-top: 20/40rem;
	}
	.text-key{
		color:#262626;
		font-size: 0.75rem;
		line-height: 2.5rem;
	}
	.input-value{
		color:#262626;
		font-size: 0.75rem;
		outline: none;
		height:100%;
		border:0;
		flex: 1;
		margin-right: 0.75rem;
	}
	.rb-male{
		width: 0.8rem;
		height: 0.8rem;
		vertical-align: middle;
		margin-bottom: 0.075rem;
		border: 0;
		-webkit-appearance: none;
		outline: none;
		background: url('../../assets/img/mian/ic_like_unselect.png');
		background-size: 100% 100%;

	}
	.rb-male:checked{
		background: url('../../assets/img/mian/ic_like_select.png') no-repeat;
		background-size: 100% 100%;
	}
	.rb-text{
		font-size:0.75rem;
		color:#262626;
		vertical-align: middle;
	}
	.div-key{
		width: 4.2rem;
	}

	.seleAddr{
		width: 100%;
	}
	.saveAddrBtn-wrap{
		padding: 0 10/40rem;
	}
	.saveAddrBtn,.deleteBtn{
	  height: 92/40rem;
	  line-height: 92/40rem;
      margin-top: 60/40rem;
      font-size: 38/40rem;
	}
	.marginT25{
		margin-top: 25/14rem;
	}
</style>
<style type="text/css" lang='less'>
	.addAddr{
		.seleAddr .vux-popup-picker-select{
			text-align: left!important
		}
		.seleAddr .vux-cell-box:before{
			border-top: none!important
		}
		.vux-popup-picker-value,.vux-popup-picker-placeholder{
			font-size: 30/40rem;
		}
		.weui-cell{
			padding-right: 0;
		}
	}
</style>
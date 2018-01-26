<template>
	<div class="empty">
		<img class="no-coupon" :src="img1" v-if="state==1">
		<p class="text">{{text}}</p>
	</div>
</template>
<script>
	export default{
		ready() {
		},
		props: {
			img1: {
				type: String,
				default: require('../assets/img/hotel/img_detailerror@2x.png')
			},
			text: {
				type: String,
				default:''
			},
			state: {
				type: String,
				default: "1"
			}
		}
	}
</script>
<style lang="less" scoped>
	.empty{
		position: absolute;
		left: 0;
		right: 0;
		top:44px;
		bottom: 0;
		background-color: #fff;
		text-align: center;
		img{
			width: 250/40rem;
			margin-top: 50%;
		}
		p.text{
			margin-top: 30px;
			color:#B3B3B3;
			font-size:0.9rem;
		}
	}
</style>
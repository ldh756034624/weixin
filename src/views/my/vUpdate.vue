<template>
		<div class="page shopPage">
      <main>
        <div>
          <p>亲爱的高炉家用户</p>
          <p>
             我们从2017年12月12日将使用“酒元”代替现有的积分的发放和使用，原V币获取渠道和兑换服务将停止，同时酒元的获取和使用将变得更加的丰富，您将更容易获取和使用酒元，希望这次升级能给你带来更好的用户体验。
        您账户剩余的V币可以按 10V币 = 1酒元 的比例兑换成酒元，赶快兑换成酒元换取各类好礼吧！
          </p>
        </div>
        <p>截止2017-12-12 12:12您有</p>
        <div>
          <div>
            <p>182</p>
            <p>v币</p>
          </div>
          <img src="">
          <div>
            <p>18.2</p>
            <p>酒元</p>
          </div>
        </div>
        <x-button class='' @click.native="">立即兑换  </x-button>
      </main>  
		</div>
</template>

<script>
import { XButton} from 'vux'
export default {
  mounted() {
    let self=this;
    this.setTitle('v币升级');
  },
  data() {
    return {
      show:true,
    }
  },
  methods:{
  },
  components: {
    XButton
  }
}
</script>
<style scoped lang='less'>
</style>
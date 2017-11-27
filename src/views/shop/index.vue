<template>
		<div class="page shopPage">
      <!-- <div v-transfer-dom>
        <alert v-model="show" title="$t('Congratulations')" @on-show="onShow" @on-hide="onHide">正在开发中！</alert>
      </div> -->
      <Bottombar :index="1"></Bottombar>
		</div>
</template>

<script>

import Bottombar from '@/components/BottomBar'
export default {
  // directives: {
  //   TransferDom
  // },
  mounted() {
    let self=this;
    self.showPlugin();
  },
  data() {
    return {
      show:true,
    }
  },
  methods:{
    showPlugin () {
      this.$vux.alert.show({
        content: '正在开发中！',
        onHide () {
          history.go(-1)
        }
      })
    },
    onHide:function(){

    }
  },
  components: {
    Bottombar
  }
}
</script>
<style scoped lang='less'>
</style>
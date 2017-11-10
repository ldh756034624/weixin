<template>
	<div class="page">
    <Particulars :particularsUrl="url" :particularsStr="particularsType"></Particulars>
  </div>
</template>
<script>
import Particulars from '@/components/particulars'
export default {
  mounted(){
    let  self=this;
    self.setTitle('钱包明细');
  },
  data () {
    return {
      url:'h9/api/account/balance/detail',
      particularsType:'purse'
    }
  },
  methods:{
    init(){
      let self = this
    }
  },
   components: {
    Particulars
  },
}

</script>

<style scoped lang='less'>
    

</style>
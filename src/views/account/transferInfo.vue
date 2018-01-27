<template>
	<div class="page">
    <Particulars :particularsUrl="url" :particularsStr="particularsType" :typeStr="type"></Particulars>
  </div>
</template>
<script>
import Particulars from '@/components/particulars'
export default {
  mounted(){
    let  self=this;
    self.setTitle('转账明细');
  },
  data () {
    return {
      type: this.$route.query.type || '1',
      url:'/h9/api/user/transactions',
      particularsType:'Transfer'
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

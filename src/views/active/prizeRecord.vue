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
    self.setTitle('红包记录');
  },
  data () {
    return {
      url:'/h9/lottery/history',
      particularsType:'hongbao',
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
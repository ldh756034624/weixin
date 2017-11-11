<template>
	<div class="page problemPage">
    <group class='problemBox'>

      <cell title="问题" link='' is-link></cell>
      <cell title="问题" link='' is-link></cell>
    </group>
    
  </div>
</template>
<script>
import { Group,Cell} from 'vux'
export default {
  mounted(){
    this.setTitle('常见问题');
  },
  data () {
    return {
    }
  },
  methods:{
  },
   components: {
    Group,Cell
  },
}

</script>
<style scoped lang='less'>
  .problemPage{
    background: #fff;
  }
</style>
<style lang='less'>
  .problemBox{
    .weui-cells:before,.weui-cells:after,.weui-cell:before {
      border:none;
    }
    .weui-cell{
      padding: 30/40rem;
    }
    .vux-label{
      font-size: 30/40rem;
    }
  }
</style>

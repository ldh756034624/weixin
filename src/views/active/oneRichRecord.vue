<template>
  <div class="page">
    <load-more :dataUrl="dataUrl"></load-more>
  </div>
</template>
<script>
import { Scroller } from "vux"
import LoadMore from "@/components/loadMore"

export default {
  created() {
    this.setTitle("参与记录")
  },
  data() {
    return {
      dataUrl: "/h9/api/bigrich/userRecord"
    }
  },
  methods: {
    loadMore() {
      console.log(11111)
    }
  },
  components: {
    Scroller,
    LoadMore
  }
}
</script>

<style scoped lang='less'>
p {
  line-height: 1;
}
</style>

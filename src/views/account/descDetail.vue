<template>
  <div class="dealPage">
    <div class="content" v-html='articleData'></div>
  </div>
</template>
<script>
  import {Group, Cell} from 'vux'

  export default {
    created() {
      this.code = this.$route.query.code
      this.init()
    },
    data() {
      return {
        articleData: null,
        isHtml: false
      }
    },
    methods: {
      init() {
        let self = this
        self.$http.get(`/h9/api/common/pageJson/${this.code}`)
          .then(res => {
            if (res.data.code == 0) {
              let data = res.data.data
              self.articleData = data.content
              this.setTitle(data.title)
            }
          })
      }
    },
    components: {
      Group, Cell
    }
  }

</script>
<style lang='less' scoped>
  .dealPage {
    padding: 20/40rem;
  }
</style>

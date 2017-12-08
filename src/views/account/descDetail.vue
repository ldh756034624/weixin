<template>
  <div class="articlePage">
    <div class="content" v-if="isHtml" v-html='articleData.content'></div>
    <div class="content" v-else>{{articleData.content}}</div>
  </div>
</template>
<script>
  import {Group, Cell} from 'vux'

  export default {
    created() {
      this.code = this.$route.query.code
      this.setTitle('酒元说明')
      this.init()
    },
    data() {
      return {
        articleData: {},
        isHtml: false,
      }
    },
    methods: {
      init() {
        let self = this
        self.$http.get(`/h9/api/common/page/moneyUseDescription`)
          .then(function (res) {
            if (res.data.code == 0) {
              self.articleData = res.data.data
              console.log(res.data.data)
              if (self.articleData.content.indexOf('div') != -1 || self.articleData.content.indexOf('p') != -1) {
                self.isHtml = true
              } else {
                self.isHtml = false
              }
            }
          })
      }
    },
    components: {
      Group, Cell
    },
  }

</script>
<style scoped lang='less'>
  .articlePage {
    height: 100%;
    width: 97%;
    overflow-y: auto;
    background: #fff;
    padding-top: 3%;
    padding-left: 3%;
    .title {
      font-size: 36/40rem;
      line-height: 58/40rem;
      color: #333;
    }
    .date {
      color: #999;
      font-size: 32/40rem;
      margin: 30/40rem 0 60/40rem;
      span {
        margin-right: 10/40rem;
      }
    }
    .content {
      color: #666;
      font-size: 28/40rem !important;
      line-height: 46/40rem;
      img {
        width: 100%;
      }
    }
  }
</style>
<style lang='less'>
  .articlePage {
    .content {
      color: #666;
      font-size: 28/40rem !important;
      font-size: 14px !important;
      line-height: 46/40rem;
      p {
        font-size: 14px !important;
      }
      .gameExplain-cont {
        img {
          width: 100%;
        }
      }
    }
  }
</style>

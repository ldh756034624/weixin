<template>
  <div class="articlePage">
    <div v-if="isArticle">
      <p class="title">{{articleData.title}}</p>
      <p class="date"><span>{{articleData.createTime}}</span>{{articleData.userName}}</p>
      <div class="content" v-if="isHtml" v-html='articleData.content'></div>
      <div class="content" v-else>{{articleData.content}}</div>
    </div>
    <div v-else>
      <!--todo 到时候改成html-->
      <div class="content">{{articleData}}</div>
    </div>
  </div>
</template>
<script>
  import {Group, Cell} from 'vux'

  export default {
    mounted() {
      this.setTitle('文章详情');
      this.init();
    },
    data() {
      return {
        id: this.$route.query.id,
        articleType: this.$route.query.type,
        articleData: {},
        isHtml: false,
        isArticle: true // 是否是文章
      }
    },
    methods: {
      init() {
        let self = this
        if (this.articleType === 'hotel') {
          this.isArticle = false
          this.$http.get('h9/api/hotel/info?hotelId=' + self.id).then(res => {
            this.articleData = res.data
          })
        } else {
          this.isArticle = true
          self.$http.get('h9/api/article/' + self.id)
            .then(function (res) {
              if (res.data.code == 0) {
                self.articleData = res.data.data
                if (self.articleData.content.indexOf('div') != -1 || self.articleData.content.indexOf('p') != -1) {
                  self.isHtml = true
                } else {
                  self.isHtml = false
                }
              }
            })
        }
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

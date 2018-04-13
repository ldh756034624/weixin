<template>
  <div class="page bg"
       v-if="activity">
    <div class="content"
         :style="{'background-color':activity.bgColor || 'transparent'}">
      <div class="box">
        <div class="activity"
             v-for="item in activity.modules"
             :key="item.moduleId">
          <img class="bigImg"
               :src="item.img">
          <div class="list-wrap"
               v-for="(goods, i) in item.goodsInfo"
               :key="goods.goodsId"
               v-if="goods.img"
               @click="goodsClick(goods.goodsId)">
            <div :class="{'ml': i%2!=0}"
                 class="activity-box">
              <div class="img-box">
                <img class="bg-img"
                     v-if="activity.borderImg"
                     :src="activity.borderImg">
                <img class="deal-img"
                     :src="goods.img">
                <!-- 下面是已售罄等效果图 -->
                <!-- <img class="poop-icon"
                     v-if="it.poopFlag"
                     src="../../assets/img/cart1/sale.png">
                <img class="out-img"
                     v-if="it.store == 0"
                     src="../../assets/img/out.png"> -->
              </div>
              <p class="img-title font-two-line-ellipsis"
                 :style="{'color':activity.titleColor||'#666'}">{{goods.name}}</p>
              <p class="img-price">
                <span :style="{'color':activity.priceColor||'#666'}">¥{{goods.price}}</span>
                <!-- <span style="font-size:0.55rem;padding-left:0.5rem;"
                      :style="{'color':activity.themeInfo.line_color?activity.themeInfo.line_color:'#666'}">{{activity.themeInfo.lineName?activity.themeInfo.lineName:''}}
                </span> -->
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- <div v-if="isWeixin"
           v-link="{path:'/home/home'}"
           class="cart home">
        <img src="../../assets/img/activity/home.png">
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  created() {
    this.id = this.$route.query.id || 2
    this.getActivity()
  },
  data() {
    return {
      deal: {},
      activity: null
    }
  },
  methods: {
    // 获取活动内容
    getActivity() {
      let self = this
      this.$http.get(`/h9/api/goodsTopic/${this.id}`).then(res => {
        if (res.data.code === 0) {
          let activeData = res.data.data // 总数据
          this.activity = activeData // 总数据
          this.setTitle(activeData.name) // 设置title
        }
      })
    },
    // 进入详情页
    goodsClick(id) {
      let u = navigator.userAgent
      let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1 //android终端
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
      let isWeixin =
        u.toLowerCase().match(/MicroMessenger/i) == "micromessenger"
      if (isWeixin) {
        this.$router.push({ path: `/shopDataile?id=` + id })
      } else if (isAndroid) {
        androidInterface.activeProject(JSON.stringify({ id }))
      } else if (isiOS) {
        try {
          window.webkit.messageHandlers.activeProject.postMessage(id.toString())
        } catch (error) {
          alert(error)
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.content {
  top: 0;
  bottom: 0;
  overflow: hidden;
}
.box {
  height: auto;
  width: 100%;
  float: left;
  .activity {
    height: auto;
    width: 100%;
    float: left;
    .bigImg {
      width: 100%;
      float: left;
    }
    .list-wrap {
      height: auto;
      float: left;
      overflow: hidden;
      width: 50%;
      height: auto;
      padding-bottom: 98/40rem;
      .activity-box {
        width: 280/40rem;
        height: auto;
        margin: 0 auto;
        .img-box {
          height: 358/40rem;
          overflow: hidden;
          position: relative;
          img {
            width: 100%;
            position: absolute;
          }
          .poop-icon {
            width: 60/40rem;
            height: 68/40rem;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 10;
          }
          .bg-img {
            height: 100%;
          }
          .deal-img {
            width: 90%;
            margin-left: 5%;
            top: 50%;
            margin-top: -126/40rem;
            z-index: 1;
            border-radius: 20/40rem;
          }
          .out-img {
            width: 70%;
            margin-left: 15%;
            margin-top: 82/40rem;
            z-index: 2;
          }
        }
        .img-title {
          font-size: 24/40rem;
          min-height: 80/40rem;
        }
        .img-price {
          font-size: 36/40rem;
        }
        .button {
          font-size: 24/40rem;
          border-radius: 0.25rem;
          width: 280/40rem;
          height: 52/40rem;
          display: block;
          box-sizing: border-box;
          padding-top: 7/40rem;
          text-align: center;
          border: 1px solid transparent;
        }
      }
    }
  }
}
.ml {
  margin-left: 0rem;
}
.cart {
  width: 80/40rem;
  height: 80/40rem;
  position: fixed;
  left: 1rem;
  bottom: 1rem;
  z-index: 5;
  img {
    width: 80/40rem;
    height: 80/40rem;
  }
  .red-dot {
    position: absolute;
    z-index: 6;
    top: -0.3rem;
    left: 65%;
    color: #fff;
    background: red;
    border-radius: 50%;
    width: 0.8rem;
    height: 0.8rem;
    line-height: 0.8rem;
    font-size: 24/40rem;
    text-align: center;
  }
}
.home {
  bottom: 155/40rem;
}
</style>

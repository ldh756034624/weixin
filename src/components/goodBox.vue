<template>
		<div class="selledImgBox">
        <!-- <img :src='goodImg.imageList[0]' class="mySelledImg" />
        <div class="mySelledDescBox">
            <p class="title ellipsis">{{goodImg.title}}</p>
            <p class="redFont price" :class="[hasDesc!=true ? 'priceMrg' : '']"><i>¥</i>{{goodImg.price | price2}}</p>
            <p class="status"  v-if="hasDesc==true">{{goodImg.orderStatusName}} </p>
        </div> -->
        <img :src='ImgSrc' class="mySelledImg" />
        <div class="mySelledDescBox">
            <p class="title ellipsis">{{title}}</p>
            <p class="redFont price" :class="[hasDesc!=true ? 'priceMrg' : '']"><i>¥</i>{{price | price2}}</p>
            <p class="status"  v-if="hasDesc==true">{{statusDesc}} </p>
        </div>
		</div>
</template>

<script>

export default {
  mounted() {
    let self=this;
  },
   props:{
   /* goodImg: {
      type: Object,
      default: {}
    },*/
    hasDesc: {
      type: Boolean
    },
    ImgSrc: {
      type: String
    },
    title:{
      type: String
    },
    price:{
      type: Number
    },
    statusDesc:{
      type: String
    }
  },
  data() {
    return {
    }
  },
  methods:{
  },
}
</script>
<style scoped lang='less'>
  .selledImgBox{
      padding: 30/40rem;
      display: flex;
    }
  .mySelledImg{
      width: 194/40rem;
      height: 194/40rem;
      margin-right: 20/40rem;
      vertical-align: middle;
    }
    .mySelledDescBox{
      display: inline-block;
      vertical-align: middle;
      line-height: 50/40rem;
      width: 11rem;
    }
    .title{
      font-size: 30/40rem;
      margin-bottom: 25/40rem;
      overflow: hidden;
      white-space: normal;
      text-overflow:ellipsis;
    }
    .price i{
      font-size: 24/40rem;
      font-style: normal;
    }
    .status{
      font-size: 24/40rem;
      color: #5669A2
    }
    .price{
      font-size: 26/40rem;
      height: 1.2rem;
    }
    .priceMrg{
      margin-top: 2.2rem;
    }
</style>
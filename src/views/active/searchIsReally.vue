<template>
	<div class="page searchRealPage">
    <img src="../../assets/img/active/tubiao@2x.png" class="searcLogo" />
    <div class="searchBox">
      <div class="searchProgress">
        <div class="progBlock">
          <label>1</label>
          <p>打开瓶盖</p>
        </div>
        <img src="../../assets/img/active/icon_xiayibu@2x.png"/>
        <div class="progBlock">
          <label>2</label>
          <p>获防伪码</p>
        </div>
        <img src="../../assets/img/active/icon_xiayibu@2x.png"/>
        <div class="progBlock">
          <label>3</label>
          <p>输防伪码</p>
        </div>
        <img src="../../assets/img/active/icon_xiayibu@2x.png"/>
        <div class="progBlock">
          <label>4</label>
          <p>点击查询</p>
        </div>
      </div>
      <!-- <group> -->
        <x-input v-model='code' class='searchInput' placeholder='请输入防伪码'></x-input>
        <x-button class='searchBtn' @click.native='searchRealFn'>查询真伪</x-button>
      <!-- </group> -->
    </div>
    <div class="searchResultBox" v-if='showResult'>
      <div v-if='isReal'>
        <div class="flexBox">
          <label>产品名称</label>
          <p class="flex1 alignR TextEllipsis">{{searchData.productName}}</p>
        </div>
        <div class="flexBox">
          <label>查询次数</label>
          <p class="flex1 alignR TextEllipsis">{{searchData.queryCount}} </p>
        </div>
        <div class="flexBox">
          <label>首次查询时间</label>
          <p class="flex1 alignR TextEllipsis"> {{searchData.lastQueryTime}}</p>
        </div>
        <div class="flexBox">
          <label>首次查询位置</label>
          <p class="flex1 alignR TextEllipsis"> {{searchData.lastQueryAddress}}</p>
        </div>
      </div>
      <div v-else>
        您所查询的防伪码不存在，谨防假冒！或与公司客服人员联系！
      </div>
    </div>
    <div class="searchDesc">
      <p>啊时间代付款拉萨街坊邻居撒风口浪尖撒旦了放假啦</p>
      <p>啊时间代付款拉萨街坊邻居撒风口浪尖撒旦了放假啦</p>
      <p>啊时间代付款拉萨街坊邻居撒风口浪尖撒旦了放假啦</p>
    </div>
  </div>
</template>
<script>
import {Group,XInput,XButton} from 'vux'
// var url = require('aUrl')
export default {
  mounted(){
    let  self=this;
    self.setTitle('查询真伪');
    self.init();
  },
  data () {
    return {
      searchData:{},
      code:'',
      showResult:false,
      isReal:false
    }
  },
  methods:{
    init(){
      let self = this
      
    },
    searchRealFn:function(){
      let self=this;
      if(!self.code){
        _g.toastMsg('error','请输入防伪码');
        return;
      }
      self.$http.get('h9/lottery/product/check?code='+self.code+'&longitude='+self.$store.state.longitude+'&latitude='+self.$store.state.latitude)
        .then(function(res) {
          self.showResult=true;
          if(res.data.code==0){
            self.isReal=true;
            self.searchData=res.data.data
          }else{
            self.isReal=false;
          }
        })
    }
    
  },
   components: {
    Group,XInput,XButton
  },
}

</script>

<style scoped lang='less'>
  .searchRealPage{
    background: #FE5850;
    text-align: center;
    overflow-y:auto;
    padding: 30/40rem;
    .searcLogo{
      width: 260/40rem;
      height: 260/40rem;
      margin: 30/40rem 0 20/40rem ;
    }
    .searchBox{
      background: #FF726B;
      border-radius: 10/40rem;
      padding: 40/40rem 30/40rem;
      margin-bottom: 20/40rem
    }
    .searchProgress{
      color: #fff;
      img{
        width: 56/40rem;
        height: 56/40rem;
        vertical-align: top;
        margin-top: 15/40rem;
      }
    }
    .progBlock{
      display: inline-block;
      font-size: 24/40rem;
      label{
        font-size: 48/40rem;
      }
    }
    .searchInput{
      font-size: 36/40rem;
      background: rgba(255,255,255,0.9);
      border-radius: 10/40rem;
      margin-top: 40/40rem;
    }
    .searchBtn{
      font-size: 36/40rem;
      color: #333;
      margin: 20/40rem 0;
      background: #FFCF40;
      color: #333;
      height: 100/40rem;
    }
    .searchResultBox{
      padding: 10/40rem 30/40rem;
      border-radius: 10/40rem;
      background: #fff;
      font-size: 24/40rem;
      color: #999;
      line-height: 50/40rem;
      label{
        width: 4rem;
        text-align: left;
      }
      .alignR{
        color: #333;
      }
    }
    .searchDesc{
      background: #FF726B;
      font-size: 24/40rem;
      padding: 30/40rem;
      margin-top: 20/40rem;
      line-height: 40/40rem;
      color: #fff;
      text-align: left;
    }
  }
</style>
<style lang='less'>
  .searchRealPage{
    .searchInput .weui-input{
      text-align: center;
    }
  }
</style>
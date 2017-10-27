<template>
  <div class="page publishSale">
        <div  class="publishSale">
          <PublishTpl ref='publishtpl' :datas='salePublishData' :publishUrl='saleUrl'></PublishTpl>
          <main class='saleMain'>
              <group class='radius'>
                <p class="tipText">拍卖选项</p>
                <x-input title='起拍价' type="number" v-model="salePublishData.startPrice" :show-clear='false'><img slot="right" src=''/></x-input>
                <x-input title='保证金' type="number"  v-model="salePublishData.ensurePrice" :show-clear='false'><img slot="right" src=''/></x-input>
                <x-input title='加价幅度' type="number"  v-model="salePublishData.offsetPrice" :show-clear='false'><img slot="right" src=''/></x-input>
                <datetime  title="开始时间" v-model="startTime" confirm-text="确定" cancel-text="取消" :min-year=2017 :max-year=2020 :start-date="startDate" :format="format" @on-change="changeStartTime"></datetime>
                <datetime  title="结束时间" v-model="endTime" confirm-text="确定" cancel-text="取消" :min-year=2017 :max-year=2020 :start-date="startDate" :format="format" @on-change="changeEndTime"></datetime>
              </group>
              <div class="commonbtn-wrap">
                  <x-button @click.native="publish"  mini class="commonbtn">确定发布</x-button>
              </div>
          </main>
      </div>
  </div>
</template>

<script>
import {  Group, XInput,Datetime,XButton,Scroller } from 'vux'
import PublishTpl from '@/components/publishTpl'

export default {
  mounted(){
    let self=this;
    self.setTitle('发布拍卖');
    var myDate = new Date();
    myDate.toLocaleDateString();
    //self.startDate=myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-'+myDate.getDate()+" "+myDate.getHours()+":"+(myDate.getMinutes()+15)
    self.startDate=myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-'+myDate.getDate();
   
  },
  data () {
    return {
      salePublishData:{
          startPrice:'',
          ensurePrice:'',
          offsetPrice:'',
          startTime:'',
          endTime:''
      },
      format: 'YYYY-MM-DD HH:mm',
      saleUrl:'/sh/ja/v1/auction/release',
      startDate:'',
      startTime:'',
      endTime:'',
      offLoading:''
    }
  },
  methods:{
    changeStartTime(value){
      let self=this;
        self.salePublishData.startTime=value+':00';
    },
    changeEndTime(value){
      let self=this;
        self.salePublishData.endTime=value+':00';
    },
    publish(){
      this.$refs.publishtpl.publish();
    }
  },
   components: {
    Group,
    XInput,
    PublishTpl,
    Datetime,
    XButton,
    Scroller
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
    .publishSale{
      height: 100%;
      overflow-y: scroll;
    }
    .saleMain{
      margin: -0.5rem 0.5rem 0 0.5rem;
      border-radius: 15/40rem;
    }

</style>
<style lang='less'>
  .saleMain .weui-cell,.saleMain .weui-input,.saleMain p{
     font-size: 30/40rem!important;
  }
  .saleMain p{
    width: 220/40rem;
  }
  .saleMain .tipText{
     padding: 20/40rem 30/40rem;
     color: #999;
  }
  .saleMain .weui-cells:before {
    border-top: none!important;
  }
</style>

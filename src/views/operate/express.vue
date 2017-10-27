<template>
<div class="page refundpage" transition="app">

    <div class="express radius">
      <group title="" class="refund-cell radius">
        <selector title="物流配送" placeholder="请选择物流公司" :options="list" v-model='select' @on-change="changeCP"></selector>
        <x-input v-if="zdyshow" title="&nbsp;" placeholder="请输入物流公司" :required="true" v-model='input2'></x-input>
        <x-input title="快递单号" placeholder="请输入快递单号" type="number" :required="true" v-model='input'></x-input>

      </group>
    </div>
    <p class="noExpress" v-show='!showNoexpress' @click='confirmShow=true'>无需物流>></p>
  <footer>
    <div class="orderBtnBox">
      <button class="orderBtn WhiteBtn" @click="goBack">取消</button>
      <button class="orderBtn BlueBtn" @click="refundgoodApply()">确定</button>
    </div>
  </footer>
  <confirm v-model="confirmShow" class='listConfirm'  title="确定选择无需物流?"  @on-confirm="onConfirmFn"></confirm>
</div>
</template>

<script>
import { XHeader, Selector, Group, XInput, Tabbar,Confirm} from 'vux'
import wx from 'weixin-js-sdk'
// var url = require('aUrl');
export default {
  mounted () {
    let self=this;
    self.setTitle("添加发货信息");
    console.log("=============")
    console.log(self.isBuyer=='true')
    console.log(self.isBuyer)
    if(self.isBuyer){
      self.showNoexpress=true
      console.log("333")
    }else{
      self.showNoexpress=false
    }
  },
  data() {
    return {
      expressExp: /^\w+$/,
      list: [{"key":"zt","value":"中通快递"},{"key":"yt","value":"圆通快递"},{"key":"st","value":"申通快递"},{"key":"yd","value":"韵达快递"},{"key":"tt","value":"天天快递"},{"key":"ems","value":"EMS"},{"key":"zjs","value":"宅急送快递"},{"key":"sf","value":"顺丰速运"},{"key":"zdy","value":"其它 (自定义)"}],
      zdyshow: false,
      select:'',
      input2:'',
      input:'',
      confirmShow:false,
      hasExpress:true,
      fromPage:this.$route.query.fromPage,
      isBuyer:this.$route.query.isBuyer,
      showNoexpress:false,

    };
  },
  methods:{
    init: function () {
      let self =  this;
    },
    refundgoodApply: function(){    //买家添加退款物流信息
      let self = this
      var key = self.select,type=0;//type物流有无
      var expressName = self.getValue(key);
      if(key == "zdy"){
        expressName = self.input2;
      }
      let _data={},rcmurl='';
      if(self.hasExpress){
        type=0;
        if(self.isBuyer){
          rcmurl='/sh/ja/v1/buyer/send';
          _data= {expressName: expressName,trackNumber: self.input,orderId:self.$route.query.orderId};
        }else{
          rcmurl='/sh/ja/v1/myOrder/idleGoods/sellerDeliver/'+self.$route.query.orderId+'/'+type;
          _data= {expressName: expressName,trackNumber: self.input};
        }
        
        if(!_data.expressName){
          if(key == "zdy"){
            self.$vux.toast.show({
              text: '请填写物流公司',
              type: 'text',
            })
          }else{
            self.$vux.toast.show({
              text: '请选择物流公司',
              type: 'text',
            })
          }
          self.toast.show = true;
          return;
        }
        if(!self.expressExp.test(_data.trackNumber)){
          self.$vux.toast.show({
              text: '请输入正确的快递单号',
              type: 'text',
            })
          return;
        }
      }else{
        type=1//type1无需物流,0需要物流
      }
      
      self.$http.post(rcmurl,_data)
        .then(function(res) {
          if(res.data.statusCode==0){
            if(self.fromPage){
              self.$router.push({path:'/account/orderdetail',query:{orderId:self.$route.query.orderId}})
            }else{

              history.go(-1)
            }
          } else {
           _g.toastMsg('error', res.data.msg)
          }
        })
    },
    goBack: function(){
      history.go(-1);
    },
    changeCP: function(key){
      console.log(key)
      if(key=='zdy'){
        this.zdyshow = true;
      }else{
        this.zdyshow = false;
      }
    },
    getValue: function(key){
      for(var i=0,n=this.list.length;i<n;i++){
        if(key==this.list[i].key){
          return this.list[i].value;
        }
      }
      return "";
    },
    scan: function(){
      let self = this;
      wx.ready(function () {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            self.$refs.input.value = result.split(",")[1];
          }
        });
      });
    },
    onConfirmFn:function(){
      let self=this;
      self.hasExpress=false;
      self.refundgoodApply()
    }
  },
  components: {
    XHeader,
    Selector,
    Group,
    XInput,
    Tabbar,Confirm
  }
}
</script>
<style scoped lang='less'>
  .submit-bar{
    .grid50{
      text-align: center;
      line-height: 98/40rem;
      font-size: 30/40rem;
      color: #ff5060;
      &.ok{
        background-color: #ff5060;
        color: #fff;
      }
    }
  }
  .listConfirm .weui-dialog__bd{
    min-height: 0!important;
  }
</style>
<style lang='less'>
  .noExpress{
    padding: 0 30/40rem;
    font-size: 26/40rem;
    text-align: right;
    color: #38446A
  }
  .express{
    margin: 30/40rem 20/40rem;
    border:1px solid #f0f0f0;
    .weui_cells{
      margin-top: 0;
    }
    .weui-cells{
      margin-top: -20/40rem;
    }
    .weui-label{
      width: 150/40rem;
    }
    .weui-label,.weui-cell__bd{
      font-size: 30/40rem;
      color: #222;
    }
    .weui-cells:before{
      border-top: none!important;
    }
    .refund-cell{
      margin-top: 20/40rem;
    }
    .weui_select_after{
      padding-left: 0; 
    }
    .weui_cell{
      padding: 0;
      padding-left: 30/40rem;
    }
    .weui_select{
      height: 98/40rem;
      line-height: 98/40rem;
      font-size: 30/40rem;
      color: #262626;
    }
    .weui_label{
      color: #999;
      font-size: 30/40rem;
      width: 178/40rem !important;
      line-height: 98/40rem; 
    }
    .weui_input{
      height: 100%;
      font-size: 30/40rem;
    } 
    .weui_cells:before{
      width: 0;
    }
    .weui_cells:after{
      display: none;
    }
    [class*=" weui_icon_"]:before, [class^=weui_icon_]:before{
      margin-right: 30/40rem;
    }
    .weui_icon_warn:before{
      font-size: 30/40rem;
    }
  }
  .refundpage{
    .weui_tabbar:before{
      width: 0;
    }
  }
  /*.scan{
    width: 36/40rem;height: 36/40rem;
    margin-left: 0;background-image: url('../../assets/img/saomiao.png');background-size: 100% 100%;background-repeat: no-repeat;
    margin-right: 15/40rem !important;
  }*/
  .orderBtnBox{
      display: flex;
      padding: 0 15/40rem;
      margin:  60/40rem 0;
     }
     .orderBtn{
      flex:1;
      height: 90/45rem;
      border:none;
      border-radius: 15/40rem;
      margin: 0 15/40rem;
     }
     .orderBtnBox .orderBtn:first-child{
      border:1px solid #f0f0f0;
     }
</style>
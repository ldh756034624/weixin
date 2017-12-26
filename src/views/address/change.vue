<template>
		<div class="page addrChangePage">
      <group class='groupNoTop groupNoLine'>
        <x-input title='收货人' :show-clear="false" v-model='addressParams.name' :min='2' :max='20'></x-input>
        <x-input title='联系方式' :show-clear="false" v-model='addressParams.phone' :min='7' :max='16' type='tel' is-type='china-mobile'></x-input>
        <addr ref='addres'></addr>
        <x-textarea title="详细地址" v-model="addressParams.address" :max='200' :show-counter='false' placeholder='街道、楼牌号等'></x-textarea>
        <p class="default" @click='isDefault=!isDefault'><span class='defaultIcon ' :class="[isDefault ? 'hasSet':'unSet']"></span> 设为默认</p>
      </group>
      <footer>
        <div>
          <x-button class='bottomBtn gradientBtn' @click.native="save">保存</x-button>
        </div>
      </footer>
		</div>
</template>

<script>
import { Group,XInput,XButton,XTextarea,XSwitch,Popup,Cell,TransferDom,XAddress, Value2nameFilter as value2name, Name2valueFilter as name2value} from 'vux'
import list from '@/util/list.json'
import addr from '@/components/address'
export default {
  directives: {
    TransferDom
  },
  mounted() {
    let self=this;
    this.setTitle('添加新地址');
    console.log(this.$route.query.fromOrder)
    if(this.$route.query.isEdit){ //编辑状态赋值
      this.setTitle('修改地址');
      var editObj=JSON.parse(this.addrEditObj)
      this.addressParams=editObj;
      this.$refs.addres.pid=editObj.pid
      this.$refs.addres.cid=editObj.cid

      if(editObj.distict){
        this.$refs.addres.addr=editObj.province+editObj.city+editObj.distict
        this.$refs.addres.aid=editObj.aid
      }else{
        this.$refs.addres.addr=editObj.province+editObj.city
      }
      if(editObj.defaultAddress==1){
        this.isDefault=true
      }
    }
  },
  data() {
    return {
      showAddr:false,
      addressParams:{},
      address:[],
      isDefault:false,
      goodsId:this.$route.query.goodsId,
      addrEditObj:this.$route.query.addrObj
    }
  },
  methods:{
    save:function(){
      if(!this.addressParams.name){
        _g.toastMsg('error','请输入收货人')
        return;
      }
      if(this.addressParams.phone.length<2 || this.addressParams.phone.length>20 ){
        _g.toastMsg('error','请正确填写收货人')
        return;
      }
      if(!this.addressParams.phone){
        _g.toastMsg('error','请输入联系方式')
        return;
      }
      if(this.addressParams.phone.length<7 || this.addressParams.phone.length>16 ){
        _g.toastMsg('error','请正确输入联系方式')
        return;
      }
      if(!this.$refs.addres.addr || this.$refs.addres.addr=='请选择'){
        _g.toastMsg('error','请填写地区')
        return;
      }
      if(!this.addressParams.address){
        _g.toastMsg('error','请填写详细地址')
        return;
      }
      this.addressParams.pid=this.$refs.addres.pid
      this.addressParams.cid=this.$refs.addres.cid
      this.addressParams.aid=this.$refs.addres.aid
      if(this.isDefault===true){
        this.addressParams.defaultAddress=1
      }else{
        this.addressParams.defaultAddress=0
      }
      var postUrl=''
      if(this.$route.query.isEdit){
        postUrl='h9/api/address/update/'+this.addressParams.id
      }else{
        postUrl='h9/api/address/add'
      }
      this.$http.post(postUrl,this.addressParams)
        .then((res)=>{
          if(res.data.code==0){
            _g.toastMsg('error','保存成功')
            if(this.$route.query.fromOrder){
//              if(this.$route.query.isEdit){
//                this.$router.replace({path:'/addrList',query:{goodsId:this.goodsId,fromOrder:this.$route.query.fromOrder}})
//              }else{
                setTimeout(()=>{
                  this.addressParams.proCity = this.$refs.addres.addr
                  this.addressParams.addressId = res.data.data.id
                  this.$router.replace({path:'/shopOrder',query:{id:this.goodsId,addrObj:JSON.stringify(this.addressParams)}})
                },1500)
//              }

            }else{
              setTimeout(()=>{
                this.$router.replace({path:'/addrList',query:{goodsId:this.goodsId}})
              },1500)
            }
          }
        })

    },
    logHide (str) {
      let self=this;
      console.log(self.address)
      var addr=value2name(self.address, list).split(' ')
      console.log(addr)
    }
  },
  components: {
    Group,XInput,XTextarea,XSwitch,XButton,Popup,Cell,XAddress,addr
  }
}
</script>
<style scoped lang='less'>
  .addrChangePage{
    padding-top: 20/40rem;
    background: #fff;
    .default{
      padding: 30/40rem 0;
      margin: 0 30/40rem;
      border-top:2/40rem solid #ddd;
      font-size: 30/40rem;
    }
    .defaultIcon{
      display: inline-block;
      vertical-align: middle;
      margin-right: 10/40rem;
      width: 31/40rem;
      height: 31/40rem;
    }
    .unSet{
      background: url('../../assets/img/addr/oval_copy2.png');
      background-size: 100%;
    }
    .hasSet{
      background: url('../../assets/img/addr/queding.png');
      background-size: 100%;
    }
  }

  .bottomBtn {
    height: 100/40rem;
    line-height: 100/40rem;
    color: #fff;
    position: fixed;
    bottom: 0;
    z-index: 9;
    border-radius: 0;
    width: 100%;
    text-align: center;
    font-size: 32/40rem;
  }
</style>
<style lang='less'>
  .addrChangePage{
    .weui-cell{
      padding: 30/40rem;
      font-size: 30/40rem;
    }
    .weui-label{
      font-size: 30/40rem;
      width: 150/40rem!important;
    }
    .weui-input{
      text-align: right;
    }
    .weui-input,.vux-popup-picker-value,.weui-textarea{
      font-size: 30/40rem;
    }
    .vux-cell-box:before{
      border-top: none;
    }
    .weui-icon-warn,.weui-cell_warn{
      color: #4d4d4d;
    }
    .weui-icon-warn:before{
      content: '';
    }
    .vux-x-input .weui-icon{
      padding: 0;
    }
    .vux-x-input .vux-input-icon{
      font-size: 0;
      width: 0;
    }
  }
</style>
